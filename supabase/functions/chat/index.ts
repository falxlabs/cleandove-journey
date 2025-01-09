import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { messages } = await req.json()

    // Validate messages array
    if (!Array.isArray(messages)) {
      throw new Error('Messages must be an array')
    }

    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    })
    const openai = new OpenAIApi(configuration)

    // Format messages for OpenAI API
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }))

    console.log('Sending request to OpenAI with messages:', JSON.stringify(formattedMessages))

    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 500
    })

    if (!completion.data.choices[0].message) {
      throw new Error('No response from OpenAI')
    }

    const response = completion.data.choices[0].message

    console.log('Received response from OpenAI:', response)

    return new Response(
      JSON.stringify({ 
        content: response.content || "I apologize, but I couldn't generate a response."
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in chat function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  }
})