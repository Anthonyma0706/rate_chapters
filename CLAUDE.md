# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js-based knowledge self-assessment application that allows students to rate their understanding of educational content across multiple subjects. The application uses a hierarchical tree structure to organize knowledge points by chapters, sections, and individual topics.

## Data Structure

### Educational Content JSON Format
All educational content is stored in JSON files with the following hierarchical structure:

```json
[
  {
    "id": "unique-uuid",
    "title": "Chapter Title",
    "content": "",
    "children": [
      {
        "id": "unique-uuid", 
        "title": "Section Title",
        "content": "",
        "children": [
          {
            "id": "unique-uuid",
            "title": "Knowledge Point Title", 
            "content": "",
            "children": [],
            "level": 2
          }
        ],
        "level": 1
      }
    ],
    "level": 0
  }
]
```

### File Organization
- `/data/` - Contains current educational JSON files
- `/knowledge_tree/` - Contains additional educational JSON files for various subjects
- Naming convention: `[科目]_[课本]_tree.json` (Subject_Textbook_tree.json)

### Subject Coverage
- 初中 (Middle School): 数学 (Math), 物理 (Physics), 化学 (Chemistry)
- 高中 (High School): 数学 (Math), 物理 (Physics), 化学 (Chemistry), 生物 (Biology)
- Books include: 必修 (Required), 选必 (Elective Required), 知识点 (Knowledge Points)

## Development Commands

Based on the PRD specifications:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Development server runs on: http://localhost:3000

## Application Architecture

### Tech Stack
- **Framework**: Next.js 14+ with App Router
- **Frontend**: React 18+
- **Persistence**: LocalStorage (no database required)
- **Styling**: CSS with minimalist design principles

### Core Features
1. **Tree Rendering**: Displays hierarchical knowledge structure
2. **Rating System**: Users click score buttons to rate understanding
3. **Auto-save**: Ratings automatically saved to LocalStorage
4. **Export Function**: One-click copy of current ratings in markdown format
5. **Data Management**: Clear local data functionality

### File Structure (Recommended)
```
app/
├── layout.jsx
└── page.jsx
components/
└── KnowledgeTree.jsx
data/
└── [subject]_[textbook]_tree.json
public/
└── favicon.ico
styles/
└── globals.css
```

## UI Design Guidelines

**Style**: Minimalist, modern, rational and professional
**Colors**: Large white space + deep blue as primary color
**Typography**: Sans-serif fonts with weight contrast (bold titles, thin body text)
**Layout**: Left-right columns or large white space, modular design
**Elements**: Flat design, simple lines, minimal decorative elements
**Atmosphere**: Intellectual, lightweight, modern reading experience

## Data Interaction Patterns

### Rating Storage
- Ratings stored in LocalStorage with knowledge point IDs as keys
- Export generates markdown bullet list format
- Clear function removes all rating records from LocalStorage

### Tree Navigation
- Level 0: Chapters (top-level)
- Level 1: Sections
- Level 2+: Knowledge points and sub-topics
- Visual hierarchy reflects educational structure

## Working with Educational Content

When adding or modifying educational content:
1. Maintain the hierarchical JSON structure
2. Ensure each item has a unique UUID in the `id` field
3. Set appropriate `level` values (0 for chapters, 1 for sections, 2+ for knowledge points)
4. Keep `content` field empty (reserved for future use)
5. Follow the Chinese naming convention for file names