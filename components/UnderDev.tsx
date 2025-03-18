"use client"
import { Button } from "@/components/ui/button"
import { Construction } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UnderDevelopment() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1a1a1a] rounded-lg border border-gray-800 p-8 text-center rounded-xl">
        <div className="w-20 h-20 bg-[#d63736]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Construction className="text-[#d63736] h-10 w-10" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Under Development</h1>

        <p className="text-gray-300 mb-8">
          We're working hard to bring this feature to you soon. Please check back later for updates.
        </p>

        <Button onClick={() => router.back()} className="bg-[#d63736] hover:bg-[#c52c2c] text-white w-full py-6 rounded-xl">
          Go Back
        </Button>
      </div>

      <div className="mt-8 text-gray-400 text-sm">
        <p>Thank you for your patience as we continue to improve Geetika.</p>
      </div>
    </div>
  )
}

