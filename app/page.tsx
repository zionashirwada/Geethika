'use client';

import { useState } from 'react';
import { Book, Languages, Menu, Music, Search } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
  
      <main >
      <div className="min-h-screen bg-[#0d0d0d] text-white">
      

      {/* Hero Section */}
      <section className="container mx-auto  px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Worship Resources for Your Church</h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Access hymns, Bible verses, and translation tools in Tamil, Sinhala, and English
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/lyrics" className="text-white">
            <Button className="bg-[#d63736] hover:bg-[#c52c2c] text-white px-8 py-6 rounded-xl">Search Lyrics</Button>
            </Link>
            <Link href="/add" className="text-white">
            <Button variant="outline" className="border-[#d63736] text-[#d63736] hover:bg-[#d63736]/10 px-8 py-6 rounded-xl">
              Add New
            </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="text-[#d63736]">Features</span> Designed for Worship
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Lyrics Feature */}
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 hover:border-[#d63736] transition-colors ">
            <div className="w-12 h-12 bg-[#d63736]/20 rounded-full flex items-center justify-center mb-4">
              <Search className="text-[#d63736]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Lyrics Search</h3>
            <p className="text-gray-400 mb-4">
              Search for hymns in Tamil, Sinhala, and English. Copy in Unicode or legacy fonts.
            </p>
            <Link href="/lyrics" className="text-[#d63736] hover:underline inline-flex items-center">
              Search Lyrics
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Bible Feature */}
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 hover:border-[#d63736] transition-colors">
            <div className="w-12 h-12 bg-[#d63736]/20 rounded-full flex items-center justify-center mb-4">
              <Book className="text-[#d63736]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Bible Viewer</h3>
            <p className="text-gray-400 mb-4">
              Read different versions of the Bible and download XML files for your presentations.
            </p>
            <Link href="/bible" className="text-[#d63736] hover:underline inline-flex items-center">
              Open Bible
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Hymns Feature */}
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 hover:border-[#d63736] transition-colors">
            <div className="w-12 h-12 bg-[#d63736]/20 rounded-full flex items-center justify-center mb-4">
              <Music className="text-[#d63736]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Hymns Library</h3>
            <p className="text-gray-400 mb-4">
              Access MP3 database of hymns and connect with Spotify for worship music.
            </p>
            <Link href="/hymns" className="text-[#d63736] hover:underline inline-flex items-center">
              Listen to Hymns
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Translate Feature */}
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 hover:border-[#d63736] transition-colors">
            <div className="w-12 h-12 bg-[#d63736]/20 rounded-full flex items-center justify-center mb-4">
              <Languages className="text-[#d63736]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Font Convertor</h3>
            <p className="text-gray-400 mb-4">
              Convert between Unicode and legacy fonts for Tamil and Sinhala for easy presentation.
            </p>
            <Link href="/translate" className="text-[#d63736] hover:underline inline-flex items-center">
              Convert Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

 {/* AI Tools Section */}
 <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="text-[#d63736]">AI-Powered</span> Ministry Tools
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center ">
          

          {/* Sunda</div>y School Studio */}
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 hover:border-[#d63736] transition-colors ">
            <div className="w-12 h-12 bg-[#d63736]/20 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#d63736]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Sunday School Studio</h3>
            <p className="text-gray-400 mb-4">
              Generate custom images based on Bible verses for Sunday school materials. Create coloring pages and visual
              aids for children's ministry.
            </p>
            <Link
              href="/ai/sunday-school-studio"
              className="text-[#d63736] hover:underline inline-flex items-center"
            >
              Create Images
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

        

          {/* SOAPer Tool */}
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 hover:border-[#d63736] transition-colors">
            <div className="w-12 h-12 bg-[#d63736]/20 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#d63736]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">SOAPer</h3>
            <p className="text-gray-400 mb-4">
              Generate Scripture, Observation, Application, and Prayer (SOAP) analysis for any Bible passage to enhance
              your personal study.
            </p>
            <Link href="/ai/soaper" className="text-[#d63736] hover:underline inline-flex items-center">
              Study Scripture
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto py-16 px-4 rounded-xl">
        <div className="bg-gradient-to-r from-[#d63736]/20 to-[#1a1a1a] p-8 md:p-12 rounded-2xl text-center ">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Share with Our Worship Community?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
        Upload new hymn lyrics, add Bible versions, and help our community grow by sharing your work.
          </p>
          <Button className="bg-[#d63736] hover:bg-[#c52c2c] text-white px-8 py-6 text-lg">Share Now</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#151515] py-12 rounded-3xl">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/icon.png"
                  alt="Geetika Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-xl font-bold">Geethiකා </span>
              </div>
              <p className="text-gray-400">
                Worship resources for multilingual churches. Access hymns, Bible verses, and translation tools.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Features</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/lyrics" className="text-gray-400 hover:text-[#d63736]">
                    Lyrics Search
                  </Link>
                </li>
                <li>
                  <Link href="/bible" className="text-gray-400 hover:text-[#d63736]">
                    Bible Viewer
                  </Link>
                </li>
                <li>
                  <Link href="/hymns" className="text-gray-400 hover:text-[#d63736]">
                    Hymns Library
                  </Link>
                </li>
                <li>
                  <Link href="/translate" className="text-gray-400 hover:text-[#d63736]">
                    Font Convertor
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-gray-400 hover:text-[#d63736]">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/tutorials" className="text-gray-400 hover:text-[#d63736]">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-[#d63736]">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-[#d63736]">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Subscribe</h3>
              <p className="text-gray-400 mb-4">Stay updated with new features and resources</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-[#252525] text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#d63736] w-full"
                />
                <Button className="bg-[#d63736] hover:bg-[#c52c2c] text-white rounded-l-none">Subscribe</Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} Geethika. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-[#d63736]">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-[#d63736]">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
      </main>

  );
}