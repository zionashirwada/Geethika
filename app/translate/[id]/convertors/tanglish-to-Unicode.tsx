import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import TranslationInterface from "@/components/translation-interface"

// This is a mock conversion function - replace with actual implementation
const mockConvertTanglishToUnicode = (text: string) => {
  // This is just a placeholder that adds "Unicode: " to each line
  // Replace with actual conversion logic
  if (!text) return ""
  return text
    .split("\n")
    .map((line) => (line ? `Unicode: ${line}` : ""))
    .join("\n")
}

export default function TanglishToUnicodePage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Main Content */}
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <TranslationInterface
            title="Tanglish to Unicode Converter"
            description="Convert romanized Tamil (Tanglish) text to proper Tamil Unicode for better compatibility with modern digital platforms."
            fromLabel="Tanglish Text"
            toLabel="Tamil Unicode Text"
            placeholder="Enter or paste your Tanglish text here..."
            convertFunction={mockConvertTanglishToUnicode}
          />

          {/* Additional Information */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">About Tanglish</h2>
              <p className="text-gray-300 mb-4">
                Tanglish is a method of writing Tamil using the Latin alphabet. It is commonly used in informal digital communication.
              </p>
              <p className="text-gray-300">
                This converter helps you transform Tanglish text into standard Tamil Unicode, making it usable across all modern platforms while preserving proper formatting.
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Common Uses</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Converting informal messages to formal documents</li>
                <li>Preparing content for websites and mobile apps</li>
                <li>Ensuring text displays correctly across all devices</li>
                <li>Making text searchable in digital archives</li>
                <li>Updating legacy content for modern use</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  )
}