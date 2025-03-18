import TranslationInterface from "@/components/translation-interface"
import { baminiToUnicode } from "@/translators/BaminiToUnicode"


export default function BaminiToUnicodePage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Main Content */}
      <main>
        <div className="max-w-6xl mx-auto">
          <TranslationInterface
            title="Bamini to Unicode Converter"
            description="Convert Tamil text in Bamini font format to Unicode standard for better compatibility with modern digital platforms."
            fromLabel="Bamini Font Text"
            toLabel="Tamil Unicode Text"
            placeholder="Enter or paste your Bamini font text here..."
            convertFunction={baminiToUnicode}
          />

          {/* Additional Information */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">About Bamini Font</h2>
              <p className="text-gray-300 mb-4">
                Bamini is one of the most widely used legacy Tamil fonts, especially popular in Sri Lanka and parts of
                India. Many older documents, presentations, and printed materials use this font encoding.
              </p>
              <p className="text-gray-300">
                This converter helps you transform Bamini font encoded text into standard Tamil Unicode, making it
                usable across all modern platforms while preserving proper formatting.
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

