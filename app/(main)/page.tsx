'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Upload, Camera, Users, Shield } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality here
    console.log("Searching for:", searchQuery)
  }

  return (
    <>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-purple-900 via-black to-blue-900">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Picturesque
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Your personal gallery for storing, organizing, and sharing your favorite images.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2" onSubmit={handleSearch}>
                  <Input
                    className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    placeholder="Search your gallery..."
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" className="bg-purple-600 text-white hover:bg-purple-700">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className=" px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Camera className="h-12 w-12 mb-4 text-purple-400" />
                  <h3 className="text-xl font-semibold mb-2">Unlimited Storage</h3>
                  <p className="text-gray-400">Store all your images without worrying about space limitations.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Users className="h-12 w-12 mb-4 text-purple-400" />
                  <h3 className="text-xl font-semibold mb-2">Easy Sharing</h3>
                  <p className="text-gray-400">Share your images or entire folders with friends and family effortlessly.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Shield className="h-12 w-12 mb-4 text-purple-400" />
                  <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
                  <p className="text-gray-400">Your images are encrypted and stored securely on our servers.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-900 via-black to-purple-900">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Start Organizing Your Images Today</h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who trust Picturesque for their image storage needs. Sign up now and get 5GB free storage!
                </p>
              </div>
              <Button className="bg-white text-black hover:bg-gray-200" size="lg">
                <Upload className="mr-2 h-4 w-4" /> Sign Up Now
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} Picturesque. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-500 hover:text-gray-300" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-500 hover:text-gray-300" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </>
  )
}