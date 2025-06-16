import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js"
import { type NextRequest, NextResponse } from "next/server"

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY

if (!ELEVENLABS_API_KEY) {
  throw new Error("Missing ELEVENLABS_API_KEY in environment variables")
}

const elevenlabs = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { text, modelId } = await req.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required and must be a string" }, { status: 400 })
    }

    if (!modelId || typeof modelId !== "string") {
      return NextResponse.json({ error: "Model ID is required and must be a string" }, { status: 400 })
    }

    // Generate audio stream from text using ElevenLabs
    const audioStream = await elevenlabs.textToSpeech.stream("JBFqnCBsd6RMkjVDRZzb", {
      modelId: modelId,
      text: text,
      outputFormat: "mp3_44100_128",
      voiceSettings: {
        stability: 0.5,
        similarityBoost: 1.0,
        useSpeakerBoost: true,
        speed: 1.0,
      },
    })

    // Collect all chunks into a buffer
    const chunks: Buffer[] = []
    for await (const chunk of audioStream) {
      chunks.push(chunk)
    }

    const audioBuffer = Buffer.concat(chunks)

    // Return the audio as a response
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("Error generating speech:", error)
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 })
  }
}
