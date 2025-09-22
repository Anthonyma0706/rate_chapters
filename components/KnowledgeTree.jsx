'use client'

import { useState, useEffect } from 'react'
import { calculateActualProgress } from '../lib/subjectParser'

const RATING_LABELS = {
  1: '完全不会',
  2: '基本不会', 
  3: '一般掌握',
  4: '比较熟练',
  5: '完全掌握',
  '?': '不清楚/未接触'
}

function KnowledgeItem({ item, onRatingChange, ratings }) {
  const currentRating = ratings[item.id] || 0
  
  const handleRatingClick = (rating) => {
    const newRating = currentRating === rating ? 0 : rating
    onRatingChange(item.id, newRating)
  }

  // 计算子项的平均分数
  const calculateAverageRating = (node) => {
    const allRatableItems = []
    
    const collectRatableItems = (items) => {
      items.forEach(child => {
        if (child.level >= 2 || (child.level === 1 && (!child.children || child.children.length === 0))) {
          const rating = ratings[child.id]
          if (rating && rating !== '?' && rating > 0) {
            allRatableItems.push(rating)
          }
        }
        if (child.children && child.children.length > 0) {
          collectRatableItems(child.children)
        }
      })
    }
    
    if (node.children && node.children.length > 0) {
      collectRatableItems(node.children)
    }
    
    if (allRatableItems.length === 0) return null
    
    const average = allRatableItems.reduce((sum, rating) => sum + rating, 0) / allRatableItems.length
    return Math.round(average * 10) / 10 // 保留一位小数
  }

  const averageRating = calculateAverageRating(item)
  const showAverage = averageRating !== null && (item.level === 0 || item.level === 1) && item.children && item.children.length > 0

  return (
    <div className={`knowledge-item level-${item.level || 0}`}>
      <div className={`knowledge-title level-${item.level || 0}`}>
        <span>
          {item.title}
          {showAverage && (
            <span className="average-rating">
              （平均分: {averageRating}）
            </span>
          )}
        </span>
        {(item.level >= 2 || (item.level === 1 && item.children.length === 0)) && (
          <div className="rating-container">
            {[1, 2, 3, 4, 5, '?'].map((rating) => (
              <button
                key={rating}
                className={`rating-button ${currentRating === rating ? 'selected' : ''} ${rating === '?' ? 'unknown-rating' : ''}`}
                onClick={() => handleRatingClick(rating)}
                title={RATING_LABELS[rating]}
              >
                {rating}
              </button>
            ))}
            {(currentRating > 0 || currentRating === '?') && (
              <span className="rating-label">
                {RATING_LABELS[currentRating]}
              </span>
            )}
          </div>
        )}
      </div>
      
      {item.children && item.children.length > 0 && (
        <div className="knowledge-children">
          {item.children.map((child) => (
            <KnowledgeItem
              key={child.id}
              item={child}
              onRatingChange={onRatingChange}
              ratings={ratings}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function KnowledgeTree({ data, subjectId }) {
  const [ratings, setRatings] = useState({})
  const storageKey = subjectId ? `knowledgeRatings_${subjectId}` : 'knowledgeRatings'
  
  // Load ratings from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRatings = localStorage.getItem(storageKey)
      if (savedRatings) {
        try {
          setRatings(JSON.parse(savedRatings))
        } catch (error) {
          console.error('Error loading ratings from localStorage:', error)
        }
      }
    }
  }, [storageKey])

  // Save ratings to localStorage whenever ratings change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(ratings))
    }
  }, [ratings, storageKey])

  const handleRatingChange = (itemId, rating) => {
    setRatings(prev => ({
      ...prev,
      [itemId]: rating
    }))
  }

  const exportRatings = () => {
    const exportData = generateExportData(data, ratings)
    const markdown = generateMarkdown(exportData)
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(markdown).then(() => {
        alert('评分数据已复制到剪贴板！')
      }).catch(err => {
        console.error('复制失败:', err)
        fallbackCopy(markdown)
      })
    } else {
      fallbackCopy(markdown)
    }
  }

  const fallbackCopy = (text) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      alert('评分数据已复制到剪贴板！')
    } catch (err) {
      console.error('复制失败:', err)
      alert('复制失败，请手动复制以下内容：\n\n' + text)
    }
    document.body.removeChild(textArea)
  }

  const clearRatings = () => {
    const confirmMessage = subjectId 
      ? '确定要清空当前学科的评分数据吗？此操作不可撤销。'
      : '确定要清空所有评分数据吗？此操作不可撤销。'
    
    if (confirm(confirmMessage)) {
      setRatings({})
      if (typeof window !== 'undefined') {
        localStorage.removeItem(storageKey)
      }
      alert('评分数据已清空！')
    }
  }

  const generateExportData = (items, ratings) => {
    const result = []
    
    // 计算平均分的辅助函数
    const calculateAverage = (node) => {
      const allRatableItems = []
      
      const collectRatableItems = (items) => {
        items.forEach(child => {
          if (child.level >= 2 || (child.level === 1 && (!child.children || child.children.length === 0))) {
            const rating = ratings[child.id]
            if (rating && rating !== '?' && rating > 0) {
              allRatableItems.push(rating)
            }
          }
          if (child.children && child.children.length > 0) {
            collectRatableItems(child.children)
          }
        })
      }
      
      if (node.children && node.children.length > 0) {
        collectRatableItems(node.children)
      }
      
      if (allRatableItems.length === 0) return null
      return Math.round(allRatableItems.reduce((sum, rating) => sum + rating, 0) / allRatableItems.length * 10) / 10
    }
    
    const processItem = (item, level = 0) => {
      const rating = ratings[item.id]
      const hasRating = rating && (rating > 0 || rating === '?')
      const averageRating = calculateAverage(item)
      
      if (hasRating || averageRating !== null || (item.children && item.children.length > 0)) {
        const exportItem = {
          title: item.title,
          level,
          rating: hasRating ? rating : null,
          ratingLabel: hasRating ? RATING_LABELS[rating] : null,
          averageRating: averageRating,
          children: []
        }
        
        if (item.children && item.children.length > 0) {
          item.children.forEach(child => {
            const childData = processItem(child, level + 1)
            if (childData) {
              exportItem.children.push(childData)
            }
          })
        }
        
        return exportItem
      }
      
      return null
    }
    
    items.forEach(item => {
      const exportItem = processItem(item)
      if (exportItem) {
        result.push(exportItem)
      }
    })
    
    return result
  }

  const generateMarkdown = (exportData) => {
    const title = subjectId ? `${subjectId} 知识点评分导出` : '知识点评分导出'
    let markdown = `# ${title}\n\n`
    markdown += `导出时间: ${new Date().toLocaleString('zh-CN')}\n\n`
    
    const processItem = (item, depth = 0) => {
      const indent = '  '.repeat(depth)
      const bullet = depth === 0 ? '##' : '-'
      let line = `${indent}${bullet} ${item.title}`
      
      if (item.rating) {
        line += ` **(${item.rating === '?' ? '?' : item.rating + '/5'} - ${item.ratingLabel})**`
      } else if (item.averageRating !== null && (depth === 0 || depth === 1)) {
        line += ` **（平均分: ${item.averageRating}/5）**`
      }
      
      markdown += line + '\n'
      
      if (item.children && item.children.length > 0) {
        item.children.forEach(child => {
          processItem(child, depth + 1)
        })
      }
    }
    
    exportData.forEach(item => {
      processItem(item)
      markdown += '\n'
    })
    
    return markdown
  }

  const getProgressStats = () => {
    return calculateActualProgress(data, ratings)
  }

  const stats = getProgressStats()

  return (
    <div>
      {/* Progress Stats */}
      <div className="progress-container">
        <h2 className="progress-title">评分进度统计</h2>
        <div className="progress-stats">
          <div className="progress-stat">
            <div className="progress-stat-number">{stats.progress}%</div>
            <div className="progress-stat-label">完成进度</div>
          </div>
          <div className="progress-stat">
            <div className="progress-stat-number">{stats.rated}</div>
            <div className="progress-stat-label">已评分项目</div>
          </div>
          <div className="progress-stat">
            <div className="progress-stat-number">{stats.excellent}</div>
            <div className="progress-stat-label">掌握良好</div>
          </div>
          <div className="progress-stat">
            <div className="progress-stat-number">{stats.needsWork}</div>
            <div className="progress-stat-label">需要加强</div>
          </div>
          <div className="progress-stat">
            <div className="progress-stat-number">{stats.unknown || 0}</div>
            <div className="progress-stat-label">不清楚</div>
          </div>
          <div className="progress-stat">
            <div className="progress-stat-number">{stats.total}</div>
            <div className="progress-stat-label">总知识点</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="btn btn-primary" onClick={exportRatings}>
          📋 导出评分
        </button>
        <button className="btn btn-danger" onClick={clearRatings}>
          🗑️ 清空数据
        </button>
      </div>

      {/* Knowledge Tree */}
      <div className="knowledge-tree">
        {data.map((item) => (
          <KnowledgeItem
            key={item.id}
            item={item}
            onRatingChange={handleRatingChange}
            ratings={ratings}
          />
        ))}
      </div>
    </div>
  )
}