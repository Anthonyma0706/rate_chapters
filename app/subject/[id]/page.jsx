'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { parseSubjectFromFilename } from '../../../lib/subjectParser'
import KnowledgeTree from '../../../components/KnowledgeTree'

export default function SubjectPage({ params }) {
  const [subjectData, setSubjectData] = useState(null)
  const [knowledgeData, setKnowledgeData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSubjectData()
  }, [params.id])

  const loadSubjectData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const decodedId = decodeURIComponent(params.id)
      const filename = decodedId + '_tree.json'
      const subject = parseSubjectFromFilename(filename)
      
      setSubjectData(subject)
      
      const response = await fetch(`/knowledge_tree/${filename}`)
      if (!response.ok) {
        throw new Error(`加载数据失败: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      setKnowledgeData(data)
    } catch (err) {
      console.error('Error loading subject data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="subject-page">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          fontSize: '1.125rem',
          color: '#6b7280'
        }}>
          <div>
            <div style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '2rem' }}>
              📚
            </div>
            正在加载知识点数据...
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="subject-page">
        <Link href="/" className="back-link">
          ← 返回首页
        </Link>
        
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          padding: '1rem',
          margin: '1rem 0',
          color: '#dc2626'
        }}>
          <h3 style={{ marginBottom: '0.5rem', fontWeight: '600' }}>数据加载失败</h3>
          <p>{error}</p>
          <button 
            onClick={loadSubjectData}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  if (!subjectData || !knowledgeData.length) {
    return (
      <div className="subject-page">
        <Link href="/" className="back-link">
          ← 返回首页
        </Link>
        
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '0.75rem',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <p>暂无知识点数据</p>
        </div>
      </div>
    )
  }

  return (
    <div className="subject-page">
      <Link href="/" className="back-link">
        ← 返回首页
      </Link>
      
      <div className="subject-header">
        <div className="subject-header-icon">{subjectData.icon}</div>
        <h1 className="subject-header-title">{subjectData.displayName}</h1>
        <p className="subject-header-subtitle">
          点击数字按钮为知识点评分，评分结果会自动保存
        </p>
      </div>

      <KnowledgeTree 
        data={knowledgeData} 
        subjectId={subjectData.id}
      />
    </div>
  )
}