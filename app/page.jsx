'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllSubjects, groupSubjects, getSubjectProgress } from '../lib/subjectParser'

function SubjectCard({ subject }) {
  const [progress, setProgress] = useState({ total: 0, rated: 0, progress: 0 })
  
  useEffect(() => {
    setProgress(getSubjectProgress(subject.id))
  }, [subject.id])
  
  return (
    <Link href={`/subject/${encodeURIComponent(subject.id)}`} className="subject-card">
      <div className="subject-card-content">
        <div className="subject-icon">{subject.icon}</div>
        <h3 className="subject-title">{subject.displayName}</h3>
        {progress.rated > 0 && (
          <div className="subject-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress.progress}%` }}
              ></div>
            </div>
            <span className="progress-text">{progress.rated} 个知识点已评分</span>
          </div>
        )}
      </div>
    </Link>
  )
}

function SubjectGroup({ group }) {
  return (
    <div className="subject-group">
      <div className="subject-group-header">
        <h2 className="subject-group-title">
          {group.icon} {group.gradeLevel}{group.subject}
        </h2>
        <span className="subject-count">{group.subjects.length} 个教材</span>
      </div>
      <div className="subject-grid">
        {group.subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [subjects, setSubjects] = useState([])
  const [groupedSubjects, setGroupedSubjects] = useState({})
  const [stats, setStats] = useState({ totalSubjects: 0, completedSubjects: 0, totalRatings: 0 })
  
  useEffect(() => {
    const allSubjects = getAllSubjects()
    setSubjects(allSubjects)
    setGroupedSubjects(groupSubjects(allSubjects))
    
    // Calculate overall stats
    let totalRatings = 0
    let completedSubjects = 0
    
    allSubjects.forEach(subject => {
      const progress = getSubjectProgress(subject.id)
      totalRatings += progress.rated
      if (progress.rated > 0) completedSubjects++
    })
    
    setStats({
      totalSubjects: allSubjects.length,
      completedSubjects,
      totalRatings
    })
  }, [])
  
  const sortedGroups = Object.values(groupedSubjects).sort((a, b) => {
    // Sort by grade level first, then by subject
    const gradeOrder = { '初中': 1, '高中': 2 }
    const subjectOrder = { '数学': 1, '物理': 2, '化学': 3, '生物': 4 }
    
    if (a.gradeLevel !== b.gradeLevel) {
      return gradeOrder[a.gradeLevel] - gradeOrder[b.gradeLevel]
    }
    return subjectOrder[a.subject] - subjectOrder[b.subject]
  })
  
  return (
    <div className="homepage">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">知识点自评系统</h1>
          <p className="hero-description">
            科学评估知识掌握程度，精准定位学习重点。覆盖初高中主要学科，助力高效学习。
          </p>
          
          {/* Overall Stats */}
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number">{stats.totalSubjects}</div>
              <div className="hero-stat-label">教材数量</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">{stats.completedSubjects}</div>
              <div className="hero-stat-label">已开始学习</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">{stats.totalRatings}</div>
              <div className="hero-stat-label">累计评分</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="instructions-section">
        <h2 className="instructions-title">使用指南</h2>
        <div className="instructions-grid">
          <div className="instruction-item">
            <div className="instruction-icon">📖</div>
            <h3>选择教材</h3>
            <p>点击下方卡片选择要学习的学科教材</p>
          </div>
          <div className="instruction-item">
            <div className="instruction-icon">⭐</div>
            <h3>评分学习</h3>
            <p>为每个知识点评分（1-5星或?），系统自动保存</p>
          </div>
          <div className="instruction-item">
            <div className="instruction-icon">📊</div>
            <h3>追踪进度</h3>
            <p>查看学习进度，导出评分报告</p>
          </div>
          <div className="instruction-item">
            <div className="instruction-icon">🎯</div>
            <h3>精准学习</h3>
            <p>根据评分结果，重点学习薄弱知识点</p>
          </div>
        </div>
      </div>
      
      {/* Subject Groups */}
      <div className="subjects-section">
        <h2 className="subjects-title">选择学科教材</h2>
        {sortedGroups.map((group, index) => (
          <SubjectGroup key={`${group.gradeLevel}_${group.subject}`} group={group} />
        ))}
      </div>
    </div>
  )
}