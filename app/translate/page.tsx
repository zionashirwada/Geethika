'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeftRight, Type } from "lucide-react"

export default function TranslatePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const conversionTools = [
    {
      id: "unicode-to-fm",
      title: "Unicode to FM",
      description: "Convert Tamil Unicode text to FM font format for legacy applications.",
      from: "Unicode",
      to: "FM",
      icon: <Type className="h-10 w-10 text-[#d63736]" />,
      popular: true,
    },
    {
      id: "fm-to-unicode",
      title: "FM to Unicode",
      description: "Convert Tamil text in FM font to Unicode standard for modern digital platforms.",
      from: "FM",
      to: "Unicode",
      icon: <Type className="h-10 w-10 text-[#d63736]" />,
    },
    {
      id: "bamini-to-unicode",
      title: "Bamini to Unicode",
      description: "Convert Tamil text in Bamini font to Unicode standard for better compatibility.",
      from: "Bamini",
      to: "Unicode",
      icon: <Type className="h-10 w-10 text-[#d63736]" />,
      popular: true,
    },
    {
      id: "unicode-to-bamini",
      title: "Unicode to Bamini",
      description: "Convert Tamil Unicode text to Bamini font for legacy systems and software.",
      from: "Unicode",
      to: "Bamini",
      icon: <Type className="h-10 w-10 text-[#d63736]" />,
    },
    {
      id: "kaputa-to-unicode",
      title: "Kaputa2004 to Unicode",
      description: "Convert Sinhala text in Kaputa2004 font to Unicode standard.",
      from: "Kaputa2004",
      to: "Unicode",
      icon: <Type className="h-10 w-10 text-[#d63736]" />,
    },
    {
      id: "singlish-to-unicode",
      title: "Singlish to Unicode",
      description: "Convert romanized Sinhala (Singlish) text to proper Sinhala Unicode.",
      from: "Singlish",
      to: "Unicode",
      icon: <Type className="h-10 w-10 text-[#d63736]" />,
      popular: true,
    },
    {
      id: "tanglish-to-unicode",
      title: "Tanglish to Unicode",
      description: "Convert romanized Tamil (Tanglish) text to proper Tamil Unicode.",
      from: "Tanglish",
      to: "Unicode",
      icon: <Type className="h-10 w-10 text-[#d63736]" />,
      popular: true,
    },
  ]

  return (
    <div className="flex min-h-screen p-4 lg:px-14 relative">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar isOpen={true} />
      </div>
      
      {/* Mobile Sidebar and Overlay */}
      {isMenuOpen && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="md:hidden fixed z-50">
            <Sidebar isOpen={true} onClose={() => setIsMenuOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="main-content flex-1 ml-0 md:ml-[280px]">
      <div className="min-h-screen bg-[#0d0d0d] text-white">
  

      {/* Main Content */}
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Font Conversion Tools</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Convert text between different Tamil and Sinhala font formats for easy use in worship presentations,
              documents, and digital platforms.
            </p>
            <div className="h-1 w-20 bg-[#d63736] mx-auto mt-6"></div>
          </div>

          {/* Conversion Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conversionTools.map((tool) => (
              <Link href={`/translate/${tool.id}`} key={tool.id} className="group">
                <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden h-full hover:border-[#d63736] transition-colors group-hover:shadow-lg group-hover:shadow-[#d63736]/10">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      {tool.icon}
                      {tool.popular && (
                        <span className="bg-[#d63736]/20 text-[#d63736] text-xs font-bold py-1 px-2 rounded">
                          Popular
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold mb-2 group-hover:text-[#d63736] transition-colors">
                      {tool.title}
                    </h2>
                    <p className="text-gray-300 mb-6">{tool.description}</p>

                    <div className="flex items-center justify-between bg-[#252525] p-3 rounded-xl">
                      <div className="text-center px-3 py-2 bg-[#333] rounded font-medium">{tool.from}</div>
                      <ArrowRight className="text-[#d63736]" />
                      <div className="text-center px-3 py-2 bg-[#333] rounded font-medium">{tool.to}</div>
                    </div>
                  </div>
                  <div className="bg-[#252525] p-4 flex justify-center ">
                    <span className="text-[#d63736] font-medium flex items-center">
                      Convert Now <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-16 bg-[#1a1a1a] p-8 rounded-xl border border-gray-800">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="md:w-1/3 flex justify-center">
                <div className="w-20 h-20 bg-[#d63736]/20 rounded-full flex items-center justify-center">
                  <ArrowLeftRight className="h-10 w-10 text-[#d63736]" />
                </div>
              </div>
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-4">Why Use Font Conversion?</h2>
                <p className="text-gray-300 mb-4">
                  Many church presentation software and legacy systems still use older font formats. Our conversion
                  tools help bridge the gap between modern Unicode standards and these legacy fonts.
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-[#d63736] mr-2">•</span>
                    <span>Easily prepare content for EasyWorship, PowerPoint, and other presentation software</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d63736] mr-2">•</span>
                    <span>Convert between romanized text (Tanglish/Singlish) and proper script</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d63736] mr-2">•</span>
                    <span>Preserve formatting and special characters during conversion</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d63736] mr-2">•</span>
                    <span>Work with both Tamil and Sinhala scripts seamlessly</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

    
    </div>
      </main>

      {/* Hamburger Button for Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#d63736] hover:bg-[#e64736] p-2 rounded-xl text-white shadow-lg"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Open menu"
        title="Open menu"
      >
        <Menu size={24} />
      </button>
    </div>
  );
}