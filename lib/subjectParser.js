// Subject data parser and categorization utilities

const SUBJECT_ICONS = {
  '数学': '📐',
  '物理': '⚡',
  '化学': '🧪', 
  '生物': '🌿'
}

const GRADE_LEVELS = {
  '初中': {
    name: '初中',
    order: 1,
    description: '初级中学'
  },
  '高中': {
    name: '高中', 
    order: 2,
    description: '高级中学'
  }
}

const SUBJECT_ORDERS = {
  '数学': 1,
  '物理': 2,
  '化学': 3,
  '生物': 4
}

export function parseSubjectFromFilename(filename) {
  // Remove .json extension
  const name = filename.replace('.json', '').replace('_tree', '')
  
  // Parse grade level
  let gradeLevel = ''
  if (name.startsWith('初中')) {
    gradeLevel = '初中'
  } else if (name.startsWith('高中')) {
    gradeLevel = '高中'
  }
  
  // Parse subject
  let subject = ''
  if (name.includes('数学')) {
    subject = '数学'
  } else if (name.includes('物理')) {
    subject = '物理'
  } else if (name.includes('化学')) {
    subject = '化学'
  } else if (name.includes('生物')) {
    subject = '生物'
  }
  
  // Parse book/semester info
  let bookInfo = name.replace(gradeLevel, '').replace(subject, '').replace(/^_/, '').replace(/_$/, '')
  
  // Generate display name
  let displayName = `${gradeLevel}${subject}`
  if (bookInfo) {
    if (bookInfo === '知识点') {
      displayName += ' 知识点总览'
    } else if (bookInfo.includes('必修')) {
      displayName += ' ' + bookInfo
    } else if (bookInfo.includes('选必')) {
      displayName += ' ' + bookInfo.replace('选必', '选择性必修')
    } else if (bookInfo.match(/^[七八九]\d*$/)) {
      const gradeMap = {
        '七': '七年级',
        '八': '八年级', 
        '九': '九年级'
      }
      const gradeChar = bookInfo.charAt(0)
      const semester = bookInfo.charAt(1) || ''
      displayName += ` ${gradeMap[gradeChar]}${semester ? '第' + semester + '学期' : ''}`
    } else {
      displayName += ' ' + bookInfo
    }
  }
  
  return {
    id: name,
    filename,
    gradeLevel,
    subject,
    bookInfo,
    displayName,
    icon: SUBJECT_ICONS[subject] || '📚',
    order: (GRADE_LEVELS[gradeLevel]?.order || 0) * 100 + (SUBJECT_ORDERS[subject] || 0) * 10
  }
}

export function groupSubjects(subjects) {
  const grouped = {}
  
  subjects.forEach(subject => {
    const key = `${subject.gradeLevel}_${subject.subject}`
    if (!grouped[key]) {
      grouped[key] = {
        gradeLevel: subject.gradeLevel,
        subject: subject.subject,
        icon: subject.icon,
        subjects: []
      }
    }
    grouped[key].subjects.push(subject)
  })
  
  // Sort subjects within each group
  Object.values(grouped).forEach(group => {
    group.subjects.sort((a, b) => {
      // 知识点总览排在最后
      if (a.bookInfo === '知识点' && b.bookInfo !== '知识点') return 1
      if (b.bookInfo === '知识点' && a.bookInfo !== '知识点') return -1
      
      // 按书名排序
      return a.bookInfo.localeCompare(b.bookInfo, 'zh-CN')
    })
  })
  
  return grouped
}

export function getAllSubjects() {
  // This would typically fetch from an API, but for now we'll define them statically
  const filenames = [
    '初中化学_九上_tree.json',
    '初中化学_九下_tree.json', 
    '初中化学_知识点_tree.json',
    '初中数学_七1_tree.json',
    '初中数学_七2_tree.json',
    '初中数学_九1_tree.json',
    '初中数学_九2_tree.json',
    '初中数学_八1_tree.json',
    '初中数学_八2_tree.json',
    '初中数学_知识点_tree.json',
    '初中物理_九_tree.json',
    '初中物理_八1_tree.json',
    '初中物理_八2_tree.json',
    '初中物理_知识点_tree.json',
    '高中化学_必修一_tree.json',
    '高中化学_必修二_tree.json',
    '高中化学_知识点_tree.json',
    '高中化学_选必一_tree.json',
    '高中化学_选必三_tree.json',
    '高中化学_选必二_tree.json',
    '高中数学_必修一_tree.json',
    '高中数学_必修二_tree.json',
    '高中数学_知识点_tree.json',
    '高中数学_选必一_tree.json',
    '高中数学_选必三_tree.json',
    '高中数学_选必二_tree.json',
    '高中物理_必修一_tree.json',
    '高中物理_必修三_tree.json',
    '高中物理_必修二_tree.json',
    '高中物理_知识点_tree.json',
    '高中物理_选必一_tree.json',
    '高中物理_选必三_tree.json',
    '高中物理_选必二_tree.json',
    '高中生物_必修1_tree.json',
    '高中生物_必修2_tree.json',
    '高中生物_知识点_tree.json',
    '高中生物_选必1_tree.json',
    '高中生物_选必2_tree.json',
    '高中生物_选必3_tree.json'
  ]
  
  return filenames.map(parseSubjectFromFilename)
}

export function getSubjectProgress(subjectId) {
  if (typeof window === 'undefined') return { total: 0, rated: 0, progress: 0 }
  
  try {
    const storageKey = `knowledgeRatings_${subjectId}`
    const ratings = JSON.parse(localStorage.getItem(storageKey) || '{}')
    const ratedCount = Object.values(ratings).filter(rating => rating > 0).length
    
    return {
      total: 0, // Will be calculated when data is loaded
      rated: ratedCount,
      progress: ratedCount > 0 ? Math.min(100, Math.round((ratedCount / 10) * 100)) : 0
    }
  } catch {
    return { total: 0, rated: 0, progress: 0 }
  }
}

export function calculateActualProgress(data, ratings) {
  const allRatableItems = []
  
  const collectRatableItems = (items) => {
    items.forEach(item => {
      if (item.level >= 2 || (item.level === 1 && (!item.children || item.children.length === 0))) {
        allRatableItems.push(item)
      }
      if (item.children && item.children.length > 0) {
        collectRatableItems(item.children)
      }
    })
  }
  
  collectRatableItems(data)
  
  const totalItems = allRatableItems.length
  const ratedItems = allRatableItems.filter(item => {
    const rating = ratings[item.id]
    return rating && (rating > 0 || rating === '?')
  }).length
  const excellentItems = allRatableItems.filter(item => ratings[item.id] >= 4).length
  const needsWork = allRatableItems.filter(item => ratings[item.id] > 0 && ratings[item.id] <= 2).length
  const unknownItems = allRatableItems.filter(item => ratings[item.id] === '?').length
  
  return {
    total: totalItems,
    rated: ratedItems,
    excellent: excellentItems,
    needsWork: needsWork,
    unknown: unknownItems,
    progress: totalItems > 0 ? Math.round((ratedItems / totalItems) * 100) : 0
  }
}