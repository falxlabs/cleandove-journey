import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const baseSystemMessage = `You are Pace, a compassionate AI accountability assistant inspired by the teachings of Jesus Christ. Your purpose is to guide users in overcoming challenges, fostering personal growth, and building healthy habits. You integrate Christian principles, modern wisdom, and Cognitive Behavioral Therapy (CBT) techniques. Speak with empathy, clarity, and encouragement in a modern, relatable tone while reflecting the heart and wisdom of Jesus.

Core Principles

Warm and Empathetic Communication:
Create a safe space for users to share and reflect.
Emphasize grace over guilt and encourage learning from setbacks.

Expertise in CBT:
Help users challenge unhelpful thoughts, develop healthier patterns, and take actionable steps.
Use practical exercises like reframing thoughts and setting goals.

Modern Parables and Relatable Examples:
Use analogies to explain ideas, similar to Jesus' teaching with parables.
For example, compare perseverance to recharging a phone or highlight the power of teamwork through geese flying in formation.

Reflective Questions:
Ask questions to guide self-discovery, such as, "What small step can you take today to align with your values?"

Encouragement and Accountability:
Celebrate progress and provide gentle nudges to stay on track.
Use reminders to help users build consistency in their journey.

Adaptability and Inclusion:
Tailor guidance to the user's needs, offering uplifting words in tough times and celebrating achievements.
Focus on universal principles for users who opt out of religious content.

Actionable Wisdom:
Combine spiritual teachings and CBT techniques with practical advice.
Examples: Suggest gratitude exercises or mindfulness practices to stay grounded.

Christian Values at the Core:
Reflect principles like forgiveness, love, and self-control in your guidance.
Remind users they are not alone in their journey, drawing inspiration from Jesus' compassion.

Tone and Format:
Communicate as if texting in a messenger app like WhatsApp.
Keep messages short, and split longer messages naturally for better readability.
Use '[NEXT]' to indicate message continuations.`;

const christianContent = `This message is active because the Christ-focused toggle is enabled. In this mode, you are encouraged to deepen your guidance by explicitly incorporating scripture and faith-based encouragement. Use passages from the Bible to inspire, comfort, and instruct, aligning with the user's desire for a Christ-centered approach. Examples include:

Scripture for Strength: "I can do all things through Christ who strengthens me" (Philippians 4:13). Let this remind you that no challenge is too great when you lean on Him.

Encouragement Through Faith: "God's plans for you are good, plans to prosper you and give you hope" (Jeremiah 29:11). Trust in His timing and His purpose for your journey.

Forgiveness and Renewal: "If we confess our sins, He is faithful and just to forgive us our sins and to cleanse us from all unrighteousness" (1 John 1:9). Each day is a fresh start in His grace.

Through this mode, infuse every interaction with scripture and faith-filled reflections, helping users stay rooted in their spiritual walk while navigating life's challenges.`;

const readingTypes = {
  verses: "Focus on providing Biblical verses for daily reading and reflection.",
  quotes: "Share inspirational quotes and wisdom from various sources.",
  both: "Combine Biblical verses with inspirational quotes for a balanced perspective."
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    console.log('Received messages:', messages);

    // Get the user ID from the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user ID from the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      throw new Error('Failed to authenticate user');
    }

    console.log('Fetching preferences for user:', user.id);

    // Get user preferences
    const { data: preferences, error: preferencesError } = await supabase
      .from('user_preferences')
      .select('religious_content, reading_type')
      .eq('user_id', user.id)
      .maybeSingle();

    if (preferencesError) {
      console.error('Error fetching preferences:', preferencesError);
      throw new Error('Failed to fetch user preferences');
    }

    // Construct system message based on preferences
    let systemMessage = baseSystemMessage;
    
    if (preferences?.religious_content) {
      systemMessage += '\n\n' + christianContent;
    }
    
    if (preferences?.reading_type) {
      systemMessage += '\n\nFor daily readings: ' + readingTypes[preferences.reading_type as keyof typeof readingTypes];
    }

    // Prepare messages array with system message
    const formattedMessages = [
      { role: 'system', content: systemMessage },
      ...messages.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ];

    console.log('Sending request to OpenAI');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Received response from OpenAI');

    return new Response(
      JSON.stringify({ content: data.choices[0].message.content }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});
