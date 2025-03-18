import TranslationInterface from "@/components/translation-interface"
import { UnicodeToBamini } from "@/translators/UnicodeToBamini"


export default function UnicodeToBaminiPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Main Content */}
      <main>
        <div className="max-w-6xl mx-auto">
          <TranslationInterface
            title="Unicode to Bamini Converter"
            description="Convert Tamil Unicode text to Bamini font format for legacy systems and software."
            fromLabel="Tamil Unicode Text"
            toLabel="Bamini Font Text"
            placeholder="Enter or paste your Tamil Unicode text here..."
            convertFunction={UnicodeToBamini}
          />

          {/* Additional Information */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">About Unicode</h2>
              <p className="text-gray-300 mb-4">
                Unicode is the modern standard for text encoding that supports all languages and scripts. Converting
                from Unicode to Bamini ensures your Tamil text is compatible with legacy systems and software.
              </p>
              <p className="text-gray-300">
                This converter helps you transform Tamil Unicode text into Bamini font encoded text, making it usable
                across older platforms while preserving proper formatting.
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Common Uses</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Preparing content for legacy systems and software</li>
                <li>Converting modern documents to older formats</li>
                <li>Ensuring text displays correctly on all devices</li>
                <li>Making text compatible with older presentation software</li>
                <li>Updating legacy content for modern use</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  )
}