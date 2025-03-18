import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import TranslationInterface from "@/components/translation-interface"

// This is a mock conversion function - replace with actual implementation
const mockConvertKaputaToUnicode = (text: string) => {
  // This is just a placeholder that adds "Unicode: " to each line
  // Replace with actual conversion logic
  if (!text) return ""
  return text
    .split("\n")
    .map((line) => (line ? `Unicode: ${line}` : ""))
    .join("\n")
}

export default function KaputaToUnicodePage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Main Content */}
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <TranslationInterface
            title="Kaputa to Unicode Converter"
            description="Convert Sinhala text in Kaputa font format to Unicode standard for better compatibility with modern digital platforms."
            fromLabel="Kaputa Font Text"
            toLabel="Sinhala Unicode Text"
            placeholder="Enter or paste your Kaputa font text here..."
            convertFunction={mockConvertKaputaToUnicode}
          />

          {/* Additional Information */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">About Kaputa Font</h2>
              <p className="text-gray-300 mb-4">
                Kaputa is one of the most widely used legacy Sinhala fonts, especially popular in Sri Lanka. Many older documents, presentations, and printed materials use this font encoding.
              </p>
              <p className="text-gray-300">
                This converter helps you transform Kaputa font encoded text into standard Sinhala Unicode, making it usable across all modern platforms while preserving proper formatting.
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Common Uses</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Converting old church documents to modern formats</li>
                <li>Updating legacy hymn lyrics for digital use</li>
                <li>Making text searchable in digital archives</li>
                <li>Preparing content for websites and mobile apps</li>
                <li>Ensuring text displays correctly across all devices</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  )
}