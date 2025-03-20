"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, FileText, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import BackButton from "@/components/BackButton"
import UnderDevelopment from "@/components/UnderDev"

// Mock denominations
const denominations = [
  { id: "catholic", name: "Catholic" },
  { id: "baptist", name: "Baptist" },
  { id: "methodist", name: "Methodist" },
  { id: "lutheran", name: "Lutheran" },
  { id: "presbyterian", name: "Presbyterian" },
  { id: "pentecostal", name: "Pentecostal" },
  { id: "anglican", name: "Anglican" },
]

export default function TheologyGuardPage() {
  const [text, setText] = useState("")
  const [selectedDenomination, setSelectedDenomination] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  const handleAnalyze = () => {
    if (!text.trim() || !selectedDenomination) return

    setIsAnalyzing(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock analysis result - in a real app, this would come from an API
      setAnalysisResult({
        denominationalAlignment: 78,
        flags: [
          {
            text: "God wants all believers to be financially prosperous",
            issue: "Prosperity Gospel teaching",
            suggestion: "God promises to meet our needs, but not necessarily with material wealth (Philippians 4:19)",
          },
          {
            text: "We must perform good works to maintain our salvation",
            issue: "Works-based salvation",
            suggestion: "We are saved by grace through faith, not by works (Ephesians 2:8-9)",
          },
        ],
        cultComparisons: [
          { name: "Jehovah's Witnesses", similarity: 12 },
          { name: "Mormonism", similarity: 8 },
          { name: "Christian Science", similarity: 5 },
        ],
        orthodoxScore: 82,
      })
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would process the file here
      // For this demo, we'll just set some sample text
      setText(
        "God wants all believers to be financially prosperous. The more faith you have, the more wealth you will receive. We must perform good works to maintain our salvation and ensure our place in heaven.",
      )
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="container mx-auto py-8 px-4">
        <BackButton/>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Theology Guard</h1>
            <p className="text-gray-300">
              Fact-check teachings against denominational doctrines to ensure theological accuracy.
            </p>
          </div>

          {/* <Card className="bg-[#1a1a1a] border-gray-800 mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Input Text for Analysis</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Denomination</label>
                  <Select value={selectedDenomination} onValueChange={setSelectedDenomination}>
                    <SelectTrigger className="bg-[#252525] border-gray-700">
                      <SelectValue placeholder="Select a denomination" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#252525] border-gray-700">
                      {denominations.map((denom) => (
                        <SelectItem key={denom.id} value={denom.id}>
                          {denom.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Sermon, Teaching, or Notes</label>
                  <Textarea
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Paste your sermon, teaching, or notes here for theological analysis..."
                    className="min-h-[200px] bg-[#252525] border-gray-700 text-white resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleAnalyze}
                    disabled={!text.trim() || !selectedDenomination || isAnalyzing}
                    className="flex-1 bg-[#d63736] hover:bg-[#c52c2c] text-white"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Analyze Text
                      </>
                    )}
                  </Button>

                  <div className="flex-1 relative">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".txt,.doc,.docx,.pdf"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {analysisResult && (
            <div className="space-y-6">
              <Card className="bg-[#1a1a1a] border-gray-800">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">Analysis Results</h2>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">
                          {denominations.find((d) => d.id === selectedDenomination)?.name} Alignment
                        </span>
                        <span className="font-bold">{analysisResult.denominationalAlignment}%</span>
                      </div>
                      <Progress value={analysisResult.denominationalAlignment} className="h-2 bg-gray-700" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Orthodox Theology Score</span>
                        <span className="font-bold">{analysisResult.orthodoxScore}%</span>
                      </div>
                      <Progress value={analysisResult.orthodoxScore} className="h-2 bg-gray-700" />
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-3">Theological Concerns</h3>
                      {analysisResult.flags.length > 0 ? (
                        <div className="space-y-4">
                          {analysisResult.flags.map((flag: any, index: number) => (
                            <div key={index} className="bg-[#2a1e1e] border border-[#d63736]/30 rounded-md p-4">
                              <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-[#d63736] flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-bold text-[#d63736] mb-1">{flag.issue}</p>
                                  <p className="text-gray-300 mb-2">"{flag.text}"</p>
                                  <div className="bg-[#252525] p-3 rounded-md">
                                    <p className="text-sm font-medium mb-1">Suggested Alternative:</p>
                                    <p className="text-gray-300 italic">{flag.suggestion}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-[#1e2a1e] border border-green-800/30 rounded-md p-4 flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <p className="text-gray-300">No theological concerns detected.</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-3">Cult Terminology Similarity</h3>
                      <div className="space-y-3">
                        {analysisResult.cultComparisons.map((cult: any, index: number) => (
                          <div key={index} className="bg-[#252525] p-3 rounded-md">
                            <div className="flex justify-between mb-1">
                              <span>{cult.name}</span>
                              <span className={cult.similarity > 20 ? "text-[#d63736]" : "text-gray-400"}>
                                {cult.similarity}%
                              </span>
                            </div>
                            <Progress
                              value={cult.similarity}
                              className="h-1.5 bg-gray-700"
                              indicatorClassName={cult.similarity > 20 ? "bg-[#d63736]" : ""}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )} */}
<UnderDevelopment/>
          <div className="mt-12 bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">About Theology Guard</h2>
            <p className="text-gray-300 mb-4">
              Theology Guard helps pastors, teachers, and church leaders ensure their teachings align with their
              denominational doctrines and orthodox Christian theology. This tool can:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-300 mb-4">
              <li>Identify potential heretical teachings</li>
              <li>Measure alignment with your selected denomination</li>
              <li>Flag terminology associated with cults or heterodox groups</li>
              <li>Suggest orthodox alternatives to problematic statements</li>
            </ul>
            <p className="text-gray-300">
              While this tool can help identify potential theological issues, it should be used as a supplementary
              resource alongside careful Bible study, prayer, and consultation with trusted spiritual leaders.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

