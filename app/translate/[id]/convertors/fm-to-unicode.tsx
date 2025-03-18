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
      {/* Header */}
      <header className="container mx-auto py-4 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/placeholder.svg?height=40&width=40"
            alt="Geetika Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-2xl font-bold text-white">Geetika</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/lyrics" className="hover:text-[#d63736] transition-colors">
            Lyrics
          </Link>
          <Link href="/bible" className="hover:text-[#d63736] transition-colors">
            Bible
          </Link>
          <Link href="/hymns" className="hover:text-[#d63736] transition-colors">
            Hymns
          </Link>
          <Link href="/translate" className="hover:text-[#d63736] transition-colors text-[#d63736]">
            Translate
          </Link>
          <Link href="/more-tools" className="hover:text-[#d63736] transition-colors">
            More Tools
          </Link>
        </nav>
        <Link href="/translate">
          <Button className="bg-[#d63736] hover:bg-[#c52c2c] text-white">Back to Tools</Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-12 px-4">
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

      {/* Footer */}
      <footer className="bg-[#151515] py-8">
        <div className="container mx-auto px-4">
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} Geetika. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-[#d63736]">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-[#d63736]">
                Terms of Service
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-[#d63736]">
                About
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

