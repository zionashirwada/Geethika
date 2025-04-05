"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from "@dnd-kit/core"
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  useSortable, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, GripVertical, Trash2, Copy, Check } from "lucide-react"

// Slide types
type SlideType = "title" | "bibleVerse" | "customVerse" | "numberedList" | "bulletList"

// Bible verse data
interface BibleVerseData {
  reference: string
  verses: {
    verse: string
    text: string
  }[]
}

// Slide interface
interface Slide {
  id: string
  type: SlideType
  title?: string
  content?: string
  reference?: string
  bibleVersion?: string
  book?: string
  chapter?: string
  fromVerse?: string
  toVerse?: string
  items?: string[]
}

// Bible data
const bibleVersions = ["KJV", "NIV", "ESV", "NKJV", "NLT"]
const bibleBooks = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
]

export default function SlideCreator() {
  // State for slides
  const [slides, setSlides] = useState<Slide[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formattedText, setFormattedText] = useState("")
  const [copied, setCopied] = useState(false)

  // State for form inputs
  const [titleInput, setTitleInput] = useState("")
  const [bibleVersion, setBibleVersion] = useState("KJV")
  const [bibleBook, setBibleBook] = useState("Genesis")
  const [bibleChapter, setBibleChapter] = useState("1")
  const [fromVerse, setFromVerse] = useState("1")
  const [toVerse, setToVerse] = useState("1")
  const [customReference, setCustomReference] = useState("")
  const [customVerseText, setCustomVerseText] = useState("")
  const [listItems, setListItems] = useState("")
  const [activeTab, setActiveTab] = useState("numberedList")

  // Refs for textareas
  const numberedListRef = useRef<HTMLTextAreaElement>(null)
  const bulletListRef = useRef<HTMLTextAreaElement>(null)

  // Generate chapters array based on book (simplified for demo)
  const generateChapters = () => {
    return Array.from({ length: 50 }, (_, i) => (i + 1).toString())
  }

  // Generate verses array based on chapter (simplified for demo)
  const generateVerses = () => {
    return Array.from({ length: 30 }, (_, i) => (i + 1).toString())
  }

  // Fetch Bible verses from API
  const fetchBibleVerses = async (
    version: string,
    book: string,
    chapter: string,
    fromVerse: string,
    toVerse: string,
  ): Promise<BibleVerseData> => {
    try {
      // In a real implementation, you would fetch from your Bible API
      // For now, we'll return mock data
      const verses = Array.from({ length: Number.parseInt(toVerse) - Number.parseInt(fromVerse) + 1 }, (_, i) => ({
        verse: (Number.parseInt(fromVerse) + i).toString(),
        text: `This is verse ${Number.parseInt(fromVerse) + i} of ${book} ${chapter} in ${version}.`,
      }))

      return {
        reference: `${book} ${chapter}:${fromVerse}${fromVerse !== toVerse ? `-${toVerse}` : ""}`,
        verses,
      }
    } catch (error) {
      console.error("Error fetching Bible verses:", error)
      return {
        reference: `${book} ${chapter}:${fromVerse}${fromVerse !== toVerse ? `-${toVerse}` : ""}`,
        verses: [],
      }
    }
  }

  // Add a title slide
  const addTitleSlide = () => {
    if (!titleInput.trim()) return

    const newSlide: Slide = {
      id: Date.now().toString(),
      type: "title",
      title: titleInput,
    }

    setSlides([...slides, newSlide])
    setTitleInput("")
    setDialogOpen(false)
  }

  // Add Bible verse slides
  const addBibleVerseSlides = async () => {
    const bibleData = await fetchBibleVerses(bibleVersion, bibleBook, bibleChapter, fromVerse, toVerse)

    // Create individual slides for each verse
    const newSlides = bibleData.verses.map((verse) => ({
      id: Date.now().toString() + verse.verse,
      type: "bibleVerse" as SlideType,
      reference: `${bibleBook} ${bibleChapter}:${verse.verse}`,
      bibleVersion,
      book: bibleBook,
      chapter: bibleChapter,
      fromVerse: verse.verse,
      toVerse: verse.verse,
      content: verse.text,
    }))

    setSlides([...slides, ...newSlides])
    setDialogOpen(false)
  }

  // Add a custom verse slide
  const addCustomVerseSlide = () => {
    if (!customReference.trim() || !customVerseText.trim()) return

    const newSlide: Slide = {
      id: Date.now().toString(),
      type: "customVerse",
      reference: customReference,
      content: customVerseText,
    }

    setSlides([...slides, newSlide])
    setCustomReference("")
    setCustomVerseText("")
    setDialogOpen(false)
  }

  // Handle copying formatted text
  const copyFormattedText = () => {
    navigator.clipboard.writeText(formattedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle numbered list input change
  const handleNumberedListChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setListItems(e.target.value)
  }

  // Handle bullet list input change
  const handleBulletListChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setListItems(e.target.value)
  }

  // Add a numbered list slide
  const addNumberedListSlide = () => {
    if (!listItems.trim()) return

    const items = listItems.split("\n").filter((item) => item.trim())

    const newSlide: Slide = {
      id: Date.now().toString(),
      type: "numberedList",
      items,
    }

    setSlides([...slides, newSlide])
    setListItems("")
    setDialogOpen(false)
  }

  // Add a bullet list slide
  const addBulletListSlide = () => {
    if (!listItems.trim()) return

    const items = listItems.split("\n").filter((item) => item.trim())

    const newSlide: Slide = {
      id: Date.now().toString(),
      type: "bulletList",
      items,
    }

    setSlides([...slides, newSlide])
    setListItems("")
    setDialogOpen(false)
  }

  // Handle drag end for reordering slides
  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setSlides((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // Reset list items when switching tabs
  useEffect(() => {
    setListItems("")
  }, [activeTab])

  // Generate formatted text based on slides
  useEffect(() => {
    let text = ""

    slides.forEach((slide, index) => {
      switch (slide.type) {
        case "title":
          text += `[${slide.title}]\n${slide.title}\n\n`
          break
        case "bibleVerse":
          text += `[${slide.reference}]\n[#1]\n${slide.reference}\n[#2]\n${slide.content}\n\n`
          break
        case "customVerse":
          text += `[Custom Reference]\n[#1]\n${slide.reference}\n[#2]\n${slide.content}\n\n`
          break
        case "numberedList":
          text += `[Numbered List]\n`
          slide.items?.forEach((item, i) => {
            text += `${i + 1}. ${item}\n`
          })
          text += "\n"
          break
        case "bulletList":
          text += `[Bullet List]\n`
          slide.items?.forEach((item) => {
            text += `• ${item}\n`
          })
          text += "\n"
          break
      }
    })

    setFormattedText(text)
  }, [slides])

  // Get slide type display name
  const getSlideTypeDisplay = (type: SlideType) => {
    switch (type) {
      case "title":
        return "Title"
      case "bibleVerse":
        return "Bible Verse"
      case "customVerse":
        return "Custom Verse"
      case "numberedList":
        return "Numbered List"
      case "bulletList":
        return "Bullet List"
    }
  }

  // Get slide preview content
  const getSlidePreview = (slide: Slide) => {
    switch (slide.type) {
      case "title":
        return slide.title
      case "bibleVerse":
        return `${slide.reference}: ${slide.content?.substring(0, 30)}${slide.content && slide.content.length > 30 ? "..." : ""}`
      case "customVerse":
        return `${slide.reference}: ${slide.content?.substring(0, 30)}${slide.content && slide.content.length > 30 ? "..." : ""}`
      case "numberedList":
        return (
          slide.items
            ?.slice(0, 2)
            .map((item, i) => `${i + 1}. ${item}`)
            .join(", ") + (slide.items && slide.items.length > 2 ? "..." : "")
        )
      case "bulletList":
        return (
          slide.items
            ?.slice(0, 2)
            .map((item) => `• ${item}`)
            .join(", ") + (slide.items && slide.items.length > 2 ? "..." : "")
        )
    }
  }

  const SortableItem = ({ id, index, slide }: { id: string; index: number; slide: Slide }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    return (
      <Card ref={setNodeRef} style={style} {...attributes} className="border border-slate-600 rounded-lg">
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div {...listeners}>
              <GripVertical className="text-gray-400" size={18} />
            </div>
            <CardTitle className="text-sm font-medium">Slide {index + 1}</CardTitle>
            <Badge variant="outline" className="ml-2 bg-[#d63736]/90 text-primary border-slate-600">
              {getSlideTypeDisplay(slide.type)}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/90 hover:bg-[#d63736]/10"
            onClick={() => {
              const newSlides = [...slides]
              newSlides.splice(index, 1)
              setSlides(newSlides)
            }}
          >
            <Trash2 size={16} />
          </Button>
        </CardHeader>
        <CardContent className="py-2 px-4">
          <p className="text-sm text-gray-700 truncate">{getSlidePreview(slide)}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Slide Creator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Slide List */}
        <div className="bg-[#161616] rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary">Slides</h2>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 rounded-xl bg-[#d63736] hover:bg-[#d63736]/90 rounded-x;">
                  <PlusCircle size={16} />
                  Add Slide
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-black border-slate-800 rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-primary">Add New Slide</DialogTitle>
                </DialogHeader>
                <Tabs
                  defaultValue="title"
                  className="mt-4 bg-black"
                  onValueChange={(value) => {
                    setActiveTab(value as any)
                    setListItems("")
                  }}
                >
                  <TabsList className="grid grid-cols-5 mb-4 bg-[#161616] rounded-xl">
                    <TabsTrigger value="title">Title</TabsTrigger>
                    <TabsTrigger value="bibleVerse">Bible Verse</TabsTrigger>
                    <TabsTrigger value="customVerse">Custom Verse</TabsTrigger>
                    <TabsTrigger value="numberedList">Numbered List</TabsTrigger>
                    <TabsTrigger value="bulletList">Bullet List</TabsTrigger>
                  </TabsList>

                  {/* Title Slide Form */}
                  <TabsContent value="title">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input
                        className="border-slate-600 rounded-xl"
                          value={titleInput}
                          onChange={(e) => setTitleInput(e.target.value)}
                          placeholder="Enter slide title"
                        />
                      </div>
                      <Button onClick={addTitleSlide} className="bg-[#d63736] hover:bg-[#d63736]/90 rounded-xl">
                        Add Slide
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Bible Verse Slide Form */}
                  <TabsContent value="bibleVerse">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Bible Version</label>
                          <Select value={bibleVersion} onValueChange={setBibleVersion} >
                            <SelectTrigger>
                              <SelectValue placeholder="Select version" />
                            </SelectTrigger>
                            <SelectContent className="border-slate-600 rounded-xl bg-black">
                              {bibleVersions.map((version) => (
                                <SelectItem key={version} value={version} >
                                  {version}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Book</label>
                          <Select value={bibleBook} onValueChange={setBibleBook}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select book" />
                            </SelectTrigger>
                            <SelectContent className="border-slate-600 rounded-xl bg-black">
                              {bibleBooks.map((book) => (
                                <SelectItem key={book} value={book}>
                                  {book}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Chapter</label>
                          <Select value={bibleChapter} onValueChange={setBibleChapter}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chapter" />
                            </SelectTrigger>
                            <SelectContent className="border-slate-600 rounded-xl bg-black">
                              {generateChapters().map((chapter) => (
                                <SelectItem key={chapter} value={chapter}>
                                  {chapter}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">From Verse</label>
                          <Select value={fromVerse} onValueChange={setFromVerse}>
                            <SelectTrigger>
                              <SelectValue placeholder="From" />
                            </SelectTrigger>
                            <SelectContent className="border-slate-600 rounded-xl bg-black">
                              {generateVerses().map((verse) => (
                                <SelectItem key={verse} value={verse}>
                                  {verse}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">To Verse</label>
                          <Select value={toVerse} onValueChange={setToVerse}>
                            <SelectTrigger>
                              <SelectValue placeholder="To" />
                            </SelectTrigger>
                            <SelectContent className="border-slate-600 rounded-xl bg-black">
                              {generateVerses().map((verse) => (
                                <SelectItem key={verse} value={verse}>
                                  {verse}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button onClick={addBibleVerseSlides} className="bg-[#d63736] hover:bg-[#d63736]/90 rounded-xl">
                        Add Slide
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Custom Verse Slide Form */}
                  <TabsContent value="customVerse">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Reference</label>
                        <Input
                        className="border-slate-600 rounded-xl"
                          value={customReference}
                          onChange={(e) => setCustomReference(e.target.value)}
                          placeholder="e.g., Personal Reflection"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Verse Text</label>
                        <Textarea
                        className="border-slate-600 rounded-xl"
                          value={customVerseText}
                          onChange={(e) => setCustomVerseText(e.target.value)}
                          placeholder="Enter verse text"
                          rows={5}
                        />
                      </div>
                      <Button onClick={addCustomVerseSlide} className="bg-[#d63736] hover:bg-[#d63736]/90 rounded-xl">
                        Add Slide
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Numbered List Slide Form */}
                  <TabsContent value="numberedList">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">List Items (one per line)</label>
                        <Textarea
                          ref={numberedListRef}
                          value={listItems}
                          onChange={handleNumberedListChange}
                          placeholder="Enter list items, one per line"
                          rows={5}
                          className="border-slate-600 rounded-xl font-mono"
                        />
                        <div className="mt-2 text-sm text-gray-500">
                          Preview:
                          <div className="mt-1 pl-4 font-mono">
                            {listItems
                              .split("\n")
                              .filter((line) => line.trim())
                              .map((line, i) => (
                                <div key={i}>
                                  {i + 1}. {line}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                      <Button onClick={addNumberedListSlide} className="bg-[#d63736] hover:bg-[#d63736]/90 rounded-xl">
                        Add Slide
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Bullet List Slide Form */}
                  <TabsContent value="bulletList">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">List Items (one per line)</label>
                        <Textarea
                          ref={bulletListRef}
                          value={listItems}
                          onChange={handleBulletListChange}
                          placeholder="Enter list items, one per line"
                          rows={5}
                          className="border-slate-600 rounded-xl font-mono"
                        />
                        <div className="mt-2 text-sm text-gray-500">
                          Preview:
                          <div className="mt-1 pl-4 font-mono">
                            {listItems
                              .split("\n")
                              .filter((line) => line.trim())
                              .map((line, i) => (
                                <div key={i}>• {line}</div>
                              ))}
                          </div>
                        </div>
                      </div>
                      <Button onClick={addBulletListSlide} className="bg-[#d63736] hover:bg-[#d63736]/90 rounded-xl">
                        Add Slide
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>

          <DndContext 
            sensors={useSensors(
              useSensor(PointerSensor),
              useSensor(KeyboardSensor, {
                coordinateGetter: sortableKeyboardCoordinates,
              })
            )}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={slides.map((slide) => slide.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {slides.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No slides yet. Click &quot;Add Slide&quot; to get started.
                  </div>
                ) : (
                  slides.map((slide, index) => (
                    <SortableItem key={slide.id} id={slide.id} index={index} slide={slide} />
                  ))
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Right Column - Formatted Text */}
        <div className="bg-[#161616] rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary">Formatted Text</h2>
            <Button
              onClick={copyFormattedText}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-slate-600 text-primary rounded-xl hover:bg-[#d63736]/10"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy All"}
            </Button>
          </div>
          <Textarea value={formattedText} readOnly className="w-full h-[calc(100vh-200px)] border-slate-600  rounded-xlfont-mono text-sm" />
        </div>
      </div>
    </div>
  )
}

