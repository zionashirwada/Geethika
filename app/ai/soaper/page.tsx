"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
  AlertTriangle,
} from "lucide-react"
import BackButton from "@/components/BackButton"
import { useBibleBooks } from "@/hooks/useBibleBooks"
import { useBibleChapter } from "@/hooks/useBibleChapter"
import { useSoapGenerator } from "@/hooks/useSoapGenerator"
import { SoapResult, LoadingStates, ApiError } from "@/types/soaper"

// Bible API version (hardcoded as requested)
const BIBLE_VERSION = "ENGWEBP"

export default function SOAPerPage() {
  // State for selected items
  const [selectedBook, setSelectedBook] = useState<string>("")
  const [selectedChapter, setSelectedChapter] = useState<string>("")
  const [fromVerse, setFromVerse] = useState<string>("")
  const [toVerse, setToVerse] = useState<string>("")
  
  // State for loading and errors
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiError, setApiError] = useState<ApiError | null>(null)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [loading, setLoading] = useState<LoadingStates>({
    books: false,
    chapters: false,
    verses: false
  })
  
  // State for SOAP result and UI
  const [soapResult, setSoapResult] = useState<SoapResult | null>(null)
  const [activeTab, setActiveTab] = useState("scripture")
  const [copied, setCopied] = useState<string | null>(null)

  // Get books for the selected translation
  const { 
    books: bibleBooks, 
    isLoading: booksLoading, 
    error: booksError 
  } = useBibleBooks(BIBLE_VERSION)

  // Parse chapters from selected book
  const [chapters, setChapters] = useState<number[]>([])
  useEffect(() => {
    if (selectedBook) {
      const book = bibleBooks.find(b => b.id === selectedBook)
      if (book) {
        setChapters(Array.from({ length: book.numberOfChapters }, (_, i) => i + 1))
      } else {
        setChapters([])
      }
    } else {
      setChapters([])
    }
  }, [selectedBook, bibleBooks])

  // Get chapter data using our hook when a chapter is selected
  const { 
    verses, 
    isLoading: versesLoading, 
    error: versesError, 
    getVerseRange 
  } = useBibleChapter(
    BIBLE_VERSION, 
    selectedBook || null, 
    selectedChapter ? parseInt(selectedChapter) : null
  )

  // Use our SOAP generator hook
  const {
    generateSoap,
    isLoading: soapLoading,
    error: soapError,
    result: generatedSoap
  } = useSoapGenerator()

  // Update loading state based on hook loading states
  useEffect(() => {
    setLoading({
      books: booksLoading,
      chapters: false,
      verses: versesLoading
    })
  }, [booksLoading, versesLoading])

  // Update error state based on hook errors
  useEffect(() => {
    setError(booksError || versesError || null)
  }, [booksError, versesError])

  // Update SOAP result when generated
  useEffect(() => {
    if (generatedSoap) {
      setSoapResult(generatedSoap)
    }
  }, [generatedSoap])

  // Generate SOAP content
  const generateSOAP = async () => {
    if (!selectedBook || !selectedChapter || !fromVerse || !toVerse) return

    setIsGenerating(true)
    setError(null)
    setApiError(null)

    try {
      // Get the book name for display
      const selectedBookObj = bibleBooks.find(book => book.id === selectedBook)
      const bookName = selectedBookObj ? selectedBookObj.name : selectedBook
      const fromVerseNum = parseInt(fromVerse)
      const toVerseNum = parseInt(toVerse)

      // Get the actual Bible text using our hook's getVerseRange method
      const scriptureText = getVerseRange(fromVerseNum, toVerseNum)
   
      
      // Format the scripture reference
      const scriptureRef = `${bookName} ${selectedChapter}:${fromVerse}${
        fromVerse !== toVerse ? `-${toVerse}` : ""
      } (WEB)`
      
      // Call our API through the hook
      const result = await generateSoap(scriptureText, scriptureRef)
      
      // Set the result in state
      setSoapResult(result)
      setActiveTab("scripture")
    } catch (err: any) {
      console.error("Error generating SOAP:", err)
      
      // Handle API errors
      if (err.message && typeof err.message === 'string') {
        setApiError({
          message: err.message,
          details: err.details || 'Please try again or select a different passage'
        })
        setShowErrorDialog(true)
      } else {
        setError(`Failed to generate SOAP: ${err.message || 'Unknown error'}`)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text)
    setCopied(section)
    setTimeout(() => setCopied(null), 2000)
  }

  const copyFullSOAP = () => {
    if (!soapResult) return

    const fullText = `SCRIPTURE:\n${soapResult.scripture}\n\n${ getVerseRange(parseInt(fromVerse), parseInt(toVerse))}\n\nOBSERVATION:\n${soapResult.observation}\n\nAPPLICATION:\n${soapResult.application}\n\nPRAYER:\n${soapResult.prayer}`

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

          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-700 text-red-200 rounded-lg p-4 flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Error Dialog */}
          <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
            <AlertDialogContent className="bg-[#1a1a1a] border-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Error Generating SOAP</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-300">
                  {apiError?.message}
                  {apiError?.details && (
                    <p className="mt-2 text-gray-400">{apiError.details}</p>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction className="bg-[#d63736] hover:bg-[#c52c2c]">
                  Try Again
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="grid md:grid-cols-3 gap-8 ">
            <div className="md:col-span-1">
              <Card className="bg-[#1a1a1a] rounded-xl border-gray-800 sticky top-4 text-white">
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
                        disabled={loading.books || bibleBooks.length === 0}
                      >
                        <SelectTrigger className="bg-[#252525] rounded-xl border-gray-700">
                          <SelectValue placeholder={loading.books ? "Loading books..." : "Select a book"} />
                        </SelectTrigger>
                        <SelectContent className="bg-[#252525] rounded-xl border-gray-700 max-h-[300px]">
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
                        disabled={!selectedBook || loading.chapters || chapters.length === 0}
                      >
                        <SelectTrigger className="bg-[#252525] rounded-xl border-gray-700">
                          <SelectValue placeholder={loading.chapters ? "Loading chapters..." : "Select a chapter"} />
                        </SelectTrigger>
                        <SelectContent className="bg-[#252525] rounded-xl border-gray-700">
                          {chapters.map((chapter) => (
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
                          disabled={!selectedChapter || loading.verses || verses.length === 0}
                        >
                          <SelectTrigger className="bg-[#252525] rounded-xl border-gray-700">
                            <SelectValue placeholder={loading.verses ? "Loading..." : "From"} />
                          </SelectTrigger>
                          <SelectContent className="bg-[#252525] rounded-xl border-gray-700">
                            {verses.map((verse) => (
                              <SelectItem key={verse.number} value={verse.number.toString()}>
                                {verse.number}
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
                          disabled={!fromVerse || loading.verses}
                        >
                          <SelectTrigger className="bg-[#252525] rounded-xl border-gray-700">
                            <SelectValue placeholder={loading.verses ? "Loading..." : "To"} />
                          </SelectTrigger>
                          <SelectContent className="bg-[#252525] rounded-xl border-gray-700">
                            {verses
                              .filter((verse) => !fromVerse || verse.number >= Number.parseInt(fromVerse))
                              .map((verse) => (
                                <SelectItem key={verse.number} value={verse.number.toString()}>
                                  {verse.number}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      onClick={generateSOAP}
                      disabled={!selectedBook || !selectedChapter || !fromVerse || !toVerse || isGenerating || soapLoading}
                      className="w-full bg-[#d63736] hover:bg-[#c52c2c] rounded-xl text-white"
                    >
                      {isGenerating || soapLoading ? (
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
                <Card className="bg-[#1a1a1a] border-gray-800 rounded-xl">
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
                        <div className="space-y-4">
                          {/* Direct Bible Text Section */}
                          <div className="bg-[#252525] p-4 rounded-md">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-bold flex items-center text-white">
                                <BookOpen className="h-5 w-5 mr-2 text-[#d63736]" />
                                Bible Text
                              </h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => copyToClipboard(getVerseRange(parseInt(fromVerse), parseInt(toVerse)), "direct-scripture")}
                              >
                                {copied === "direct-scripture" ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <div className="space-y-4">
                              <p className="text-[#d63736] font-medium">
                                {bibleBooks.find((b) => b.id === selectedBook)?.name} {selectedChapter}:
                                {fromVerse}
                                {fromVerse !== toVerse ? `-${toVerse}` : ""} (WEB)
                              </p>
                              <p className="text-white whitespace-pre-line">
                                {getVerseRange(parseInt(fromVerse), parseInt(toVerse))}
                              </p>
                            </div>
                          </div>


                        </div>
                        <p className="text-sm text-gray-400 mt-2">
                          The Scripture section shows both the direct Bible text and the AI-processed version used for SOAP analysis.
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
                          <div className="text-gray-300 markdown-content" dangerouslySetInnerHTML={{ __html: soapResult.observation }}></div>
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
                          <div className="text-gray-300 markdown-content" dangerouslySetInnerHTML={{ __html: soapResult.application }}></div>
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
                          <div className="text-gray-300 markdown-content" dangerouslySetInnerHTML={{ __html: soapResult.prayer }}></div>
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
                // ... the rest of the component remains the same
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
          </div>

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

