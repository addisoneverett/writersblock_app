'use client'

import { useState, useEffect } from 'react'
import { IoSaveOutline, IoBookOutline, IoSettingsOutline, IoMapOutline, IoCreateOutline, IoBulbOutline, IoDocumentOutline, IoAddOutline } from 'react-icons/io5'

export default function Home() {
  const [text, setText] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    const words = text.trim().split(/\s+/)
    setWordCount(words.length === 1 && words[0] === '' ? 0 : words.length)
  }, [text])

  const percentage = Math.min((wordCount / 500) * 100, 100)

  return (
    <div className="container mx-auto max-w-md h-screen flex flex-col bg-card shadow-lg">
      <header className="flex justify-between items-center px-4 py-3 border-b border-border">
        <div className="text-sm font-medium">
          <span className="text-primary">{wordCount}</span> / 500
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-24 bg-secondary rounded-md overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-in-out" 
              style={{width: `${percentage}%`}}
            ></div>
          </div>
          <span className="text-xs text-muted-foreground">{Math.round(percentage)}%</span>
        </div>
      </header>
      <main className="flex-grow relative">
        <textarea 
          className="w-full h-full resize-none border-none focus:ring-0 bg-card text-foreground p-4 text-lg font-body"
          placeholder="Start writing..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </main>
      <footer className="flex justify-between items-center px-4 py-3 border-t border-border relative">
        <button className="text-2xl text-foreground focus:outline-none hover:text-primary transition-colors"><IoSaveOutline /></button>
        <button className="text-2xl text-foreground focus:outline-none hover:text-primary transition-colors"><IoBookOutline /></button>
        <button 
          className="text-2xl text-foreground focus:outline-none hover:text-primary transition-colors bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center absolute left-1/2 -translate-x-1/2 -top-6"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <IoAddOutline />
        </button>
        <button className="text-2xl text-foreground focus:outline-none hover:text-primary transition-colors"><IoSettingsOutline /></button>
        <button className="text-2xl text-foreground focus:outline-none hover:text-primary transition-colors"><IoMapOutline /></button>
      </footer>
      {isDropdownOpen && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground shadow-lg rounded-md overflow-hidden animate-accordion-down">
          <a href="#" className="flex items-center px-4 py-2 hover:bg-accent hover:text-accent-foreground">
            <IoCreateOutline className="mr-2" /> Add Title
          </a>
          <a href="#" className="flex items-center px-4 py-2 hover:bg-accent hover:text-accent-foreground">
            <IoBulbOutline className="mr-2" /> Generate Writing Prompt
          </a>
          <a href="#" className="flex items-center px-4 py-2 hover:bg-accent hover:text-accent-foreground">
            <IoDocumentOutline className="mr-2" /> Scan Document
          </a>
        </div>
      )}
    </div>
  )
}