"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"

// This is a redirect page that sends users to the first chapter of Genesis
export default function BibleVersionPage() {
  const router = useRouter()
  const params = useParams()
  const { version } = params

  useEffect(() => {
    router.push(`/bible/${version}/genesis/1`)
  }, [router, version])

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#d63736] border-t-transparent rounded-full inline-block mb-4"></div>
        <p>Loading Bible...</p>
      </div>
    </div>
  )
}

