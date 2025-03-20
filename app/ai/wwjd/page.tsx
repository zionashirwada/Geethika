"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Send, Loader2 } from "lucide-react"
import BackButton from "@/components/BackButton"
import UnderDevelopment from "@/components/UnderDev"

export default function WWJDPage() {
  const [question, setQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<{
    answer: string
    verses: { reference: string; text: string }[]
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setIsLoading(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock response - in a real app, this would come from an API
      setResponse({
        answer:
          "Jesus taught us to respond with love and forgiveness when faced with difficult situations. In Matthew 5:44, He instructs us to love our enemies and pray for those who persecute us. Rather than seeking revenge or harboring resentment, Jesus would encourage you to approach this situation with compassion and understanding, seeking reconciliation where possible.",
        verses: [
          {
            reference: "Matthew 5:44",
            text: "But I tell you, love your enemies and pray for those who persecute you.",
          },
          {
            reference: "Luke 6:31",
            text: "Do to others as you would have them do to you.",
          },
          {
            reference: "Ephesians 4:32",
            text: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.",
          },
        ],
      })
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="container mx-auto py-8 px-4">
      
      <BackButton />

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">What Would Jesus Do?</h1>
            <p className="text-gray-300">Ask for Bible-based guidance on how Jesus would respond to your situation.</p>
          </div>

          {/* <Card className="bg-[#1a1a1a] border-gray-800 mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Describe your situation or ask a question..."
                  className="min-h-[120px] bg-[#252525] border-gray-700 text-white resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-[#d63736] hover:bg-[#c52c2c] text-white"
                    disabled={!question.trim() || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Seeking wisdom...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Ask for Guidance
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {response && (
            <div className="space-y-6">
              <Card className="bg-[#1a1a1a] border-gray-800">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">Guidance</h2>
                  <p className="text-gray-300">{response.answer}</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1a1a1a] border-gray-800">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">Relevant Scripture</h2>
                  <div className="space-y-4">
                    {response.verses.map((verse, index) => (
                      <div key={index} className="p-3 bg-[#252525] rounded-md">
                        <p className="font-bold text-[#d63736] mb-1">{verse.reference}</p>
                        <p className="text-gray-300 italic">"{verse.text}"</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )} */}
<UnderDevelopment />
          <div className="mt-12 bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">About This Tool</h2>
            <p className="text-gray-300 mb-4">
              The "What Would Jesus Do?" tool uses AI to provide scripture-based guidance for your personal situations.
              Our AI analyzes your question and provides relevant Bible verses and insights based on Jesus's teachings.
            </p>
            <p className="text-gray-300">
              While this tool can provide biblical guidance, it's always best to consult with your pastor or spiritual
              leader for complex spiritual matters. This tool is meant to supplement, not replace, personal Bible study
              and prayer.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

