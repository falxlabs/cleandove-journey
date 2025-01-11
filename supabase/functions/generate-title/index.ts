import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    // Get the first user message and AI response
    const userMessage = messages.find((m: any) => m.sender === 'user')?.content || '';
    const aiResponse = messages.find((m: any) => m.sender === 'assistant')?.content || '';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Generate a very short, engaging title (max 4-5 words) for a chat conversation based on the context provided. The title should capture the essence of what the user wants to discuss or improve.' 
          },
          { 
            role: 'user', 
            content: `User message: "${userMessage}"\nAI response: "${aiResponse}"\n\nGenerate a short, engaging title for this conversation.` 
          }
        ],
      }),
    });

    const data = await response.json();
    const title = data.choices[0].message.content.replace(/["']/g, '');

    return new Response(JSON.stringify({ title }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-title function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});