"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Book, Download, ChevronRight, Search, Filter, FileJson, FileCode, FileIcon as FilePdf } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { bibleVersions } from "@/data/bibleVersions"


export default function BiblePageMenu() {
 
  // Add state for filtered versions
  const [filteredVersions, setFilteredVersions] = useState(bibleVersions)

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
     
      {/* Main Content */}
      <main>
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Bible Versions</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Access and download different Bible translations in Tamil, Sinhala, and English for your worship and study
              needs.
            </p>
            <div className="h-1 w-20 bg-[#d63736] mx-auto mt-6"></div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 rounded-xl" />
                <Input
                  type="text"
                  placeholder="Search Bible versions..."
                  className="pl-10 bg-[#252525] border-gray-700 text-white rounded-xl"
                  onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase()
                    setFilteredVersions(
                      bibleVersions.filter(
                        (bible) =>
                          bible.title.toLowerCase().includes(searchTerm) ||
                          bible.description.toLowerCase().includes(searchTerm),
                      ),
                    )
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="w-40 ">
                  <Select
                    defaultValue="all"
                    onValueChange={(value) => {
                      if (value === "all") {
                        setFilteredVersions(bibleVersions)
                      } else {
                        setFilteredVersions(bibleVersions.filter((bible) => bible.language.toLowerCase() === value))
                      }
                    }}
                  >
                    <SelectTrigger className="bg-[#252525] border-gray-700 rounded-xl">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-gray-700 rounded-xl">
                        <SelectItem className="hover:bg-[#333] rounded" value="all">
                            All Languages
                        </SelectItem>
                        <SelectItem className="hover:bg-[#333] rounded" value="english">
                            English
                        </SelectItem>
                        <SelectItem className="hover:bg-[#333] rounded" value="tamil">
                            Tamil
                        </SelectItem>
                        <SelectItem className="hover:bg-[#333] rounded" value="sinhala">
                            Sinhala
                        </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-40">
                  <Select
                    defaultValue="all"
                    onValueChange={(value) => {
                      if (value === "all") {
                        setFilteredVersions(bibleVersions)
                      } else if (value === "recent") {
                        setFilteredVersions([...bibleVersions].sort((a, b) => b.year - a.year).slice(0, 6))
                      } else if (value === "oldest") {
                        setFilteredVersions([...bibleVersions].sort((a, b) => a.year - b.year).slice(0, 6))
                      }
                    }}
                  >
                    <SelectTrigger className="bg-[#252525] border-gray-700 rounded-xl">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-gray-700 rounded-xl">
                      <SelectItem value="all">All Versions</SelectItem>
                      <SelectItem value="popular">Popular</SelectItem>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-[#d63736] hover:bg-[#c52c2c] rounded-xl" onClick={() => setFilteredVersions(bibleVersions)}>
                  <Filter className="h-4 w-4 mr-2" /> Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Bible Versions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVersions.map((bible) => (
              <div
                key={bible.id}
                className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden hover:border-[#d63736] transition-colors"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded-full mr-2 ${
                          bible.language === "English"
                            ? "bg-blue-900/30 text-blue-400"
                            : bible.language === "Tamil"
                              ? "bg-yellow-900/30 text-yellow-400"
                              : "bg-green-900/30 text-green-400"
                        }`}
                      >
                        {bible.language}
                      </span>
                     
                    </div>
                    <span className="text-xs text-gray-400">{bible.year}</span>
                  </div>

                  <h2 className="text-xl font-bold mb-2">{bible.title}</h2>
                  <p className="text-gray-300 text-sm mb-4">{bible.description}</p>

  

                  <div className="flex gap-2">
                    <Link href={`/bible/${bible.id}`} className="flex-1">
                      <Button className="w-full bg-[#252525] hover:bg-[#333] text-white rounded-xl">
                        Read <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="bg-[#252525] hover:bg-[#333] px-3 rounded-xl">
                          <Download className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#252525] border-gray-700 rounded-xl">
                        <DropdownMenuLabel>Download Format</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem className="hover:bg-[#333] cursor-pointer">
                          <FileJson className="h-4 w-4 mr-2" /> JSON Format
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-[#333] cursor-pointer">
                          <FileCode className="h-4 w-4 mr-2" /> XML Format
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-[#333] cursor-pointer">
                          <FilePdf className="h-4 w-4 mr-2" /> PDF Format
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-16 bg-[#1a1a1a] p-8 rounded-xl border border-gray-800">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="md:w-1/3 flex justify-center">
                <div className="w-20 h-20 bg-[#d63736]/20 rounded-full flex items-center justify-center">
                  <Book className="h-10 w-10 text-[#d63736]" />
                </div>
              </div>
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-4">About Our Bible Resources</h2>
                <p className="text-gray-300 mb-4">
                  Our Bible resources are provided to help churches and individuals access Scripture in their preferred
                  language. The XML downloads are compatible with most church presentation software.
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-[#d63736] mr-2">•</span>
                    <span>
                      All Bible texts are provided in XML & JSON format for easy integration with presentation software
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d63736] mr-2">•</span>
                    <span>The online reader allows you to search, highlight, and bookmark passages</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d63736] mr-2">•</span>
                    <span>Tamil and Sinhala translations use Unicode for proper display on all devices</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d63736] mr-2">•</span>
                    <span>We regularly update our translations to ensure accuracy and clarity</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

   
    </div>
  )
}

