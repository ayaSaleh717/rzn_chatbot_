import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userData, questionCount } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `أنت رزن، أخصائي تغذية محترف. مهمتك طرح 10 أسئلة محددة لفهم النمط الغذائي والصحي للمستخدم.
      
معلومات المستخدم:
- الاسم: ${userData?.name}
- العمر: ${userData?.age} سنة
- الجنس: ${userData?.gender === 'male' ? 'ذكر' : 'أنثى'}
- الوزن: ${userData?.weight} كجم
- الطول: ${userData?.height} سم

قم بطرح الأسئلة التالية بالترتيب:
1. ما هو هدفك الرئيسي؟ (خسارة وزن، زيادة وزن، الحفاظ على الوزن الحالي)
2. كم وجبة تتناول يومياً؟
3. هل تعاني من أي حساسية غذائية أو أمراض مزمنة؟
4. ما هو مستوى نشاطك البدني؟ (قليل، متوسط، عالي)
5. كم كوب ماء تشرب يومياً؟
6. هل تتناول وجبات سريعة؟ وكم مرة في الأسبوع؟
7. ما هي الأطعمة المفضلة لديك؟
8. هل تفضل نظام غذائي معين؟ (نباتي، كيتو، متوازن، إلخ)
9. هل لديك أي قيود على أوقات الوجبات؟
10. ما هي الأطعمة التي لا تحبها أو تتجنبها؟

أنت الآن في السؤال رقم ${questionCount + 1}. اطرح سؤالاً واحداً فقط في كل مرة، وكن ودوداً ومحفزاً.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "يرجى إضافة رصيد إلى حسابك في Lovable." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "حدث خطأ غير متوقع" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
