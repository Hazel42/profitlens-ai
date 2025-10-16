
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.11.3";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Definisikan header CORS untuk mengizinkan permintaan dari aplikasi web Anda
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Untuk pengembangan, '*' tidak apa-apa. Untuk produksi, ganti dengan URL aplikasi Anda.
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fungsi utama yang akan dijalankan oleh Supabase Edge Function
serve(async (req) => {
  // Menangani permintaan preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Ambil kunci API Gemini dari variabel lingkungan Supabase (secrets)
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
        throw new Error("GEMINI_API_KEY is not set in Supabase secrets.");
    }
    
    const genAI = new GoogleGenerativeAI(geminiApiKey);

    // Ekstrak payload dari permintaan yang dikirim oleh client
    const { model, contents, streaming, config } = await req.json();

    if (!model || !contents) {
        return new Response(JSON.stringify({ error: "Request body must contain 'model' and 'contents' fields." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const generativeModel = genAI.getGenerativeModel({ model, ...config });

    // Cek apakah permintaan menginginkan respons streaming atau tidak
    if (streaming) {
      const result = await generativeModel.generateContentStream(contents);

      // Buat stream yang dapat dibaca untuk mengirim data kembali ke client
      const readableStream = new ReadableStream({
        async start(controller) {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            // Kirim setiap potongan data sebagai Server-Sent Event (SSE)
            controller.enqueue(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
          }
          controller.close();
        },
      });

      return new Response(readableStream, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
        },
      });
    } else {
      // Untuk permintaan non-streaming
      const result = await generativeModel.generateContent(contents);
      const response = result.response;
      const text = response.text();

      return new Response(JSON.stringify({ text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
