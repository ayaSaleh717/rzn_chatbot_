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
    const { userData, chatHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `أنت أخصائي تغذية خبير. بناءً على المعلومات التالية، قم بإنشاء خطة غذائية أسبوعية مفصلة:

معلومات المستخدم:
- الاسم: ${userData?.name}
- العمر: ${userData?.age} سنة
- الجنس: ${userData?.gender === 'male' ? 'ذكر' : 'أنثى'}
- الوزن: ${userData?.weight} كجم
- الطول: ${userData?.height} سم

تاريخ المحادثة:
${chatHistory.map((msg: any) => `${msg.role === 'user' ? 'المستخدم' : 'رزن'}: ${msg.content}`).join('\n')}

قم بإنشاء خطة غذائية تتضمن:
1. حساب السعرات الحرارية اليومية المطلوبة
2. توزيع الماكروز (بروتين، كربوهيدرات، دهون)
3. خطة وجبات مفصلة لمدة 7 أيام (الإفطار، الغداء، العشاء، وجبات خفيفة)
4. نصائح صحية مخصصة
5. توصيات للمياه والنشاط البدني

قدم الخطة بتنسيق واضح ومنظم.`;

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
          { role: "user", content: "أنشئ لي خطة غذائية أسبوعية كاملة" },
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
    console.error("Generate meal plan error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "حدث خطأ في إنشاء الخطة الغذائية" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
