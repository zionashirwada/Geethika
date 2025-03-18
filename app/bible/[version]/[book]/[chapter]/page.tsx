// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { useParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import {
//   ArrowLeft,
//   Book,
//   Download,
//   Search,
//   ChevronRight,
//   ChevronLeft,
//   Copy,
//   BookOpen,
//   Share2,
//   Bookmark,
//   FileJson,
//   FileCode,
//   FileIcon as FilePdf,
// } from "lucide-react"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// interface BibleVersion {
//   id: string;
//   title: string;
//   description: string;
//   language: string;
//   year: number;
//   books: number;
//   xmlSize: string;
// }

// interface BibleBook {
//   id: string;
//   name: string;
//   chapters: number;
//   testament: 'old' | 'new';
// }

// // Mock Bible version data
// const getBibleVersion = (id: string): BibleVersion => {
//   const versions: Record<string, BibleVersion> = {
//     kjv: {
//       id: "kjv",
//       title: "King James Version (KJV)",
//       description: "The King James Version (KJV) is an English translation of the Christian Bible completed in 1611.",
//       language: "English",
//       year: 1611,
//       books: 66,
//       xmlSize: "4.2 MB",
//     },
//     "tamil-bible": {
//       id: "tamil-bible",
//       title: "Tamil Bible",
//       description: "The complete Bible translated into Tamil language, widely used in Tamil-speaking churches.",
//       language: "Tamil",
//       year: 1995,
//       books: 66,
//       xmlSize: "5.1 MB",
//     },
//     "sinhala-bible": {
//       id: "sinhala-bible",
//       title: "Sinhala Bible",
//       description: "The complete Bible translated into Sinhala language, widely used in Sri Lankan churches.",
//       language: "Sinhala",
//       year: 1990,
//       books: 66,
//       xmlSize: "4.8 MB",
//     },
//     niv: {
//       id: "niv",
//       title: "New International Version (NIV)",
//       description:
//         "The New International Version (NIV) is an English translation of the Bible first published in 1978.",
//       language: "English",
//       year: 1978,
//       books: 66,
//       xmlSize: "4.5 MB",
//     },
//   }

//   return versions[id] || versions.kjv
// }

// // Mock Bible books data
// const bibleBooks: BibleBook[] = [
//   { id: "genesis", name: "Genesis", chapters: 50, testament: "old" },
//   { id: "exodus", name: "Exodus", chapters: 40, testament: "old" },
//   { id: "leviticus", name: "Leviticus", chapters: 27, testament: "old" },
//   { id: "numbers", name: "Numbers", chapters: 36, testament: "old" },
//   { id: "deuteronomy", name: "Deuteronomy", chapters: 34, testament: "old" },
//   { id: "joshua", name: "Joshua", chapters: 24, testament: "old" },
//   { id: "judges", name: "Judges", chapters: 21, testament: "old" },
//   { id: "ruth", name: "Ruth", chapters: 4, testament: "old" },
//   { id: "1samuel", name: "1 Samuel", chapters: 31, testament: "old" },
//   { id: "2samuel", name: "2 Samuel", chapters: 24, testament: "old" },
//   { id: "matthew", name: "Matthew", chapters: 28, testament: "new" },
//   { id: "mark", name: "Mark", chapters: 16, testament: "new" },
//   { id: "luke", name: "Luke", chapters: 24, testament: "new" },
//   { id: "john", name: "John", chapters: 21, testament: "new" },
//   { id: "acts", name: "Acts", chapters: 28, testament: "new" },
//   { id: "romans", name: "Romans", chapters: 16, testament: "new" },
//   { id: "1corinthians", name: "1 Corinthians", chapters: 16, testament: "new" },
//   { id: "2corinthians", name: "2 Corinthians", chapters: 13, testament: "new" },
//   { id: "revelation", name: "Revelation", chapters: 22, testament: "new" },
// ]

// // Get book by ID
// const getBookById = (bookId: string): BibleBook => {
//   return bibleBooks.find((book) => book.id === bookId) || bibleBooks[0]
// }

// // Mock chapter content generator
// const getChapterContent = (bookId: string, chapter: string): string[] => {
//   // Genesis 1
//   if (bookId === "genesis" && chapter === "1") {
//     return [
//       "In the beginning God created the heaven and the earth.",
//       "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
//       "And God said, Let there be light: and there was light.",
//       "And God saw the light, that it was good: and God divided the light from the darkness.",
//       "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.",
//       "And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.",
//       "And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.",
//       "And God called the firmament Heaven. And the evening and the morning were the second day.",
//       "And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.",
//       "And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.",
//       "And God said, Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind, whose seed is in itself, upon the earth: and it was so.",
//       "And the earth brought forth grass, and herb yielding seed after his kind, and the tree yielding fruit, whose seed was in itself, after his kind: and God saw that it was good.",
//       "And the evening and the morning were the third day.",
//       "And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years:",
//       "And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so.",
//       "And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also.",
//       "And God set them in the firmament of the heaven to give light upon the earth,",
//       "And to rule over the day and over the night, and to divide the light from the darkness: and God saw that it was good.",
//       "And the evening and the morning were the fourth day.",
//       "And God said, Let the waters bring forth abundantly the moving creature that hath life, and fowl that may fly above the earth in the open firmament of heaven.",
//     ]
//   }

//   // John 3
//   if (bookId === "john" && chapter === "3") {
//     return [
//       "There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:",
//       "The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him.",
//       "Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.",
//       "Nicodemus saith unto him, How can a man be born when he is old? can he enter the second time into his mother's womb, and be born?",
//       "Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God.",
//       "That which is born of the flesh is flesh; and that which is born of the Spirit is spirit.",
//       "Marvel not that I said unto thee, Ye must be born again.",
//       "The wind bloweth where it listeth, and thou hearest the sound thereof, but canst not tell whence it cometh, and whither it goeth: so is every one that is born of the Spirit.",
//       "Nicodemus answered and said unto him, How can these things be?",
//       "Jesus answered and said unto him, Art thou a master of Israel, and knowest not these things?",
//       "Verily, verily, I say unto thee, We speak that we do know, and testify that we have seen; and ye receive not our witness.",
//       "If I have told you earthly things, and ye believe not, how shall ye believe, if I tell you of heavenly things?",
//       "And no man hath ascended up to heaven, but he that came down from heaven, even the Son of man which is in heaven.",
//       "And as Moses lifted up the serpent in the wilderness, even so must the Son of man be lifted up:",
//       "That whosoever believeth in him should not perish, but have eternal life.",
//       "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
//     ]
//   }

//   // Default content for other chapters
//   return Array.from({ length: 20 }, (_, i) => `This is verse ${i + 1} of chapter ${chapter} in the book of ${bookId}.`)
// }

// export default function BibleReadingPage() {
//   const params = useParams<{ version: string; book: string; chapter: string }>()
//   const router = useRouter()
//   const { version, book, chapter } = params

//   const [searchTerm, setSearchTerm] = useState("")
//   const [filteredBooks, setFilteredBooks] = useState(bibleBooks)
//   const [expandedTestament, setExpandedTestament] = useState("both")
//   const [selectedVerses, setSelectedVerses] = useState<number[]>([])

//   const bibleVersion = getBibleVersion(version)
//   const currentBook = getBookById(book)
//   const verses = getChapterContent(book, chapter)

//   // Filter books based on search term
//   useEffect(() => {
//     if (searchTerm) {
//       setFilteredBooks(bibleBooks.filter((book) => book.name.toLowerCase().includes(searchTerm.toLowerCase())))
//     } else {
//       setFilteredBooks(bibleBooks)
//     }
//   }, [searchTerm])

//   // Handle chapter change
//   const handleChapterChange = (newChapter: string) => {
//     router.push(`/bible/${version}/${book}/${newChapter}`)
//   }

//   // Handle book change
//   const handleBookChange = (newBook: string) => {
//     router.push(`/bible/${version}/${newBook}/1`)
//   }

//   // Toggle verse selection
//   const toggleVerseSelection = (verseIndex: number) => {
//     if (selectedVerses.includes(verseIndex)) {
//       setSelectedVerses(selectedVerses.filter((v) => v !== verseIndex))
//     } else {
//       setSelectedVerses([...selectedVerses, verseIndex])
//     }
//   }

//   // Copy selected verses
//   const copySelectedVerses = () => {
//     if (selectedVerses.length === 0) return

//     const textToCopy = selectedVerses
//       .sort((a, b) => a - b)
//       .map((index) => `${index + 1} ${verses[index]}`)
//       .join("\n\n")

//     navigator.clipboard.writeText(textToCopy)

//     // Show toast or notification here
//     alert("Selected verses copied to clipboard")
//   }

//   // Navigate to previous chapter
//   const goToPreviousChapter = () => {
//     const currentChapterNum = Number.parseInt(chapter)
//     if (currentChapterNum > 1) {
//       // Go to previous chapter in same book
//       router.push(`/bible/${version}/${book}/${currentChapterNum - 1}`)
//     } else {
//       // Go to last chapter of previous book
//       const currentBookIndex = bibleBooks.findIndex((b) => b.id === book)
//       if (currentBookIndex > 0) {
//         const previousBook = bibleBooks[currentBookIndex - 1]
//         router.push(`/bible/${version}/${previousBook.id}/${previousBook.chapters}`)
//       }
//     }
//   }

//   // Navigate to next chapter
//   const goToNextChapter = () => {
//     const currentChapterNum = Number.parseInt(chapter)
//     if (currentChapterNum < currentBook.chapters) {
//       // Go to next chapter in same book
//       router.push(`/bible/${version}/${book}/${currentChapterNum + 1}`)
//     } else {
//       // Go to first chapter of next book
//       const currentBookIndex = bibleBooks.findIndex((b) => b.id === book)
//       if (currentBookIndex < bibleBooks.length - 1) {
//         const nextBook = bibleBooks[currentBookIndex + 1]
//         router.push(`/bible/${version}/${nextBook.id}/1`)
//       }
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#0d0d0d] text-white">
      
//       {/* Main Content */}
//       <main className="container mx-auto py-12 px-4">
//         <div className="max-w-6xl mx-auto">
//           {/* Back Button */}
//           <div className="mb-6">
//             <Link href="/bible">
//               <Button variant="outline" className="flex items-center gap-2 rounded-xl">
//                 <ArrowLeft className="h-4 w-4" />
//                 Back to Bible Versions
//               </Button>
//             </Link>
//           </div>

//           {/* Bible Version Info */}
//           <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 mb-8">
//             <div className="flex flex-col md:flex-row justify-between items-start gap-4">
//               <div>
//                 <div className="flex items-center gap-2 mb-2">
//                   <span
//                     className={`px-2 py-1 text-xs font-bold rounded-full ${
//                       bibleVersion.language === "English"
//                         ? "bg-blue-900/30 text-blue-400"
//                         : bibleVersion.language === "Tamil"
//                           ? "bg-yellow-900/30 text-yellow-400"
//                           : "bg-green-900/30 text-green-400"
//                     }`}
//                   >
//                     {bibleVersion.language}
//                   </span>
//                   <span className="text-sm text-gray-400">{bibleVersion.year}</span>
//                 </div>
//                 <h1 className="text-2xl md:text-3xl font-bold mb-2">{bibleVersion.title}</h1>
//                 <p className="text-gray-300 text-sm md:text-base">{bibleVersion.description}</p>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button className="bg-[#252525] hover:bg-[#333] flex items-center gap-2 rounded-xl">
//                       <Download className="h-4 w-4" />
//                       Download
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="bg-[#252525] border-gray-700 rounded-xl">
//                     <DropdownMenuLabel>Download Options</DropdownMenuLabel>
//                     <DropdownMenuSeparator className="bg-gray-700" />
//                     <DropdownMenuItem className="hover:bg-[#333] cursor-pointer rounded-xl">
//                       <FileJson className="h-4 w-4 mr-2" /> Full Bible (JSON)
//                     </DropdownMenuItem>
//                     <DropdownMenuItem className="hover:bg-[#333] cursor-pointer rounded-xl">
//                       <FileCode className="h-4 w-4 mr-2" /> Full Bible (XML)
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator className="bg-gray-700" />
//                     <DropdownMenuItem className="hover:bg-[#333] cursor-pointer rounded-xl">
//                       <FileJson className="h-4 w-4 mr-2" /> Current Book (JSON)
//                     </DropdownMenuItem>
//                     <DropdownMenuItem className="hover:bg-[#333] cursor-pointer rounded-xl">
//                       <FileCode className="h-4 w-4 mr-2" /> Current Book (XML)
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator className="bg-gray-700" />
//                     <DropdownMenuItem className="hover:bg-[#333] cursor-pointer rounded-xl">
//                       <FilePdf className="h-4 w-4 mr-2" /> Current Chapter (PDF)
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </div>
//           </div>

//           {/* Bible Navigation and Content */}
//           <div className="grid md:grid-cols-3 gap-8">
//             {/* Sidebar Navigation */}
//             <div className="md:col-span-1">
//               <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden sticky top-4">
//                 <div className="p-4 bg-[#252525]">
//                   <h2 className="font-bold flex items-center">
//                     <Book className="mr-2 text-[#d63736] h-4 w-4" /> Bible Books
//                   </h2>
//                 </div>

//                 <div className="p-4">
//                   <div className="relative mb-4">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                     <Input
//                       type="text"
//                       placeholder="Search books..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-9 py-1 h-9 text-sm bg-[#252525] border-gray-700 text-white rounded-xl"
//                     />
//                   </div>

//                   <div className="flex gap-2 mb-4">
//                     <Button
//                       size="sm"
//                       variant={expandedTestament === "both" || expandedTestament === "old" ? "default" : "outline"}
//                       className={`rounded-xl ${expandedTestament === "both" || expandedTestament === "old" ? "bg-[#d63736]" : ""}`}
//                       onClick={() => setExpandedTestament((prev) => (prev === "old" ? "both" : "old"))}
//                     >
//                       Old Testament
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant={expandedTestament === "both" || expandedTestament === "new" ? "default" : "outline"}
//                       className={`rounded-xl ${expandedTestament === "both" || expandedTestament === "new" ? "bg-[#d63736]" : ""}`}
//                       onClick={() => setExpandedTestament((prev) => (prev === "new" ? "both" : "new"))}
//                     >
//                       New Testament
//                     </Button>
//                   </div>

//                   <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
//                     {filteredBooks
//                       .filter((b) => expandedTestament === "both" || b.testament === expandedTestament)
//                       .map((bookItem) => (
//                         <div key={bookItem.id} className="group">
//                           <button
//                             className={`w-full text-left p-2 rounded transition-colors flex items-center justify-between rounded-xl ${
//                               bookItem.id === book ? "bg-[#d63736]/20 text-[#d63736] font-medium" : "hover:bg-[#252525]"
//                             }`}
//                             onClick={() => handleBookChange(bookItem.id)}
//                           >
//                             <span>{bookItem.name}</span>
//                             <span className="text-xs text-gray-400">{bookItem.chapters}</span>
//                           </button>

//                           {bookItem.id === book && (
//                             <div className="ml-4 mt-1 grid grid-cols-5 gap-1">
//                               {Array.from({ length: bookItem.chapters }, (_, i) => (
//                                 <button
//                                   key={i + 1}
//                                   className={`text-xs p-1 rounded rounded-xl ${
//                                     chapter === (i + 1).toString()
//                                       ? "bg-[#d63736] text-white"
//                                       : "bg-[#252525] hover:bg-[#333] text-gray-300"
//                                   }`}
//                                   onClick={() => handleChapterChange((i + 1).toString())}
//                                 >
//                                   {i + 1}
//                                 </button>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Bible Content */}
//             <div className="md:col-span-2">
//               <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
//                 <div className="p-4 bg-[#252525] flex items-center justify-between">
//                   <h2 className="font-bold">
//                     {currentBook.name} {chapter}
//                   </h2>
//                   <div className="flex gap-2">
//                     <Select value={chapter.toString()} onValueChange={handleChapterChange}>
//                       <SelectTrigger className="w-32 h-8 text-sm bg-[#1a1a1a] border-gray-700 rounded-xl">
//                         <SelectValue placeholder="Chapter" />
//                       </SelectTrigger>
//                       <SelectContent className="rounded-xl">
//                         {Array.from({ length: currentBook.chapters }, (_, i) => (
//                           <SelectItem key={i + 1} value={(i + 1).toString()} className="rounded-xl">
//                             Chapter {i + 1}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>

//                     {selectedVerses.length > 0 && (
//                       <Button size="sm" variant="outline" className="h-8 rounded-xl" onClick={copySelectedVerses}>
//                         <Copy className="h-3.5 w-3.5 mr-1" />
//                         Copy ({selectedVerses.length})
//                       </Button>
//                     )}
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   <div className="space-y-4">
//                     {verses.map((verse, index) => (
//                       <div
//                         key={index}
//                         className={`group flex ${selectedVerses.includes(index) ? "bg-[#d63736]/10 p-2 rounded" : ""}`}
//                         onClick={() => toggleVerseSelection(index)}
//                       >
//                         <span className="text-[#d63736] font-bold mr-2 select-none">{index + 1}</span>
//                         <p className="text-gray-200">{verse}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Chapter Navigation */}
//               <div className="mt-6 flex justify-between">
//                 <Button
//                   variant="outline"
//                   onClick={goToPreviousChapter}
//                   disabled={book === "genesis" && chapter === "1"}
//                   className="rounded-xl"
//                 >
//                   <ChevronLeft className="h-4 w-4 mr-2" /> Previous Chapter
//                 </Button>
//                 <div className="flex gap-2">
//                   <Button variant="outline" className="h-9 w-9 p-0 rounded-xl">
//                     <Bookmark className="h-4 w-4" />
//                   </Button>
//                   <Button variant="outline" className="h-9 w-9 p-0 rounded-xl">
//                     <Share2 className="h-4 w-4" />
//                   </Button>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="outline" className="h-9 px-3 rounded-xl">
//                         <Download className="h-4 w-4 mr-2" /> Export
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end" className="bg-[#252525] border-gray-700 rounded-xl">
//                       <DropdownMenuLabel>Export Chapter</DropdownMenuLabel>
//                       <DropdownMenuSeparator className="bg-gray-700" />
//                       <DropdownMenuItem className="hover:bg-[#333] cursor-pointer rounded-xl">
//                         <FileJson className="h-4 w-4 mr-2" /> JSON Format
//                       </DropdownMenuItem>
//                       <DropdownMenuItem className="hover:bg-[#333] cursor-pointer rounded-xl">
//                         <FileCode className="h-4 w-4 mr-2" /> XML Format
//                       </DropdownMenuItem>
//                       <DropdownMenuItem className="hover:bg-[#333] cursor-pointer rounded-xl">
//                         <FilePdf className="h-4 w-4 mr-2" /> PDF Format
//                       </DropdownMenuItem>
//                       {selectedVerses.length > 0 && (
//                         <>
//                           <DropdownMenuSeparator className="bg-gray-700" />
//                           <DropdownMenuLabel>Export Selected Verses ({selectedVerses.length})</DropdownMenuLabel>
//                           <DropdownMenuItem className="hover:bg-[#333] cursor-pointer rounded-xl" onClick={copySelectedVerses}>
//                             <Copy className="h-4 w-4 mr-2" /> Copy Text
//                           </DropdownMenuItem>
//                           <DropdownMenuItem className="hover:bg-[#333] cursor-pointer rounded-xl">
//                             <FileJson className="h-4 w-4 mr-2" /> Export as JSON
//                           </DropdownMenuItem>
//                           <DropdownMenuItem className="hover:bg-[#333] cursor-pointer rounded-xl">
//                             <FileCode className="h-4 w-4 mr-2" /> Export as XML
//                           </DropdownMenuItem>
//                         </>
//                       )}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//                 <Button
//                   variant="outline"
//                   onClick={goToNextChapter}
//                   disabled={book === "revelation" && chapter === "22"}
//                   className="rounded-xl"
//                 >
//                   Next Chapter <ChevronRight className="h-4 w-4 ml-2" />
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Reading Tips */}
//           <div className="mt-12 bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
//             <div className="flex flex-col md:flex-row items-start gap-6">
//               <div className="md:w-1/4 flex justify-center">
//                 <div className="w-16 h-16 bg-[#d63736]/20 rounded-full flex items-center justify-center">
//                   <BookOpen className="h-8 w-8 text-[#d63736]" />
//                 </div>
//               </div>
//               <div className="md:w-3/4">
//                 <h2 className="text-xl font-bold mb-3">Bible Reading Tips</h2>
//                 <ul className="space-y-2 text-gray-300">
//                   <li className="flex items-start">
//                     <span className="text-[#d63736] mr-2">•</span>
//                     <span>Click on any verse to select it. Selected verses can be copied using the Copy button.</span>
//                   </li>
//                   <li className="flex items-start">
//                     <span className="text-[#d63736] mr-2">•</span>
//                     <span>Use the chapter navigation at the bottom to move between chapters.</span>
//                   </li>
//                   <li className="flex items-start">
//                     <span className="text-[#d63736] mr-2">•</span>
//                     <span>Filter books by Old or New Testament using the buttons in the sidebar.</span>
//                   </li>
//                   <li className="flex items-start">
//                     <span className="text-[#d63736] mr-2">•</span>
//                     <span>Download the XML file to use this Bible version in your presentation software.</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       <style jsx>{`
//         /* Custom scrollbar styles */
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 8px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #252525;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background-color: #d63736;
//           border-radius: 10px;
//           border: 2px solid #252525;
//         }
//       `}</style>
//     </div>
//   )
// }

import React from 'react'

interface Props {
  
}

const page = (props: Props) => {
  return (
    <div>
      
    </div>
  )
}

export default page
