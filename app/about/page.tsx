'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, Github, Code, BookOpen } from "lucide-react"

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main>
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Geethika</h1>
            <div className="h-1 w-20 bg-[#d63736] mx-auto"></div>
          </div>

          {/* Mission Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Heart className="text-[#d63736] mr-2" /> Our Mission
            </h2>
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
              <p className="text-gray-300 mb-4">
                Geethika was created to serve the worship needs of multilingual church communities. Our goal is to
                provide easy access to hymns, Bible verses, and translation tools to enhance worship experiences across
                language barriers.
              </p>
              <p className="text-gray-300">
                This application is developed <span className="text-[#d63736] font-semibold">for the glory of God</span>{" "}
                and to serve His church community. We believe in making worship resources accessible to all, regardless
                of language or technical limitations.
              </p>
            </div>
          </section>

          {/* Disclaimer Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <BookOpen className="text-[#d63736] mr-2" /> Content Disclaimer
            </h2>
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
              <p className="text-gray-300 mb-4">
                <strong>Important:</strong> Geethika does not claim ownership of any songs, hymns, Bible translations, or
                other content provided through this application. All content belongs to their respective copyright
                holders.
              </p>
              <p className="text-gray-300 mb-4">
                The hymns, lyrics, and Bible translations are provided for worship and personal use only. We respect
                copyright laws and have made every effort to ensure proper attribution where possible.
              </p>
              <p className="text-gray-300">
                If you are a copyright holder and believe your content has been used inappropriately, please contact us
                immediately, and we will address your concerns.
              </p>
            </div>
          </section>

          {/* Content Sources Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Code className="text-[#d63736] mr-2" /> Content & Technology Sources
            </h2>
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
              <p className="text-gray-300 mb-4">
                Geethika aggregates content and technologies from various sources available on the internet. We do not
                claim to have created these resources ourselves.
              </p>
              <p className="text-gray-300 mb-4">The resources we've utilized include:</p>
              <ul className="list-disc pl-6 text-gray-300 mb-4">
                <li>Hymn lyrics collected from various online repositories and websites</li>
                <li>Bible translations from publicly available sources</li>
                <li>Translation technologies and font conversion tools sourced from open repositories</li>
                <li>Audio recordings of hymns from various online archives</li>
                <li>Unicode and legacy font conversion algorithms from public domain resources</li>
              </ul>
              <p className="text-gray-300">
                We are deeply grateful to all the individuals and organizations who have made these resources available
                for the benefit of the church community.
              </p>
            </div>
          </section>

          {/* Content Acknowledgments Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Github className="text-[#d63736] mr-2" /> Acknowledgments & Credits
            </h2>
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
              <p className="text-gray-300 mb-6">
                We would like to acknowledge the following sources and individuals who have made their content and
                technologies available, which has made Geethika possible:
              </p>

              <div className="grid gap-6">
                {/* Lyrics Sources */}
                <div className="border-b border-gray-700 pb-4">
                  <h3 className="font-bold text-xl mb-3">Lyrics Sources</h3>
                  <ul className="list-disc pl-6 text-gray-300">
                    <li>Tamil Christian Lyrics Archive (online repository)</li>
                    <li>Sinhala Hymnal Project (community collection)</li>
                    <li>Global Worship Database (international hymn collection)</li>
                    <li>Various church websites and worship resources</li>
                  </ul>
                </div>

                {/* Translation Technology */}
                <div className="border-b border-gray-700 pb-4">
                  <h3 className="font-bold text-xl mb-3">Translation & Font Technologies</h3>
                  <ul className="list-disc pl-6 text-gray-300">
                    <li>Tamil Unicode Consortium (font conversion tools)</li>
                    <li>Sinhala Text Processing Project (character mapping)</li>
                    <li>Open Font Library (legacy font mappings)</li>
                    <li>International Language Support Initiative (conversion algorithms)</li>
                  </ul>
                </div>

                {/* Bible Sources */}
                <div className="border-b border-gray-700 pb-4">
                  <h3 className="font-bold text-xl mb-3">Bible Translations</h3>
                  <ul className="list-disc pl-6 text-gray-300">
                    <li>Tamil Bible Society (Tamil translations)</li>
                    <li>Sinhala Bible Translation Committee</li>
                    <li>Open Bible Initiative (multiple translations)</li>
                    <li>Digital Scripture Project (XML formats)</li>
                  </ul>
                </div>

                {/* Music Sources */}
                <div>
                  <h3 className="font-bold text-xl mb-3">Music Resources</h3>
                  <ul className="list-disc pl-6 text-gray-300">
                    <li>Christian Music Archive (hymn recordings)</li>
                    <li>Traditional Worship Collection (audio files)</li>
                    <li>Community Church Recordings (worship tracks)</li>
                    <li>Public Domain Hymn Project (historical recordings)</li>
                  </ul>
                </div>
              </div>

              <p className="text-gray-300 mt-6">
                Note: The names above represent the types of sources we've utilized. We've made every effort to ensure
                proper attribution and respect for copyright where applicable.
              </p>
            </div>
          </section>

          {/* For the Glory of God Section */}
          <section className="text-center py-8 border-t border-gray-800">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-[#d63736]">For the Glory of God</h2>
              <p className="text-gray-300 italic">
                "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters."
              </p>
              <p className="text-gray-400 mt-2">- Colossians 3:23</p>
            </div>
          </section>
        </div>
      </main>
  );
}