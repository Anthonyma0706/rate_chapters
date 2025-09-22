import '../styles/globals.css'

export const metadata = {
  title: '知识点自评系统',
  description: '高效的知识点掌握程度自我评估工具',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <div className="min-h-screen">
          <header className="bg-white border-b border-gray-100 py-6">
            <div className="max-w-6xl mx-auto px-6">
              <h1 className="text-3xl font-bold text-blue-900">
                知识点自评系统
              </h1>
              <p className="text-gray-600 mt-2 font-light">
                科学评估知识掌握程度，精准定位学习重点
              </p>
            </div>
          </header>
          <main className="max-w-6xl mx-auto px-6 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}