"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, Video, MessageSquare } from "lucide-react"

const articles = [
  { id: 1, title: "How to Write Effective Prompts", category: "Guides" },
  { id: 2, title: "Optimizing Steps and CFG for Better Results", category: "Guides" },
  { id: 3, title: "Understanding Different AI Models", category: "Guides" },
  // Add more articles here
]

const videos = [
  { id: 1, title: "Getting Started with VisioMera", duration: "10:23" },
  { id: 2, title: "Advanced Techniques for AI Art Generation", duration: "15:45" },
  { id: 3, title: "Mastering Style Transfer in AI Art", duration: "12:30" },
  // Add more videos here
]

export default function Learn() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <h1 className="text-4xl font-bold text-center">Learn</h1>
      <Tabs defaultValue="guides" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
          <TabsTrigger value="forum">Forum</TabsTrigger>
        </TabsList>
        <TabsContent value="guides" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article.id}>
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{article.category}</p>
                  <Button>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read Article
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video.id}>
                <CardHeader>
                  <CardTitle>{video.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Duration: {video.duration}</p>
                  <Button>
                    <Video className="w-4 h-4 mr-2" />
                    Watch Video
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="forum" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Forum</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Join our community forum to ask questions, share your work, and connect with other AI artists.
              </p>
              <Button>
                <MessageSquare className="w-4 h-4 mr-2" />
                Go to Forum
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

