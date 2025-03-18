import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import TranslationInterface from "@/components/translation-interface"


// This is a mock conversion function - replace with actual implementation
const mockConvertFMToUnicode = (text: string) => {
  // This is just a placeholder that adds "Unicode: " to each line
  // Replace with actual conversion logic
  if (!text) return ""
  return text
    .split("\n")
    .map((line) => (line ? `Unicode: ${line}` : ""))
    .join("\n")
}

export default function FmToUnicodePage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
     

      {/* Main Content */}
      <main>
        <div className="max-w-6xl mx-auto">
          <TranslationInterface
            title="FM to Unicode Converter"
            description="Convert Tamil text in FM font format to Unicode standard for better compatibility with modern digital platforms."
            fromLabel="FM Font Text"
            toLabel="Tamil Unicode Text"
            placeholder="Enter or paste your FM font text here..."
            convertFunction={mockConvertFMToUnicode}
          />

          {/* Additional Information */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">About Unicode</h2>
              <p className="text-gray-300 mb-4">
                Unicode is the modern standard for text encoding that supports all languages and scripts. Converting
                from legacy FM font to Unicode ensures your Tamil text is compatible with modern websites, applications,
                and devices.
              </p>
              <p className="text-gray-300">
                This converter helps you transform FM font encoded text into standard Tamil Unicode, making it usable
                across all modern platforms while preserving proper formatting.
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Common Uses</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Modernizing legacy content for websites and mobile apps</li>
                <li>Making text searchable in digital documents</li>
                <li>Preparing content for social media and messaging apps</li>
                <li>Converting old documents to modern formats</li>
                <li>Ensuring text displays correctly across all devices</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

  
    </div>
  )
}

