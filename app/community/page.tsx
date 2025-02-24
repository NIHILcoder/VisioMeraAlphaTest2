"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Tag } from "lucide-react"

const artworks = [
  { id: 1, title: "Neon City", author: "CyberArtist", likes: 120, comments: 15, tags: ["cyberpunk", "city"] },
  { id: 2, title: "Forest Spirit", author: "NatureLover", likes: 85, comments: 7, tags: ["fantasy", "nature"] },
  { id: 3, title: "Space Odyssey", author: "StarGazer", likes: 200, comments: 25, tags: ["space", "scifi"] },
  // Add more artworks here
]

export default function Community() {
  const [activeTab, setActiveTab] = useState("feed")

  return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto space-y-8 px-4"
      >
        <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Community
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 gap-2">
            <TabsTrigger
                value="feed"
                className={`rounded-lg p-3 transition-colors ${
                    activeTab === "feed"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "hover:bg-gray-100 text-gray-600"
                }`}
            >
              Feed
            </TabsTrigger>
            <TabsTrigger
                value="tournaments"
                className={`rounded-lg p-3 transition-colors ${
                    activeTab === "tournaments"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "hover:bg-gray-100 text-gray-600"
                }`}
            >
              Tournaments
            </TabsTrigger>
            <TabsTrigger
                value="collabs"
                className={`rounded-lg p-3 transition-colors ${
                    activeTab === "collabs"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "hover:bg-gray-100 text-gray-600"
                }`}
            >
              Collabs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks.map((artwork) => (
                  <motion.div
                      key={artwork.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-lg"
                  >
                    <Card>
                      <CardContent className="p-4">
                        <img
                            src={`/placeholder.svg?height=200&width=300&text=${artwork.title}`}
                            alt={artwork.title}
                            className="w-full h-48 object-cover rounded-md mb-4 border border-gray-200"
                        />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {artwork.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">by {artwork.author}</p>
                        <div className="flex justify-between items-center space-y-2">
                          <div className="flex space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Heart className="w-5 h-5 mr-2 text-red-500" />
                              {artwork.likes}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
                              {artwork.comments}
                            </Button>
                          </div>
                          <div className="flex space-x-2">
                            {artwork.tags.map((tag) => (
                                <Button
                                    key={tag}
                                    variant="outline"
                                    size="sm"
                                    className="text-sm bg-white text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <Tag className="w-4 h-4 mr-1 text-purple-500" />
                                  {tag}
                                </Button>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tournaments" className="mt-6">
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Tournaments</h2>
              {/* Add tournament content here */}
            </div>
          </TabsContent>

          <TabsContent value="collabs" className="mt-6">
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Collaborative Projects</h2>
              {/* Add collaboration content here */}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
  )
}