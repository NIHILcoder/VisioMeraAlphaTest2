"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Heart,
  MessageCircle,
  Tag,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Award,
  Share2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

// Mock data - Replace with actual API calls
const artworks = [
  {
    id: 1,
    title: "Neon City",
    author: "CyberArtist",
    likes: 120,
    comments: 15,
    tags: ["cyberpunk", "city"],
    imageUrl: "/artworks/neon-city.jpg",
    createdAt: "2025-02-24T10:00:00Z",
    isLiked: false
  },
  // ... more artworks
]

const tournaments = [
  {
    id: 1,
    title: "Digital Art Championship 2025",
    startDate: "2025-03-15T00:00:00Z",
    prize: "$1,000",
    participants: 128,
    category: "Digital Painting",
    registrationOpen: true
  },
  // ... more tournaments
]

const collabs = [
  {
    id: 1,
    title: "Community Movie Poster",
    initiator: "ArtistCollective",
    requiredSkills: ["Illustration", "Typography"],
    participants: 5,
    maxParticipants: 8,
    status: "In Progress",
    deadline: "2025-03-30T00:00:00Z"
  },
  // ... more collabs
]

export default function Community() {
  const [activeTab, setActiveTab] = useState("feed")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [filteredArtworks, setFilteredArtworks] = useState(artworks)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Filter and sort artwork based on search query and filters
  useEffect(() => {
    let filtered = [...artworks]

    if (searchQuery) {
      filtered = filtered.filter(art =>
          art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(art =>
          art.tags.some(tag => selectedTags.includes(tag))
      )
    }

    switch (sortBy) {
      case "trending":
        filtered.sort((a, b) => b.likes - a.likes)
        break
      case "recent":
        filtered.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
      default:
        break
    }

    setFilteredArtworks(filtered)
  }, [searchQuery, sortBy, selectedTags])

  const handleLike = (artworkId: number) => {
    setFilteredArtworks(prev =>
        prev.map(art =>
            art.id === artworkId
                ? { ...art, likes: art.isLiked ? art.likes - 1 : art.likes + 1, isLiked: !art.isLiked }
                : art
        )
    )
  }

  return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto space-y-8 px-4 py-8"
      >
        <motion.h1
            className="text-6xl font-bold text-center bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
        >
          Community Hub
        </motion.h1>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
                type="text"
                placeholder="Search artworks, artists, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedTags([])}>
                  All Tags
                </DropdownMenuItem>
                {["cyberpunk", "nature", "fantasy", "scifi"].map(tag => (
                    <DropdownMenuItem
                        key={tag}
                        onClick={() => setSelectedTags(prev =>
                            prev.includes(tag)
                                ? prev.filter(t => t !== tag)
                                : [...prev, tag]
                        )}
                    >
                      <Tag className="w-4 h-4 mr-2" />
                      {tag}
                    </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {sortBy === "trending" ? <TrendingUp className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  {sortBy === "trending" ? "Trending" : "Recent"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("recent")}>
                  <Clock className="w-4 h-4 mr-2" /> Recent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("trending")}>
                  <TrendingUp className="w-4 h-4 mr-2" /> Trending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 gap-2">
            {["feed", "tournaments", "collabs"].map((tab) => (
                <TabsTrigger
                    key={tab}
                    value={tab}
                    className={`rounded-lg p-3 transition-all ${
                        activeTab === tab
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                            : "hover:bg-gray-100 text-gray-600"
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="feed" className="mt-6">
            <AnimatePresence>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArtworks.map((artwork) => (
                    <motion.div
                        key={artwork.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                    >
                      <Card>
                        <CardHeader className="p-0">
                          <img
                              src={artwork.imageUrl}
                              alt={artwork.title}
                              className="w-full h-48 object-cover"
                          />
                        </CardHeader>
                        <CardContent className="p-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {artwork.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-4">by {artwork.author}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {artwork.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700"
                                >
                            #{tag}
                          </span>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 bg-gray-50 flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLike(artwork.id)}
                                className={`transition-colors ${
                                    artwork.isLiked ? "text-red-500" : "text-gray-500"
                                }`}
                            >
                              <Heart className={`w-5 h-5 mr-2 ${
                                  artwork.isLiked ? "fill-current" : ""
                              }`} />
                              {artwork.likes}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500"
                            >
                              <MessageCircle className="w-5 h-5 mr-2" />
                              {artwork.comments}
                            </Button>
                          </div>
                          <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500"
                          >
                            <Share2 className="w-5 h-5" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="tournaments" className="mt-6">
            <div className="grid gap-6">
              {tournaments.map(tournament => (
                  <motion.div
                      key={tournament.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{tournament.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Starts {new Date(tournament.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Award className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="bg-purple-100 px-3 py-1 rounded-full text-purple-700">
                        {tournament.category}
                      </div>
                      <div className="text-green-600 font-semibold">{tournament.prize}</div>
                      <div className="text-gray-500">{tournament.participants} participants</div>
                    </div>
                    <Button
                        className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        disabled={!tournament.registrationOpen}
                    >
                      {tournament.registrationOpen ? "Register Now" : "Registration Closed"}
                    </Button>
                  </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="collabs" className="mt-6">
            <div className="grid gap-6">
              {collabs.map(collab => (
                  <motion.div
                      key={collab.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{collab.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">Initiated by {collab.initiator}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                          collab.status === "In Progress"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {collab.status}
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-700">Required Skills:</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {collab.requiredSkills.map(skill => (
                            <span
                                key={skill}
                                className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                            >
                        {skill}
                      </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {collab.participants}/{collab.maxParticipants} participants
                      </div>
                      <div className="text-sm text-gray-500">
                        Deadline: {new Date(collab.deadline).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                        className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        disabled={collab.participants >= collab.maxParticipants}
                    >
                      {collab.participants >= collab.maxParticipants ? "Team Full" : "Join Project"}
                    </Button>
                  </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
  )
}