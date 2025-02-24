"use client"

import React from "react"
import { useState, useEffect, useReducer, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Loader2, History, Sparkles, Info, AlertCircle, Undo, Redo, X, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

// Типы и интерфейсы
interface Generation {
  id: number
  prompt: string
  resolution: string
  model: string
  style: string
  cfgScale: number
  steps: number
  seed: string
  sampler: string
  timestamp: string
  preview?: string
}

interface Preset {
  name: string
  model: string
  resolution: string
  style: string
  cfgScale: number
  steps: number
}

interface AppState {
  current: Generation
  history: Generation[]
  currentIndex: number
}

// Пресеты
const PRESETS: Preset[] = [
  {
    name: "High Quality",
    model: "Juggernaut",
    resolution: "1024x1024",
    style: "realism",
    cfgScale: 7,
    steps: 50
  },
  {
    name: "Fast Generation",
    model: "Flux1.Dev",
    resolution: "512x512",
    style: "anime",
    cfgScale: 5,
    steps: 20
  },
  {
    name: "Creative",
    model: "SdXL",
    resolution: "768x768",
    style: "fantasy",
    cfgScale: 9,
    steps: 40
  }
]

// Быстрые подсказки
const PROMPT_SUGGESTIONS = [
  "A cyberpunk cityscape at night with neon lights",
  "Medieval castle in a magical forest",
  "Astronaut floating in space with colorful nebula",
  "Steampunk airship flying over mountains"
]

// Редуктор для undo/redo
function historyReducer(state: AppState, action: any): AppState {
  switch (action.type) {
    case 'UNDO':
      return {
        ...state,
        currentIndex: Math.max(0, state.currentIndex - 1),
        current: state.history[Math.max(0, state.currentIndex - 1)]
      }
    case 'REDO':
      return {
        ...state,
        currentIndex: Math.min(state.history.length - 1, state.currentIndex + 1),
        current: state.history[Math.min(state.history.length - 1, state.currentIndex + 1)]
      }
    case 'PUSH':
      const newHistory = [...state.history.slice(0, state.currentIndex + 1), action.payload]
      return {
        current: action.payload,
        history: newHistory,
        currentIndex: newHistory.length - 1
      }
    default:
      return state
  }
}

export default function Home() {
  // Основное состояние
  const [state, dispatch] = useReducer(historyReducer, {
    current: {
      id: 0,
      prompt: "",
      resolution: "512x512",
      model: "Flux1.Dev",
      style: "realism",
      cfgScale: 7,
      steps: 30,
      seed: "",
      sampler: "Euler a",
      timestamp: ""
    },
    history: [],
    currentIndex: -1
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [generationHistory, setGenerationHistory] = useState<Generation[]>([])

  // Загрузка сохраненных данных
  useEffect(() => {
    const savedParams = localStorage.getItem("aiArtParams")
    const savedHistory = localStorage.getItem("generationHistory")

    if (savedParams) {
      const params = JSON.parse(savedParams)
      dispatch({ type: 'PUSH', payload: params })
    }

    if (savedHistory) {
      setGenerationHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Сохранение параметров
  useEffect(() => {
    localStorage.setItem("aiArtParams", JSON.stringify(state.current))
    localStorage.setItem("generationHistory", JSON.stringify(generationHistory))
  }, [state.current, generationHistory])

  // Обработчик генерации
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (state.current.seed && !/^\d+$/.test(state.current.seed)) {
      setError("Seed must be a numeric value")
      return
    }

    setIsGenerating(true)
    setError("")

    // Симуляция генерации с превью
    const previewUrl = `https://picsum.photos/200?random=${Math.random()}`

    await new Promise(resolve => setTimeout(resolve, 3000))

    const newGeneration: Generation = {
      ...state.current,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      preview: previewUrl
    }

    dispatch({ type: 'PUSH', payload: newGeneration })
    setGenerationHistory(prev => [newGeneration, ...prev].slice(0, 20))
    setIsGenerating(false)
  }

  // Фильтрация истории
  const filteredHistory = generationHistory.filter(gen =>
      gen.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gen.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gen.resolution.includes(searchQuery)
  )

  // Применение пресета
  const applyPreset = (preset: Preset) => {
    const newState = {
      ...state.current,
      model: preset.model,
      resolution: preset.resolution,
      style: preset.style,
      cfgScale: preset.cfgScale,
      steps: preset.steps
    }
    dispatch({ type: 'PUSH', payload: newState })
  }

  // Визуальная сложность
  const getComplexity = useCallback(() => {
    const resolutionFactor = parseInt(state.current.resolution) / 512
    const stepsFactor = state.current.steps / 30
    return Math.round(resolutionFactor * stepsFactor * 100) / 100
  }, [state.current.resolution, state.current.steps])

  return (
      <TooltipProvider>
        <motion.div className="max-w-6xl mx-auto space-y-8 p-4">
          {/* Заголовок и быстрые подсказки */}
          <div className="space-y-4">
            <motion.h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Generate AI Art
            </motion.h1>

            <div className="flex flex-wrap gap-2 justify-center">
              {PROMPT_SUGGESTIONS.map((suggestion, i) => (
                  <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => dispatch({ type: 'PUSH', payload: { ...state.current, prompt: suggestion }})}
                  >
                    {suggestion}
                  </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Левая панель */}
            <div className="space-y-6">
              {/* Пресеты */}
              <Card className="bg-background/80">
                <CardContent className="p-4 grid grid-cols-3 gap-2">
                  {PRESETS.map((preset, i) => (
                      <Button
                          key={i}
                          variant="outline"
                          className="h-auto flex-col gap-1 py-2"
                          onClick={() => applyPreset(preset)}
                      >
                        <span className="font-semibold">{preset.name}</span>
                        <span className="text-xs text-muted-foreground">
                      {preset.resolution} | {preset.steps} steps
                    </span>
                      </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Форма генерации */}
              <Card className="bg-background/80">
                <CardContent className="p-6 space-y-6">
                  <form onSubmit={handleGenerate} className="space-y-6">
                    {/* Основные параметры */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Prompt</Label>
                        <Input
                            value={state.current.prompt}
                            onChange={e => dispatch({ type: 'PUSH', payload: { ...state.current, prompt: e.target.value }})}
                            required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Resolution</Label>
                          <Select
                              value={state.current.resolution}
                              onValueChange={v => dispatch({ type: 'PUSH', payload: { ...state.current, resolution: v }})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="512x512">512x512</SelectItem>
                              <SelectItem value="768x768">768x768</SelectItem>
                              <SelectItem value="1024x1024">1024x1024</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Model</Label>
                          <Select
                              value={state.current.model}
                              onValueChange={v => dispatch({ type: 'PUSH', payload: { ...state.current, model: v }})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Flux1.Dev">Flux1.Dev</SelectItem>
                              <SelectItem value="Juggernaut">Juggernaut</SelectItem>
                              <SelectItem value="SdXL">SdXL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Расширенные настройки */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch
                              checked={showAdvanced}
                              onCheckedChange={setShowAdvanced}
                          />
                          <Label>Advanced Settings</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                              variant="ghost"
                              size="sm"
                              disabled={state.currentIndex <= 0}
                              onClick={() => dispatch({ type: 'UNDO' })}
                          >
                            <Undo className="h-4 w-4" />
                          </Button>
                          <Button
                              variant="ghost"
                              size="sm"
                              disabled={state.currentIndex >= state.history.length - 1}
                              onClick={() => dispatch({ type: 'REDO' })}
                          >
                            <Redo className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {showAdvanced && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-6 p-4 bg-muted/20 rounded-lg"
                            >
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center">
                                    <Label className="flex items-center gap-2">
                                      CFG Scale
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <Info className="h-4 w-4" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          Guidance scale for prompt adherence
                                        </TooltipContent>
                                      </Tooltip>
                                    </Label>
                                    <Badge variant="outline">
                                      {state.current.cfgScale}
                                    </Badge>
                                  </div>
                                  <Slider
                                      value={[state.current.cfgScale]}
                                      onValueChange={v => dispatch({ type: 'PUSH', payload: { ...state.current, cfgScale: v[0] }})}
                                      min={1}
                                      max={30}
                                      step={0.5}
                                  />
                                </div>

                                <div className="space-y-4">
                                  <div className="flex justify-between items-center">
                                    <Label className="flex items-center gap-2">
                                      Steps
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <Info className="h-4 w-4" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          Generation iterations (↑ quality, ↑ time)
                                        </TooltipContent>
                                      </Tooltip>
                                    </Label>
                                    <Badge
                                        variant="outline"
                                        className={
                                          state.current.steps > 50 ? "text-red-500" :
                                              state.current.steps > 30 ? "text-yellow-500" : ""
                                        }
                                    >
                                      {state.current.steps}
                                    </Badge>
                                  </div>
                                  <Slider
                                      value={[state.current.steps]}
                                      onValueChange={v => dispatch({ type: 'PUSH', payload: { ...state.current, steps: v[0] }})}
                                      min={1}
                                      max={150}
                                  />
                                </div>
                              </div>

                              <Separator />

                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <Label>Seed</Label>
                                  <Input
                                      value={state.current.seed}
                                      onChange={e => dispatch({ type: 'PUSH', payload: { ...state.current, seed: e.target.value }})}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Sampler</Label>
                                  <Select
                                      value={state.current.sampler}
                                      onValueChange={v => dispatch({ type: 'PUSH', payload: { ...state.current, sampler: v }})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {["Euler a", "Euler", "Heun", "DPM2"].map(method => (
                                          <SelectItem key={method} value={method}>
                                            {method}
                                          </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Индикатор сложности */}
                    <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                      <span className="text-sm">Generation Complexity:</span>
                      <div className="flex items-center gap-2">
                        <div
                            className="h-2 w-32 bg-gradient-to-r from-green-500 to-red-500 rounded-full"
                            style={{ width: `${getComplexity() * 50}px` }}
                        />
                        <Badge variant="secondary">x{getComplexity()}</Badge>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isGenerating}>
                      {isGenerating ? (
                          <>
                            <Loader2 className="animate-spin mr-2" />
                            Generating...
                          </>
                      ) : (
                          <>
                            <Sparkles className="mr-2" />
                            Generate
                          </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Правая панель - История */}
            <div className="space-y-6">
              <Card className="bg-background/80">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generation History</CardTitle>
                    <div className="relative w-64">
                      <Input
                          placeholder="Search history..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="pl-8"
                      />
                      <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                      {searchQuery && (
                          <X
                              className="absolute right-2 top-3 h-4 w-4 cursor-pointer"
                              onClick={() => setSearchQuery("")}
                          />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatePresence>
                    {filteredHistory.map(gen => (
                        <motion.div
                            key={gen.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="group flex items-start gap-4 p-4 hover:bg-muted/20 rounded-lg transition-colors"
                        >
                          {gen.preview && (
                              <Image
                                  src={gen.preview}
                                  alt="Preview"
                                  width={80}
                                  height={80}
                                  className="rounded-md object-cover"
                              />
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium line-clamp-2">{gen.prompt}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <Badge variant="outline">{gen.model}</Badge>
                                  <Badge variant="outline">{gen.resolution}</Badge>
                                  <Badge variant="outline">{gen.steps} steps</Badge>
                                </div>
                              </div>
                              <Button
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100"
                                  onClick={() => dispatch({ type: 'PUSH', payload: gen })}
                              >
                                <Sparkles className="mr-2 h-4 w-4" />
                                Reuse
                              </Button>
                            </div>
                            <time className="text-xs text-muted-foreground mt-2 block">
                              {new Date(gen.timestamp).toLocaleString()}
                            </time>
                          </div>
                        </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </TooltipProvider>
  )
}