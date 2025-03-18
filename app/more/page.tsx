'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export default function MorePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tools = [
      {
        "name": "Kithunu Gee Potha",
        "description": "A Sinhala Christian hymn lyrics application available on Android, Windows, and online, providing a vast collection of hymns with search and sharing features.",
        "features": [
          "Database of over 770 Sinhala and 400 English hymns",
          "Zoom in/out to adjust text size",
          "Audio for select hymns",
          "Favorite list and sharing options",
          "Offline access (except for audio hymns)"
        ],
        "image": "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=200&width=200",
        "tag": "Free",
        "tagColor": "bg-green-500"
      },
      {
        "name": "EasyWorship",
        "description": "A powerful church presentation software designed for worship services, integrating lyrics, scriptures, videos, and live streaming.",
        "features": [
          "Display song lyrics, videos, and slides",
          "Integrate lyrics, scriptures, and videos with service schedules",
          "Create or import shadow slides using the Presentation Editor or PowerPoint",
          "NDI integration for live streaming",
          "CCLI and MIDI integration for song management"
        ],
        "image": "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=200&width=200",
        "tag": "Paid",
        "tagColor": "bg-blue-500"
      },
      {
        "name": "Freeshow",
        "description": "A free and open-source church presentation software supported by donations, offering powerful customization and multi-output support.",
        "features": [
          "Powerful editing with unlimited customization",
          "Auto-play and countdown timers for scheduled playback",
          "Multi-output support (online, auditorium, stage)",
          "Bible and song integration",
          "Compatibility with PowerPoint, ProPresenter, and other software"
        ],
        "image": "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=200&width=200",
        "tag": "Free",
        "tagColor": "bg-green-500"
      },
      {
        "name": "Presenter by Worship Tools",
        "description": "A cloud-based church presentation software that allows remote access, multi-output support, and motion graphics for worship services.",
        "features": [
          "Cloud connectivity for access from anywhere",
          "Support for multiple outputs",
          "Motion graphics for creative designs",
          "Integration with CCLI and SongSelect",
          "Remote control and stage display options"
        ],
        "image": "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=200&width=200",
        "tag": "Freemium",
        "tagColor": "bg-purple-500"
      },
      {
        "name": "The Holy Bible (Sinhala ROV 1995)",
        "description": "The Sinhala Revised Old Version (ROV) of the Bible, available online and as an app, offering a free resource for Sinhala-speaking Christians.",
        "features": [
          "Available in Sinhala language",
          "Text search functionality",
          "Bookmark favorite verses",
          "Share via email or social media",
          "Customizable font styles and themes"
        ],
        "image": "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=200&width=200",
        "tag": "Free",
        "tagColor": "bg-green-500"
      },
      {
        "name": "Kithu Bathi Gee Dahana",
        "description": "A Sinhala Christian hymn app featuring hymns with guitar and organ chords, available for free on Android and iOS.",
        "features": [
          "Database of Sinhala Christian hymns with chords",
          "Search functionality for hymns",
          "View guitar and organ chords",
          "Sharing options",
          "Offline access (assumed)"
        ],
        "image": "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=200&width=200",
        "tag": "Free",
        "tagColor": "bg-green-500"
      },
    
    // {
    //   name: "WorshipConnect",
    //   description: "Complete worship team management application for scheduling, communication, and resource sharing.",
    //   features: [
    //     "Team scheduling with availability tracking",
    //     "Song arrangement sharing with chord charts",
    //     "In-app messaging for team communication",
    //     "Practice tracks and recording sharing",
    //     "Service planning with collaborative editing",
    //   ],
    //   image: "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=200&width=200",
    //   tag: "Freemium",
    //   tagColor: "bg-purple-500",
    // },
    // {
    //   name: "Hearing Grace",
    //   description: "Christian podcast featuring discussions on theology, worship, and church ministry.",
    //   features: [
    //     "Weekly episodes with expert guests",
    //     "Downloadable resources mentioned in episodes",
    //     "Discussion guides for small groups",
    //     "Searchable archive of past episodes by topic",
    //     "Exclusive bonus content for subscribers",
    //   ],
    //   image: "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=200&width=200",
    //   tag: "Free",
    //   tagColor: "bg-green-500",
    // },
  ]
  return (
    <main >
    <div className="max-w-6xl mx-auto">
      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">More Worship Tools</h1>
        <p className="text-xl text-gray-300">
          Discover other helpful resources for your church and worship ministry
        </p>
        <div className="h-1 w-20 bg-[#d63736] mx-auto mt-6"></div>
      </div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool, index) => (
          <div
            key={index}
            className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden hover:border-[#d63736] transition-colors"
          >
            <div className="relative h-48 bg-[#252525]">
              <Image src={tool.image || "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg"} alt={tool.name} fill className="object-contain p-4" />
              <div
                className={`absolute top-4 right-4 ${tool.tagColor} text-white text-sm font-bold py-1 px-3 rounded-full`}
              >
                {tool.tag}
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{tool.name}</h2>
              <p className="text-gray-300 mb-4">{tool.description}</p>

              <h3 className="text-lg font-semibold mb-3 text-[#d63736]">Key Features:</h3>
              <ul className="space-y-2 mb-6">
                {tool.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-[#d63736] mr-2">•</span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border border-gray-700">
                Learn More <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Resources Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Looking for More?</h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          We're constantly updating our list of recommended tools and resources for church ministry. Check back
          regularly or contact us if you have suggestions.
        </p>
        <Link href="/contact">
          <Button className="bg-[#d63736] hover:bg-[#c52c2c] text-white">Suggest a Tool</Button>
        </Link>
      </div>
    </div>
  </main>
  );
}