"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Book,
  Download,
  Search,
  ChevronRight,
  ChevronLeft,
  Copy,
  BookOpen,
  Share2,
  Bookmark,
  FileJson,
  FileCode,
  FileIcon as FilePdf,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bible, Book as BibleBook, Verse } from "@/types/bible"
import { bibleVersions } from "@/data/bibleVersions"
import { useParams } from "next/navigation"

// Get Bible version from imported bibleVersions
const getBibleVersion = (id: string) => {
  const version = bibleVersions.find((v) => v.id === id)
  return version ? version : bibleVersions[0]
}

export default function BibleReadingPage() {
 
  const { version: versionId } = useParams()
  
  const bibleVersion = getBibleVersion(Array.isArray(versionId) ? versionId[0] : versionId)
  const bibleId = bibleVersion.id

  const [bibleData, setBibleData] = useState<Bible | null>(null)
  const [loading, setLoading] = useState(true)
  const [books, setBooks] = useState<BibleBook[]>([])
  const [filteredBooks, setFilteredBooks] = useState<BibleBook[]>([])
  const [currentBook, setCurrentBook] = useState<BibleBook | null>(null)
  const [selectedChapter, setSelectedChapter] = useState(1)
  const [verses, setVerses] = useState<Verse[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVerses, setSelectedVerses] = useState<number[]>([])

  // Fetch Bible data from the JSON file located in /public
  useEffect(() => {
    const fetchBibleData = async () => {
      setLoading(true)
      try {
        // Replace '@data' with '/data' so the file is fetched from the public folder.
        const location = bibleVersion.location.replace("@data", "/data")
        console.log("Fetching Bible from:", location)

        const response = await fetch(location)
        if (!response.ok) {
          throw new Error(
            `Failed to fetch Bible data: ${response.status} ${response.statusText}`
          )
        }

        const data: Bible = await response.json()
        console.log("Bible data loaded:", data.name)
        setBibleData(data)

        if (data && data.books) {
          setBooks(data.books)
          setFilteredBooks(data.books)
          // Set default to the first book and first chapter
          setCurrentBook(data.books[0])
          setSelectedChapter(1)
        }
      } catch (error) {
        console.error("Error loading Bible data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBibleData()
  }, [bibleVersion])

  // Update verses whenever the current book or selected chapter changes
  useEffect(() => {
    if (currentBook) {
      const chapterVerses = currentBook.verses.filter(
        (v) => v.Chapter === selectedChapter
      )
      // If Chapter property is missing, assign default values.
      if (chapterVerses.length > 0 && !chapterVerses[0].Chapter) {
        const versesWithChapter = chapterVerses.map((verse, index) => ({
          ...verse,
          Chapter: selectedChapter,
          Verse: index + 1,
        }))
        setVerses(versesWithChapter)
      } else {
        setVerses(chapterVerses)
      }
    }
  }, [currentBook, selectedChapter])

  // Filter books based on the search term
  useEffect(() => {
    if (!books.length) return

    if (searchTerm) {
      setFilteredBooks(
        books.filter((book) =>
          book.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    } else {
      setFilteredBooks(books)
    }
  }, [searchTerm, books])

  // Handle chapter change (update state)
  const handleChapterChange = (newChapter: string) => {
    setSelectedChapter(parseInt(newChapter))
  }

  // Handle book change (update state and reset chapter to 1)
  const handleBookChange = (newBookId: string) => {
    const foundBook = books.find(
      (b) =>
        b.id.toLowerCase() === newBookId.toLowerCase() ||
        b.name.toLowerCase() === newBookId.toLowerCase()
    )
    if (foundBook) {
      setCurrentBook(foundBook)
      setSelectedChapter(1)
    }
  }

  // Toggle verse selection
  const toggleVerseSelection = (verseIndex: number) => {
    if (selectedVerses.includes(verseIndex)) {
      setSelectedVerses(selectedVerses.filter((v) => v !== verseIndex))
    } else {
      setSelectedVerses([...selectedVerses, verseIndex])
    }
  }

  // Copy selected verses to clipboard
  const copySelectedVerses = () => {
    if (selectedVerses.length === 0 || !verses.length) return

    const textToCopy = selectedVerses
      .sort((a, b) => a - b)
      .map((index) => `${verses[index].Verse} ${verses[index].Text}`)
      .join("\n\n")

    navigator.clipboard.writeText(textToCopy)
    alert("Selected verses copied to clipboard")
  }

  // Get maximum chapters for the current book
  const getMaxChapters = (): number => {
    if (!currentBook || !currentBook.verses.length) return 1

    if (currentBook.verses[0].Chapter) {
      const maxChapter = Math.max(
        ...currentBook.verses.map((v) => v.Chapter || 1)
      )
      return maxChapter || 1
    }
    return 1
  }

  // Navigate to previous chapter (or previous book's last chapter)
  const goToPreviousChapter = () => {
    if (!currentBook) return

    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1)
    } else {
      const currentBookIndex = books.findIndex(
        (b) => b.id === currentBook.id
      )
      if (currentBookIndex > 0) {
        const previousBook = books[currentBookIndex - 1]
        const maxChapter = previousBook.verses[0].Chapter
          ? Math.max(...previousBook.verses.map((v) => v.Chapter || 1))
          : 1
        setCurrentBook(previousBook)
        setSelectedChapter(maxChapter)
      }
    }
  }

  // Navigate to next chapter (or next book's first chapter)
  const goToNextChapter = () => {
    if (!currentBook) return

    const maxChapters = getMaxChapters()

    if (selectedChapter < maxChapters) {
      setSelectedChapter(selectedChapter + 1)
    } else {
      const currentBookIndex = books.findIndex(
        (b) => b.id === currentBook.id
      )
      if (currentBookIndex < books.length - 1) {
        const nextBook = books[currentBookIndex + 1]
        setCurrentBook(nextBook)
        setSelectedChapter(1)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#d63736] border-t-transparent rounded-full inline-block mb-4"></div>
          <p>Loading Bible content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/bible">
              <Button variant="outline" className="flex items-center gap-2 rounded-xl">
                <ArrowLeft className="h-4 w-4" />
                Back to Bible Versions
              </Button>
            </Link>
          </div>

          {/* Bible Version Info */}
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded-full ${
                      bibleVersion.language === "English"
                        ? "bg-blue-900/30 text-blue-400"
                        : bibleVersion.language === "Sinhala"
                        ? "bg-green-900/30 text-green-400"
                        : "bg-yellow-900/30 text-yellow-400"
                    }`}
                  >
                    {bibleVersion.language}
                  </span>
                  <span className="text-sm text-gray-400">{bibleVersion.year}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {bibleVersion.title}
                </h1>
                <p className="text-gray-300 text-sm md:text-base">
                  {bibleVersion.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-[#252525] hover:bg-[#333] flex items-center gap-2 rounded-xl">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#252525] border-gray-700 rounded-xl">
                    <DropdownMenuLabel>Download Options</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem 
                    className="hover:bg-[#333] cursor-pointer rounded-xl"
                    onClick={() => {
                      // Create an anchor element
                      const link = document.createElement("a");
                      // Adjust the path based on where your JSON file is in the public folder
                      link.href = `/data/bibles/${bibleId}.json`;
                      // Set the download attribute to trigger a download rather than navigation
                      link.setAttribute("download", `${bibleId}.json`);
                      // Append to the document, trigger click, then remove
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}>
                      <FileJson className="h-4 w-4 mr-2" /> Full Bible (JSON)
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-[#333] cursor-pointer rounded-xl" disabled>
                      <FileCode className="h-4 w-4 mr-2" /> Full Bible (XML)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem className="hover:bg-[#333] cursor-pointer rounded-xl" disabled>
                      <FileJson className="h-4 w-4 mr-2" /> Current Book (JSON)
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-[#333] cursor-pointer rounded-xl" disabled>
                      <FileCode className="h-4 w-4 mr-2" /> Current Book (XML)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem className="hover:bg-[#333] cursor-pointer rounded-xl" disabled>
                      <FilePdf className="h-4 w-4 mr-2" /> Current Chapter (PDF)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Bible Navigation and Content */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden sticky top-4">
                <div className="p-4 bg-[#252525]">
                  <h2 className="font-bold flex items-center">
                    <Book className="mr-2 text-[#d63736] h-4 w-4" /> Bible Books
                  </h2>
                </div>

                <div className="p-4">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search books..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 py-1 h-9 text-sm bg-[#252525] border-gray-700 text-white rounded-xl"
                    />
                  </div>

                  <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredBooks.map((bookItem) => (
                      <div key={bookItem.id} className="group">
                        <button
                          className={`w-full text-left p-2 rounded transition-colors flex items-center justify-between ${
                            bookItem.id === currentBook?.id
                              ? "bg-[#d63736]/20 text-[#d63736] font-medium"
                              : "hover:bg-[#252525]"
                          }`}
                          onClick={() => handleBookChange(bookItem.id)}
                        >
                          <span>{bookItem.name}</span>
                          <span className="text-xs text-gray-400">
                            {bookItem.verses && bookItem.verses[0]?.Chapter
                              ? Math.max(
                                  ...bookItem.verses.map((v) => v.Chapter || 1)
                                )
                              : bookItem.verses && bookItem.verses.length > 0
                              ? 1
                              : 0}
                          </span>
                        </button>

                        {bookItem.id === currentBook?.id && (
                          <div className="ml-4 mt-1 grid grid-cols-5 gap-1">
                            {Array.from({ length: getMaxChapters() }, (_, i) => (
                              <button
                                key={i + 1}
                                className={`text-xs p-1 rounded ${
                                  selectedChapter === i + 1
                                    ? "bg-[#d63736] text-white"
                                    : "bg-[#252525] hover:bg-[#333] text-gray-300"
                                }`}
                                onClick={() =>
                                  handleChapterChange((i + 1).toString())
                                }
                              >
                                {i + 1}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bible Content */}
            <div className="md:col-span-2">
              <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
                <div className="p-4 bg-[#252525] flex items-center justify-between">
                  <h2 className="font-bold">
                    {currentBook?.name} {selectedChapter}
                  </h2>
                  <div className="flex gap-2">
                    <Select
                      value={selectedChapter.toString()}
                      onValueChange={handleChapterChange}
                      
                    >
                      <SelectTrigger className="w-32 h-8 text-sm bg-[#1a1a1a] border-gray-700 rounded-xl">
                        <SelectValue placeholder="Chapter" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl bg-[#252525] ">
                        {Array.from({ length: getMaxChapters() }, (_, i) => (
                          <SelectItem
                            key={i + 1}
                            value={(i + 1).toString()}
                            className="rounded-xl"
                          >
                            Chapter {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedVerses.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-xl"
                        onClick={copySelectedVerses}
                      >
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy ({selectedVerses.length})
                      </Button>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {verses.map((verse, index) => (
                      <div
                        key={index}
                        className={`group flex ${
                          selectedVerses.includes(index)
                            ? "bg-[#d63736]/10 p-2 rounded"
                            : ""
                        }`}
                        onClick={() => toggleVerseSelection(index)}
                      >
                        <span className="text-[#d63736] font-bold mr-2 select-none">
                          {verse.Verse}
                        </span>
                        <p className="text-gray-200">{verse.Text}</p>
                      </div>
                    ))}

                    {verses.length === 0 && (
                      <div className="text-center py-10 text-gray-400">
                        <BookOpen className="h-10 w-10 mx-auto mb-4 opacity-30" />
                        <p>No verses found for this chapter.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Chapter Navigation */}
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={goToPreviousChapter}
                  disabled={
                    !currentBook ||
                    (currentBook.id === books[0]?.id && selectedChapter === 1)
                  }
                  className="rounded-xl"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" /> Previous Chapter
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="h-9 w-9 p-0 rounded-xl"
                    disabled
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-9 w-9 p-0 rounded-xl"
                    disabled
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-9 px-3 rounded-xl"
                        disabled
                      >
                        <Download className="h-4 w-4 mr-2" /> Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-[#252525] border-gray-700 rounded-xl"
                    >
                      <DropdownMenuLabel>Export Chapter</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem className="hover:bg-[#333] cursor-pointer rounded-xl" disabled>
                        <FileJson className="h-4 w-4 mr-2" /> JSON Format
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-[#333] cursor-pointer rounded-xl">
                        <FileCode className="h-4 w-4 mr-2" /> XML Format
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-[#333] cursor-pointer rounded-xl">
                        <FilePdf className="h-4 w-4 mr-2" /> PDF Format
                      </DropdownMenuItem>
                      {selectedVerses.length > 0 && (
                        <>
                          <DropdownMenuSeparator className="bg-gray-700" />
                          <DropdownMenuLabel>
                            Export Selected Verses ({selectedVerses.length})
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            className="hover:bg-[#333] cursor-pointer rounded-xl"
                            onClick={copySelectedVerses}
                          >
                            <Copy className="h-4 w-4 mr-2" /> Copy Text
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-[#333] cursor-pointer rounded-xl">
                            <FileJson className="h-4 w-4 mr-2" /> Export as JSON
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-[#333] cursor-pointer rounded-xl">
                            <FileCode className="h-4 w-4 mr-2" /> Export as XML
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button
                  variant="outline"
                  onClick={goToNextChapter}
                  disabled={
                    !currentBook ||
                    (currentBook.id === books[books.length - 1]?.id &&
                      selectedChapter >= getMaxChapters())
                  }
                  className="rounded-xl"
                >
                  Next Chapter <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Reading Tips */}
          <div className="mt-12 bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="md:w-1/4 flex justify-center">
                <div className="w-16 h-16 bg-[#d63736]/20 rounded-full flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-[#d63736]" />
                </div>
              </div>
              <div className="md:w-3/4">
                <h2 className="text-xl font-bold mb-3">Bible Reading Tips</h2>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-[#d63736] mr-2">•</span>
                    <span>
                      Click on any verse to select it. Selected verses can be copied using the Copy button.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d63736] mr-2">•</span>
                    <span>
                      Use the chapter navigation at the bottom to move between chapters.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d63736] mr-2">•</span>
                    <span>
                      Search for specific books using the search box in the sidebar.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d63736] mr-2">•</span>
                    <span>
                      Download the XML file to use this Bible version in your presentation software.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #252525;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d63736;
          border-radius: 10px;
          border: 2px solid #252525;
        }
      `}</style>
    </div>
  )
}