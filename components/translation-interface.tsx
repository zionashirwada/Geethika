"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, CheckCircle2, ArrowLeft } from "lucide-react"

interface TranslationInterfaceProps {
  title: string
  description: string
  fromLabel: string
  toLabel: string
  placeholder: string
  convertFunction: (text: string) => string
}

export default function TranslationInterface({
  title,
  description,
  fromLabel,
  toLabel,
  placeholder,
  convertFunction,
}: TranslationInterfaceProps) {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [copiedAll, setCopiedAll] = useState(false)
  const [copiedParagraphIndex, setCopiedParagraphIndex] = useState<number | null>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // Handle input change and convert text
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setInputText(text)
    setOutputText(convertFunction(text))
  }

  // Copy all text
  const copyAllText = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText)
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
    }
  }

  // Copy individual paragraph
  const copyParagraph = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedParagraphIndex(index)
    setTimeout(() => setCopiedParagraphIndex(null), 2000)
  }

  // Split output text into paragraphs
  const paragraphs = outputText ? outputText.split(/\n\s*\n/).filter((para) => para.trim() !== "") : []

  return (
    <div className="w-full">
   

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        <p className="text-gray-300 max-w-3xl mx-auto">{description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Column */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{fromLabel}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputText("")}
              className="text-xs rounded-xl"
              disabled={!inputText}
            >
              Clear
            </Button>
          </div>
          <Textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="min-h-[300px] md:min-h-[400px] bg-[#1a1a1a] border-gray-700 text-white resize-none rounded-xl"
          />
          <p className="text-xs text-gray-400">{inputText.length} characters</p>
        </div>

        {/* Output Column */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{toLabel}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={copyAllText}
              className={`text-xs ${copiedAll ? "bg-green-900/20 text-green-400 border-green-800 rounded-xl" : "rounded-xl"}`}
              disabled={!outputText}
            >
              {copiedAll ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy All
                </>
              )}
            </Button>
          </div>
          <div
            ref={outputRef}
            className="min-h-[300px] md:min-h-[400px]  bg-[#1a1a1a] border rounded-xl border-gray-700  p-3 overflow-y-auto"
          >
            {paragraphs.length > 0 ? (
              <div className="space-y-4 ">
                {paragraphs.map((paragraph, index) => (
                  <div
                    key={index}
                    className="group relative p-2 hover:bg-[#252525]  rounded-xl transition-colors cursor-pointer"
                    onClick={() => copyParagraph(paragraph, index)}
                  >
                    <p className="whitespace-pre-wrap">{paragraph}</p>
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedParagraphIndex === index ? (
                        <span className="flex items-center text-xs text-green-400">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Copied
                        </span>
                      ) : (
                        <span className="flex items-center text-xs text-gray-400">
                          <Copy className="h-3 w-3 mr-1" />
                          Click to copy
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 rounded-xl">
                {inputText ? "Converted text will appear here" : "Enter text to convert"}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 rounded-xl">{outputText.length} characters</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-12 bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>Enter or paste your text in the left input area</li>
          <li>The converted text will automatically appear on the right</li>
          <li>Click "Copy All" to copy the entire converted text</li>
          <li>Hover over and click any paragraph to copy just that section</li>
          <li>Use the converted text in your presentations, documents, or other applications</li>
        </ol>
      </div>
    </div>
  )
}

