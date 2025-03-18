import TranslationInterface from "@/components/translation-interface"
import { singlishToUnicode } from "@/translators/SinglishToUnicode"


export default function SinglishToUnicodePage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Main Content */}
      <main>
        <div className="max-w-6xl mx-auto">
          <TranslationInterface
            title="Singlish to Unicode Converter"
            description="Convert romanized Sinhala (Singlish) text to proper Sinhala Unicode for better compatibility with modern digital platforms."
            fromLabel="Singlish Text"
            toLabel="Sinhala Unicode Text"
            placeholder="Enter or paste your Singlish text here..."
            convertFunction={singlishToUnicode}
          />

          {/* Additional Information */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">About Singlish</h2>
              <p className="text-gray-300 mb-4">
                Singlish is a method of writing Sinhala using the Latin alphabet. It is commonly used in informal digital communication.
              </p>
              <p className="text-gray-300">
                This converter helps you transform Singlish text into standard Sinhala Unicode, making it usable across all modern platforms while preserving proper formatting.
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