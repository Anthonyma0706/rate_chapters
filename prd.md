# Next.js 知识点自评 MVP

这是一个最小可用的 Next.js (App Router) 应用完整代码集合，前端纯 Next.js + React，使用 LocalStorage 进行持久化。（无需数据库 / Supabase）。

---
- 页面会自动读取并渲染
- 用户点击分数按钮进行标记，标记会自动保存到 LocalStorage
- 不需要展示知识点id,展示树形结构和章节/小节/知识点即可，有良好的视觉和交互体验
- 评价的分数是用文字的形式进行导出/复制的，点击 "导出评分" 可以一键复制当前评分到剪贴板。markdown bullet list格式即可。
- 点击 "清空本地数据" 会删除 LocalStorage 中的评分纪录

UI设计风格
风格： 极简主义、现代感、理性专业
颜色： 大面积留白 + 深蓝为主色调，突出信息层次，冷静克制
字体： 无衬线字体，粗细搭配（标题加粗，正文细体），突出重点
布局： 左右分栏或大面积留白，模块化设计，呼吸感强
元素： 扁平化、线条简洁，少用装饰元素，强调文字内容
排版： 大标题 + 小副标题 + 简洁正文，使用对比增强层次感
氛围： 知性、轻量、现代，给人清晰、专业的阅读体验

## 文件结构（建议）

```
nextjs-knowledge-self-assessment-mvp/
├── package.json
├── next.config.js
├── README.md
├── data/
│   └── knowledge.json
├── app/
│   ├── layout.jsx
│   └── page.jsx
├── components/
│   └── KnowledgeTree.jsx
├── public/
│   └── favicon.ico
└── styles/
    └── globals.css
```

---

## package.json

```json
{
  "name": "knowledge-self-assessment-mvp",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}
```

> 如果你使用不同的 Next.js 版本，请调整版本号。14 只是示例，任何现代 Next.js 都可工作。

---

## next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}
module.exports = nextConfig
```

---

## data/[科目]_[课本]_tree.json

```json
[
  {
    "id": "520726ef-3288-41a9-be1a-b1c304e97fa8",
    "title": "第1章 走近细胞",
    "level": 0,
    "children": [
      {
        "id": "cf769916-8f4b-4eb1-9696-383e975b92f9",
        "title": "第1节 细胞是生命活动的基本单位",
        "level": 1,
        "children": [
          { "id": "2978e471", "title": "生物的基本特征及病毒（旧）", "level": 2, "children": [] },
          { "id": "8a1f69e9", "title": "生命活动与细胞的关系（旧）", "level": 2, "children": [] }
        ]
      }
    ]
  }
]
```

---

## README.md

```md
# Knowledge Self-Assessment (Next.js MVP)

快速启动：

1. 创建项目目录并把文件复制到对应位置。
2. 安装依赖：

```bash
npm install
```

3. 本地运行：

```bash
npm run dev
```

4. 打开浏览器： http://localhost:3000

---


