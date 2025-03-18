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
      name: "Kithunu Gee Potha",
      description: "A comprehensive lyrics software specifically designed for Tamil and Sinhala Christian songs.",
      features: [
        "Extensive library of Tamil and Sinhala hymns",
        "Easy search functionality by title, lyrics, or theme",
        "Export options for various presentation software",
        "Offline access to all lyrics",
        "Regular updates with new songs",
      ],
      image: "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=200&width=200",
      tag: "Free",
      tagColor: "bg-green-500",
    },
    {
      name: "EasyWorship",
      description: "Professional church presentation software used by thousands of churches worldwide.",
      features: [
        "Seamless integration with live video feeds",
        "Built-in Bible module with multiple translations",
        "Advanced song scheduling and service planning",
        "Custom theme and template creation",
        "Dual-screen output for operator and audience views",
      ],
      image: "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=200&width=200",
      tag: "Paid",
      tagColor: "bg-blue-500",
    },
    {
      name: "PraiseCast",
      description: "A free presentation software designed specifically for churches and worship settings.",
      features: [
        "Simple, intuitive interface for quick setup",
        "Support for multiple media types including videos and images",
        "Built-in song database with common worship songs",
        "Scripture display with various translations",
        "Cloud storage for accessing your presentations anywhere",
      ],
      image: "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=200&width=200",
      tag: "Free",
      tagColor: "bg-green-500",
    },
    {
      name: "Presenter",
      description: "Professional presentation software by Worship Tools designed for church environments.",
      features: [
        "Advanced slide transitions and animations",
        "Comprehensive media library management",
        "Remote control via mobile devices",
        "Automatic song verse detection",
        "Integrated chord and lyric display for worship teams",
      ],
      image: "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=200&width=200",
      tag: "Freemium",
      tagColor: "bg-purple-500",
    },
    {
      name: "WorshipConnect",
      description: "Complete worship team management application for scheduling, communication, and resource sharing.",
      features: [
        "Team scheduling with availability tracking",
        "Song arrangement sharing with chord charts",
        "In-app messaging for team communication",
        "Practice tracks and recording sharing",
        "Service planning with collaborative editing",
      ],
      image: "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=200&width=200",
      tag: "Freemium",
      tagColor: "bg-purple-500",
    },
    {
      name: "Hearing Grace",
      description: "Christian podcast featuring discussions on theology, worship, and church ministry.",
      features: [
        "Weekly episodes with expert guests",
        "Downloadable resources mentioned in episodes",
        "Discussion guides for small groups",
        "Searchable archive of past episodes by topic",
        "Exclusive bonus content for subscribers",
      ],
      image: "https://kzmgd59nunxtkvvci6gz.lite.vusercontent.net/placeholder.svg?height=200&width=200",
      tag: "Free",
      tagColor: "bg-green-500",
    },
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