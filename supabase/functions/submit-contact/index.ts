import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const contactData: ContactMessage = await req.json();

    // Validate required fields
    if (!contactData.name || !contactData.email || !contactData.message) {
      return new Response(JSON.stringify({ 
        error: "Name, email, and message are required" 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
      return new Response(JSON.stringify({ 
        error: "Invalid email format" 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert contact message
    const { data, error } = await supabaseClient
      .from('contact_messages')
      .insert({
        name: contactData.name.trim(),
        email: contactData.email.toLowerCase().trim(),
        phone: contactData.phone?.trim() || null,
        message: contactData.message.trim(),
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to submit contact message: ${error.message}`);
    }

    console.log(`Contact message submitted: ${data.id} from ${contactData.email}`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Thank you! We've received your message and will get back to you soon.",
      id: data.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in submit-contact function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});