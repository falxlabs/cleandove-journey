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
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const { messages } = await req.json();
    
    const firstUserMessage = messages.find((msg: any) => msg.sender === 'user')?.content || '';
    const firstAssistantMessage = messages.find((msg: any) => msg.sender === 'assistant')?.content || '';

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
            content: `You are a helpful assistant that generates concise, discreet titles for conversations.
            Important guidelines:
            - Keep titles under 60 characters
            - For sensitive or personal topics (relationships, temptations, struggles), use general, non-specific titles like "Personal Growth Discussion" or "Self-Improvement Chat"
            - Never include names or specific details that could identify people
            - Never mention explicit content or sensitive topics directly
            - Focus on the theme of growth, improvement, or support rather than the specific challenge
            - Maintain complete privacy and discretion`
          },
          { 
            role: 'user', 
            content: `Generate a discreet title for this conversation.\nUser: ${firstUserMessage}\nAssistant: ${firstAssistantMessage}` 
          }
        ],
        max_tokens: 60,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const title = data.choices[0].message.content.replace(/["']/g, '');

    console.log('Generated title:', title);
    return new Response(JSON.stringify({ title }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-title function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});