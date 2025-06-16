"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Volume2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ChatPage() {
  const [text, setText] = useState("")
  const [voiceModel, setVoiceModel] = useState("eleven_multilingual_v2")
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const handleGenerateSpeech = async () => {
    if (!text.trim()) return

    setIsGenerating(true)
    setAudioUrl(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          modelId: voiceModel,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate speech")
      }

      const audioBlob = await response.blob()
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
    } catch (error) {
      console.error("Error generating speech:", error)
      alert("Failed to generate speech. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePlayAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl)
      audio.play()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="mb-4">
          <Link href="https://acolyte-sandbox.vercel.app/">
            <Button variant="outline" className="text-blue-600 border-blue-300 hover:bg-blue-100">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Acolyte Sandbox
            </Button>
          </Link>
        </div>
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-blue-600">Eleven Labs</CardTitle>
            <p className="text-blue-600/80 mt-2">Convert your text to natural-sounding speech</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="text-input" className="text-sm font-medium text-blue-600">
                Enter your text
              </label>
              <Input
                id="text-input"
                placeholder="Type the text you want to convert to speech..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[100px] resize-none"
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="voice-model" className="text-sm font-medium text-blue-600">
                Select Voice Model
              </label>
              <Select value={voiceModel} onValueChange={setVoiceModel} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a voice model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eleven_monolingual_v1">Monolingual (English only)</SelectItem>
                  <SelectItem value="eleven_multilingual_v2">Multilingual (Multiple languages)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGenerateSpeech} disabled={!text.trim() || isGenerating} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Speech...
                </>
              ) : (
                "Generate Speech"
              )}
            </Button>

            {audioUrl && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600">Speech generated successfully!</span>
                  <Button
                    onClick={handlePlayAudio}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-300 hover:bg-blue-100"
                  >
                    <Volume2 className="mr-2 h-4 w-4" />
                    Play Audio
                  </Button>
                </div>
                <audio controls className="w-full">
                  <source src={audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
