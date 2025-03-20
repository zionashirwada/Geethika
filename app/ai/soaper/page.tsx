"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  BookOpen,
  Eye,
  Lightbulb,
  HandIcon as PrayingHands,
  Loader2,
  Download,
  Copy,
  CheckCircle,
} from "lucide-react"
import BackButton from "@/components/BackButton"
import UnderDevelopment from "@/components/UnderDev"

// Mock Bible books and chapters
const bibleBooks = [
  { id: "genesis", name: "Genesis", chapters: 50 },
  { id: "exodus", name: "Exodus", chapters: 40 },
  { id: "leviticus", name: "Leviticus", chapters: 27 },
  { id: "numbers", name: "Numbers", chapters: 36 },
  { id: "deuteronomy", name: "Deuteronomy", chapters: 34 },
  { id: "matthew", name: "Matthew", chapters: 28 },
  { id: "mark", name: "Mark", chapters: 16 },
  { id: "luke", name: "Luke", chapters: 24 },
  { id: "john", name: "John", chapters: 21 },
  { id: "acts", name: "Acts", chapters: 28 },
  { id: "romans", name: "Romans", chapters: 16 },
  { id: "1corinthians", name: "1 Corinthians", chapters: 16 },
  { id: "revelation", name: "Revelation", chapters: 22 },
]

export default function SOAPerPage() {
  const [selectedBook, setSelectedBook] = useState("")
  const [selectedChapter, setSelectedChapter] = useState("")
  const [fromVerse, setFromVerse] = useState("")
  const [toVerse, setToVerse] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [soapResult, setSoapResult] = useState<{
    scripture: string
    observation: string
    application: string
    prayer: string
  } | null>(null)
  const [activeTab, setActiveTab] = useState("scripture")
  const [copied, setCopied] = useState<string | null>(null)

  // Get chapters for selected book
  const getChapters = () => {
    const book = bibleBooks.find((b) => b.id === selectedBook)
    return book ? Array.from({ length: book.chapters }, (_, i) => i + 1) : []
  }

  // Get verses for selected chapter (mock - would come from API)
  const getVerses = () => {
    return Array.from({ length: 30 }, (_, i) => i + 1) // Mock 30 verses per chapter
  }

  const generateSOAP = () => {
    if (!selectedBook || !selectedChapter || !fromVerse || !toVerse) return

    setIsGenerating(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock SOAP analysis result - in a real app, this would come from an LLM API
      setSoapResult({
        scripture: `"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life. For God did not send his Son into the world to condemn the world, but to save the world through him." - John 3:16-17`,

        observation: `This passage contains one of the most well-known verses in the Bible, John 3:16, along with the important context of verse 17. Several key observations can be made:\n\n1. God's motivation is love - "God so loved the world"\n2. God's action was giving - "he gave his one and only Son"\n3. The scope is universal - "whoever believes in him"\n4. The contrast is stark - "not perish but have eternal life"\n5. Verse 17 clarifies God's purpose - not condemnation but salvation\n6. The means of salvation is through Jesus - "through him"`,

        application: `This passage challenges me to reflect on how I view God's character and how I respond to His love. Some applications include:\n\n1. I should remember that God's fundamental posture toward humanity (and me) is love, not condemnation\n2. Since God gave sacrificially, I should be willing to give sacrificially to others\n3. I need to ensure my belief in Jesus is active and transformative, not merely intellectual\n4. When sharing my faith, I should emphasize God's love and desire to save, not just judgment\n5. I can find security in knowing that God's purpose is to save me through Jesus, not to condemn me`,

        prayer: `Heavenly Father, thank You for Your incredible love that motivated You to give Your Son for me. I am humbled and grateful that You desire salvation, not condemnation. Help me to truly believe in Jesus in a way that transforms my life. Give me the courage to share Your love with others, emphasizing Your desire to save rather than condemn. May I reflect Your sacrificial love in how I treat others today. In Jesus' name, Amen.`,
      })
      setIsGenerating(false)
    }, 2000)
  }

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text)
    setCopied(section)
    setTimeout(() => setCopied(null), 2000)
  }

  const copyFullSOAP = () => {
    if (!soapResult) return

    const fullText = `SCRIPTURE:\n${soapResult.scripture}\n\nOBSERVATION:\n${soapResult.observation}\n\nAPPLICATION:\n${soapResult.application}\n\nPRAYER:\n${soapResult.prayer}`

    navigator.clipboard.writeText(fullText)
    setCopied("full")
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="container mx-auto py-8 px-4">
       <BackButton/>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">SOAPer</h1>
            <p className="text-gray-300">
              Generate Scripture, Observation, Application, and Prayer (SOAP) analysis for your Bible study.
            </p>
          </div>
<UnderDevelopment/>
          {/* <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card className="bg-[#1a1a1a] border-gray-800 sticky top-4">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">Select Passage</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Book</label>
                      <Select
                        value={selectedBook}
                        onValueChange={(value) => {
                          setSelectedBook(value)
                          setSelectedChapter("")
                          setFromVerse("")
                          setToVerse("")
                          setSoapResult(null)
                        }}
                      >
                        <SelectTrigger className="bg-[#252525] border-gray-700">
                          <SelectValue placeholder="Select a book" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#252525] border-gray-700">
                          {bibleBooks.map((book) => (
                            <SelectItem key={book.id} value={book.id}>
                              {book.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Chapter</label>
                      <Select
                        value={selectedChapter}
                        onValueChange={(value) => {
                          setSelectedChapter(value)
                          setFromVerse("")
                          setToVerse("")
                          setSoapResult(null)
                        }}
                        disabled={!selectedBook}
                      >
                        <SelectTrigger className="bg-[#252525] border-gray-700">
                          <SelectValue placeholder="Select a chapter" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#252525] border-gray-700">
                          {getChapters().map((chapter) => (
                            <SelectItem key={chapter} value={chapter.toString()}>
                              {chapter}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">From Verse</label>
                        <Select
                          value={fromVerse}
                          onValueChange={(value) => {
                            setFromVerse(value)
                            if (toVerse && Number.parseInt(value) > Number.parseInt(toVerse)) {
                              setToVerse(value)
                            }
                            setSoapResult(null)
                          }}
                          disabled={!selectedChapter}
                        >
                          <SelectTrigger className="bg-[#252525] border-gray-700">
                            <SelectValue placeholder="From" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#252525] border-gray-700">
                            {getVerses().map((verse) => (
                              <SelectItem key={verse} value={verse.toString()}>
                                {verse}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">To Verse</label>
                        <Select
                          value={toVerse}
                          onValueChange={(value) => {
                            setToVerse(value)
                            setSoapResult(null)
                          }}
                          disabled={!fromVerse}
                        >
                          <SelectTrigger className="bg-[#252525] border-gray-700">
                            <SelectValue placeholder="To" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#252525] border-gray-700">
                            {getVerses()
                              .filter((verse) => !fromVerse || verse >= Number.parseInt(fromVerse))
                              .map((verse) => (
                                <SelectItem key={verse} value={verse.toString()}>
                                  {verse}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      onClick={generateSOAP}
                      disabled={!selectedBook || !selectedChapter || !fromVerse || !toVerse || isGenerating}
                      className="w-full bg-[#d63736] hover:bg-[#c52c2c] text-white"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Generate SOAP
                        </>
                      )}
                    </Button>
                  </div>

                  {soapResult && (
                    <div className="mt-6 pt-6 border-t border-gray-800">
                      <h3 className="font-medium mb-3">Selected Passage</h3>
                      <p className="text-[#d63736] font-medium">
                        {bibleBooks.find((b) => b.id === selectedBook)?.name} {selectedChapter}:{fromVerse}
                        {fromVerse !== toVerse ? `-${toVerse}` : ""}
                      </p>

                      <div className="mt-4">
                        <Button variant="outline" className="w-full" onClick={copyFullSOAP}>
                          {copied === "full" ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Full SOAP
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="mt-2">
                        <Button variant="outline" className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download as PDF
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              {soapResult ? (
                <Card className="bg-[#1a1a1a] border-gray-800">
                  <CardContent className="pt-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="w-full bg-[#252525]">
                        <TabsTrigger value="scripture" className="flex-1 flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span className="hidden sm:inline">Scripture</span>
                        </TabsTrigger>
                        <TabsTrigger value="observation" className="flex-1 flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">Observation</span>
                        </TabsTrigger>
                        <TabsTrigger value="application" className="flex-1 flex items-center gap-1">
                          <Lightbulb className="h-4 w-4" />
                          <span className="hidden sm:inline">Application</span>
                        </TabsTrigger>
                        <TabsTrigger value="prayer" className="flex-1 flex items-center gap-1">
                          <PrayingHands className="h-4 w-4" />
                          <span className="hidden sm:inline">Prayer</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="scripture" className="mt-4">
                        <div className="bg-[#252525] p-4 rounded-md mb-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold flex items-center">
                              <BookOpen className="h-5 w-5 mr-2 text-[#d63736]" />
                              Scripture
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => copyToClipboard(soapResult.scripture, "scripture")}
                            >
                              {copied === "scripture" ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <p className="text-gray-300 whitespace-pre-line">{soapResult.scripture}</p>
                        </div>
                        <p className="text-sm text-gray-400">
                          The Scripture section contains the Bible passage you selected, which forms the foundation of
                          your SOAP study.
                        </p>
                      </TabsContent>

                      <TabsContent value="observation" className="mt-4">
                        <div className="bg-[#252525] p-4 rounded-md mb-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold flex items-center">
                              <Eye className="h-5 w-5 mr-2 text-[#d63736]" />
                              Observation
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => copyToClipboard(soapResult.observation, "observation")}
                            >
                              {copied === "observation" ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <p className="text-gray-300 whitespace-pre-line">{soapResult.observation}</p>
                        </div>
                        <p className="text-sm text-gray-400">
                          The Observation section examines what the text actually says, identifying key words, themes,
                          and context.
                        </p>
                      </TabsContent>

                      <TabsContent value="application" className="mt-4">
                        <div className="bg-[#252525] p-4 rounded-md mb-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold flex items-center">
                              <Lightbulb className="h-5 w-5 mr-2 text-[#d63736]" />
                              Application
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => copyToClipboard(soapResult.application, "application")}
                            >
                              {copied === "application" ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <p className="text-gray-300 whitespace-pre-line">{soapResult.application}</p>
                        </div>
                        <p className="text-sm text-gray-400">
                          The Application section explores how to apply the passage to your life, making it practical
                          and personal.
                        </p>
                      </TabsContent>

                      <TabsContent value="prayer" className="mt-4">
                        <div className="bg-[#252525] p-4 rounded-md mb-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold flex items-center">
                              <PrayingHands className="h-5 w-5 mr-2 text-[#d63736]" />
                              Prayer
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => copyToClipboard(soapResult.prayer, "prayer")}
                            >
                              {copied === "prayer" ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <p className="text-gray-300 whitespace-pre-line">{soapResult.prayer}</p>
                        </div>
                        <p className="text-sm text-gray-400">
                          The Prayer section responds to the passage with a prayer that applies the insights gained from
                          your study.
                        </p>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-8 bg-[#1a1a1a] border border-gray-800 rounded-xl">
                    <div className="w-16 h-16 bg-[#d63736]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-8 w-8 text-[#d63736]" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">SOAP Bible Study</h3>
                    <p className="text-gray-400 mb-4">
                      Select a Bible passage to generate a complete SOAP analysis for your personal study or devotional
                      time.
                    </p>
                    <div className="flex flex-col gap-2 text-sm text-left max-w-xs mx-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#252525] flex items-center justify-center">
                          <span className="text-[#d63736] font-bold">S</span>
                        </div>
                        <span className="text-gray-300">
                          <b>Scripture</b> - The Bible passage
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#252525] flex items-center justify-center">
                          <span className="text-[#d63736] font-bold">O</span>
                        </div>
                        <span className="text-gray-300">
                          <b>Observation</b> - What it says
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#252525] flex items-center justify-center">
                          <span className="text-[#d63736] font-bold">A</span>
                        </div>
                        <span className="text-gray-300">
                          <b>Application</b> - How to apply it
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#252525] flex items-center justify-center">
                          <span className="text-[#d63736] font-bold">P</span>
                        </div>
                        <span className="text-gray-300">
                          <b>Prayer</b> - Your response to God
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div> */}

          <div className="mt-12 bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">About SOAPer</h2>
            <p className="text-gray-300 mb-4">
              SOAPer is an AI-powered tool that helps you study the Bible using the SOAP method - Scripture,
              Observation, Application, and Prayer. This structured approach helps you:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-300 mb-4">
              <li>Understand what the Bible passage actually says</li>
              <li>Observe important details, patterns, and context</li>
              <li>Apply the passage to your personal life</li>
              <li>Respond to God in prayer based on what you've learned</li>
            </ul>
            <p className="text-gray-300">
              While SOAPer provides AI-generated insights to help jumpstart your study, it's designed to supplement, not
              replace, your personal engagement with Scripture. Feel free to modify the generated content based on your
              own insights and the Holy Spirit's guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

