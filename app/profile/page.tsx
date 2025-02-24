"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Settings, Star } from "lucide-react"

export default function Profile() {
  const [activeTab, setActiveTab] = useState("my-works")

  // Mock user data
  const user = {
    name: "John Doe",
    username: "johndoe",
    avatar: "/placeholder.svg?height=100&width=100&text=JD",
    level: 5,
    points: 1250,
  }

  // Mock generated images
  const generatedImages = [
    { id: 1, title: "Cyberpunk City", date: "2023-05-15" },
    { id: 2, title: "Enchanted Forest", date: "2023-05-10" },
    { id: 3, title: "Futuristic Spaceship", date: "2023-05-05" },
    // Add more images here
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex items-center space-x-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="secondary">Level {user.level}</Badge>
            <Badge variant="outline">{user.points} points</Badge>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-works">My Works</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="history">Generation History</TabsTrigger>
        </TabsList>
        <TabsContent value="my-works" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedImages.map((image) => (
              <Card key={image.id}>
                <CardContent className="p-4">
                  <img
                    src={`/placeholder.svg?height=200&width=300&text=${image.title}`}
                    alt={image.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-lg font-semibold mb-2">{image.title}</h3>
                  <p className="text-sm text-muted-foreground">{image.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="favorites" className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Favorite Works</h2>
          {/* Add favorite works content here */}
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Generation History</h2>
          {/* Add generation history content here */}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <div className="space-y-2">
              <Label>Subscription</Label>
              <p className="text-sm text-muted-foreground">You are currently on the Free plan.</p>
              <Button>
                <Star className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            </div>
            <div className="space-y-2">
              <Label>API Keys</Label>
              <p className="text-sm text-muted-foreground">Manage your API keys for integration.</p>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Manage API Keys
              </Button>
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

