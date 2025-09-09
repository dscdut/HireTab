"use client"

import { RotateCcw, RotateCw, ChevronDown, AlignLeft, AlignCenter, AlignRight, List, ListOrdered } from "lucide-react"

export default function EmailFormattingToolbar({
  textFormatting,
  setTextFormatting,
  showColorPicker,
  setShowColorPicker,
  showAlignmentMenu,
  setShowAlignmentMenu,
  showListMenu,
  setShowListMenu,
  onUndo,
  onRedo,
  onInsertList,
}) {
  const colors = [
    "#1f2937",
    "#dc2626",
    "#059669",
    "#2563eb",
    "#7c3aed",
    "#db2777",
    "#ea580c",
    "#ca8a04",
    "#65a30d",
    "#0891b2",
    "#4338ca",
    "#be185d",
  ]

  return (
    <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
      {/* Undo/Redo */}
      <button onClick={onUndo} className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Undo">
        <RotateCcw className="w-4 h-4" />
      </button>
      <button onClick={onRedo} className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Redo">
        <RotateCw className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Font Family */}
      <select
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={textFormatting.fontFamily}
        onChange={(e) => setTextFormatting({ ...textFormatting, fontFamily: e.target.value })}
      >
        <option value="Inter, system-ui, sans-serif">Inter</option>
        <option value="Arial, sans-serif">Arial</option>
        <option value="Times New Roman, serif">Times New Roman</option>
        <option value="Courier New, monospace">Courier New</option>
        <option value="Georgia, serif">Georgia</option>
      </select>

      {/* Font Size */}
      <select
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={textFormatting.fontSize}
        onChange={(e) => setTextFormatting({ ...textFormatting, fontSize: Number.parseInt(e.target.value) })}
      >
        <option value="12">12px</option>
        <option value="14">14px</option>
        <option value="16">16px</option>
        <option value="18">18px</option>
        <option value="20">20px</option>
        <option value="24">24px</option>
      </select>
      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Bold, Italic, Underline */}
      <button
        onClick={() => setTextFormatting({ ...textFormatting, bold: !textFormatting.bold })}
        className={`p-2 rounded-lg transition-colors ${
          textFormatting.bold ? "bg-blue-200 text-blue-800" : "hover:bg-gray-200"
        }`}
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        onClick={() => setTextFormatting({ ...textFormatting, italic: !textFormatting.italic })}
        className={`p-2 rounded-lg transition-colors ${
          textFormatting.italic ? "bg-blue-200 text-blue-800" : "hover:bg-gray-200"
        }`}
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        onClick={() => setTextFormatting({ ...textFormatting, underline: !textFormatting.underline })}
        className={`p-2 rounded-lg transition-colors ${
          textFormatting.underline ? "bg-blue-200 text-blue-800" : "hover:bg-gray-200"
        }`}
        title="Underline"
      >
        <u>U</u>
      </button>

      {/* Text Color */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-2 hover:bg-gray-200 rounded-lg flex items-center transition-colors"
          title="Text Color"
        >
          <span style={{ color: textFormatting.textColor }} className="font-bold">
            A
          </span>
          <ChevronDown className="w-3 h-3 ml-1" />
        </button>
        {showColorPicker && (
          <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10">
            <div className="grid grid-cols-6 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setTextFormatting({ ...textFormatting, textColor: color })
                    setShowColorPicker(false)
                  }}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Text Alignment */}
      <div className="relative">
        <button
          onClick={() => setShowAlignmentMenu(!showAlignmentMenu)}
          className="p-2 hover:bg-gray-200 rounded-lg flex items-center transition-colors"
          title="Text Alignment"
        >
          <AlignLeft className="w-4 h-4" />
          <ChevronDown className="w-3 h-3 ml-1" />
        </button>
        {showAlignmentMenu && (
          <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded-lg shadow-lg py-1 z-10">
            <button
              onClick={() => {
                setTextFormatting({ ...textFormatting, textAlign: "left" })
                setShowAlignmentMenu(false)
              }}
              className="flex items-center px-3 py-2 hover:bg-gray-100 w-full text-left"
            >
              <AlignLeft className="w-4 h-4 mr-2" />
              Left
            </button>
            <button
              onClick={() => {
                setTextFormatting({ ...textFormatting, textAlign: "center" })
                setShowAlignmentMenu(false)
              }}
              className="flex items-center px-3 py-2 hover:bg-gray-100 w-full text-left"
            >
              <AlignCenter className="w-4 h-4 mr-2" />
              Center
            </button>
            <button
              onClick={() => {
                setTextFormatting({ ...textFormatting, textAlign: "right" })
                setShowAlignmentMenu(false)
              }}
              className="flex items-center px-3 py-2 hover:bg-gray-100 w-full text-left"
            >
              <AlignRight className="w-4 h-4 mr-2" />
              Right
            </button>
          </div>
        )}
      </div>

      {/* List Options */}
      <div className="relative">
        <button
          onClick={() => setShowListMenu(!showListMenu)}
          className="p-2 hover:bg-gray-200 rounded-lg flex items-center transition-colors"
          title="Lists"
        >
          <List className="w-4 h-4" />
          <ChevronDown className="w-3 h-3 ml-1" />
        </button>
        {showListMenu && (
          <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded-lg shadow-lg py-1 z-10">
            <button
              onClick={() => {
                onInsertList("bullet")
                setShowListMenu(false)
              }}
              className="flex items-center px-3 py-2 hover:bg-gray-100 w-full text-left"
            >
              <List className="w-4 h-4 mr-2" />
              Bullet List
            </button>
            <button
              onClick={() => {
                onInsertList("numbered")
                setShowListMenu(false)
              }}
              className="flex items-center px-3 py-2 hover:bg-gray-100 w-full text-left"
            >
              <ListOrdered className="w-4 h-4 mr-2" />
              Numbered List
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
