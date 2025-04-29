import { NextResponse } from 'next/server'
import { generateChatResponse } from '../../../utils/gemini'

// System prompt for the chatbot
const SYSTEM_PROMPT = `You are a helpful assistant that helps users discover government welfare schemes they might be eligible for.
When users provide information about themselves, analyze their eligibility for various schemes and provide relevant recommendations.
Focus on Indian government schemes and be specific about eligibility criteria and benefits.

Some key schemes to consider:
1. PM-KISAN - For farmers
2. PM Ujjwala Yojana - For BPL households
3. PM Awas Yojana - For housing
4. MGNREGA - For rural employment
5. PM Garib Kalyan Yojana - For food security
6. PM Fasal Bima Yojana - For crop insurance

Always ask for:
- Age
- Occupation
- Income level
- Family status
- Location (rural/urban)
- Any specific needs or challenges

Provide clear, concise responses and focus on practical information.`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      )
    }

    const response = await generateChatResponse(messages)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 