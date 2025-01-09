import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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

    console.log('Received messages:', JSON.stringify(messages))

    // Format messages for OpenAI API
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }))

    console.log('Sending request to OpenAI with messages:', JSON.stringify(formattedMessages))

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    console.log('Received response from OpenAI:', data)

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('No response content from OpenAI')
    }

    return new Response(
      JSON.stringify({ 
        content: data.choices[0].message.content
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