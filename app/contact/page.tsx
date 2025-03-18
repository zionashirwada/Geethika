'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Send, MessageSquare, Music, BookOpen, Languages } from "lucide-react"

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTopicChange = (value) => {
    setFormState((prev) => ({
      ...prev,
      topic: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormState({
        name: "",
        email: "",
        topic: "",
        message: "",
      })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1500)
  }
  return (
    <main >
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions, suggestions, or want to contribute? We'd love to hear from you.
            </p>
            <div className="h-1 w-20 bg-[#d63736] mx-auto mt-6"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="md:col-span-2">
              <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <MessageSquare className="mr-2 text-[#d63736]" /> Send Us a Message
                </h2>

                {isSubmitted ? (
                  <div className="bg-green-900/20 border border-green-900 rounded-xl p-4 text-center">
                    <h3 className="text-xl font-bold text-green-400 mb-2">Message Sent!</h3>
                    <p className="text-gray-300">
                      Thank you for contacting us. We'll get back to you as soon as possible.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Your Name <span className="text-[#d63736]">*</span>
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="bg-[#252525] border-gray-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address <span className="text-[#d63736]">*</span>
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          required
                          className="bg-[#252525] border-gray-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="topic" className="text-sm font-medium">
                        Topic <span className="text-[#d63736]">*</span>
                      </label>
                      <Select value={formState.topic} onValueChange={handleTopicChange} required>
                        <SelectTrigger className="bg-[#252525] border-gray-700">
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="lyrics">Lyrics Contribution</SelectItem>
                          <SelectItem value="artist">Artist Feature Request</SelectItem>
                          <SelectItem value="playlist">Playlist Submission</SelectItem>
                          <SelectItem value="bug">Report an Issue</SelectItem>
                          <SelectItem value="suggestion">Feature Suggestion</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message <span className="text-[#d63736]">*</span>
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="Your message here..."
                        required
                        className="min-h-[150px] bg-[#252525] border-gray-700"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#d63736] hover:bg-[#c52c2c] text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Send className="mr-2 h-4 w-4" /> Send Message
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div>

              {/* !!!!! COMMENTED LETS MAKE PUBLIC LATER */}
              {/* <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 md:p-8 mb-8">
                <h2 className="text-xl font-bold mb-6">Contact Information</h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-[#d63736] mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Email Us</h3>
                      <p className="text-gray-400">contact@geetika.org</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-[#d63736] mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Call Us</h3>
                      <p className="text-gray-400">+1 (123) 456-7890</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-[#d63736] mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Location</h3>
                      <p className="text-gray-400">
                        123 Worship Street
                        <br />
                        Colombo, Sri Lanka
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800">
                  <h3 className="font-medium mb-3">Connect With Us</h3>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center hover:bg-[#d63736] transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center hover:bg-[#d63736] transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center hover:bg-[#d63736] transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center hover:bg-[#d63736] transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                      </svg>
                    </a>
                  </div>
                </div>
              </div> */}

              {/* Contact Reasons */}
              <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 md:p-8">
                <h2 className="text-xl font-bold mb-4">How We Can Help</h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <Music className="h-5 w-5 text-[#d63736] mt-1 mr-3 shrink-0" />
                    <div>
                      <h3 className="font-medium">Hymns & Music</h3>
                      <p className="text-sm text-gray-400">Submit your music or request to be featured as an artist.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 text-[#d63736] mt-1 mr-3 shrink-0" />
                    <div>
                      <h3 className="font-medium">Lyrics & Bible</h3>
                      <p className="text-sm text-gray-400">
                        Contribute lyrics or report any issues with Bible translations.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Languages className="h-5 w-5 text-[#d63736] mt-1 mr-3 shrink-0" />
                    <div>
                      <h3 className="font-medium">Translation Help</h3>
                      <p className="text-sm text-gray-400">
                        Get assistance with font conversion or report translation issues.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
                <h3 className="font-bold text-lg mb-2">How can I contribute lyrics?</h3>
                <p className="text-gray-300">
                  You can submit lyrics by contacting us through the form above. Select "Lyrics Contribution" as the
                  topic and include the song details and lyrics in your message.
                </p>
              </div>

              <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
                <h3 className="font-bold text-lg mb-2">How do I get my music featured?</h3>
                <p className="text-gray-300">
                  Artists can request to be featured by selecting "Artist Feature Request" in the contact form. Please
                  include links to your music and any relevant information.
                </p>
              </div>

              <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
                <h3 className="font-bold text-lg mb-2">Is there a mobile app available?</h3>
                <p className="text-gray-300">
                  We're currently working on mobile apps for both Android and iOS. Sign up for our newsletter to be
                  notified when they're released.
                </p>
              </div>

              <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
                <h3 className="font-bold text-lg mb-2">How can I report an issue?</h3>
                <p className="text-gray-300">
                  If you encounter any problems with the website or any of our tools, please select "Report an Issue" in
                  the contact form and provide details about the problem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}