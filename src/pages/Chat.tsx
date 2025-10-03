import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './../component/ui/button';
import { Input } from './../component/ui/input';
import { Bot, Send, FileCheck } from 'lucide-react';
import { useUserData } from '@/contexts/UserDataContext';
import { toast } from 'sonner';

const DEEPSEEK_API_KEY = 'sk-925ed15fe6f047a58cab583bc1b99599';

const Chat = () => {
  const navigate = useNavigate();
  const { userData, chatHistory, setChatHistory, setMealPlan } = useUserData();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userData) {
      navigate('/user-info');
      return;
    }

    if (chatHistory.length === 0) {
      const initialMessage = {
        role: 'assistant' as const,
        content: `مرحباً ${userData.name}! أنا رزن، أخصائي التغذية الخاص بك. سأطرح عليك بعض الأسئلة لفهم نمط حياتك الغذائي وأهدافك بشكل أفضل. هل أنت مستعد للبدء؟`
      };
      setChatHistory([initialMessage]);
    }
  }, [userData, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: message };
    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    setMessage('');
    setIsLoading(true);

    try {
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

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            ...newHistory
          ],
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        throw new Error('فشل الاتصال بالخادم');
      }

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant' as const,
        content: data.choices[0].message.content
      };

      setChatHistory([...newHistory, assistantMessage]);
      setQuestionCount(prev => prev + 1);
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMealPlan = async () => {
    setIsLoading(true);
    try {
      const systemPrompt = `أنت أخصائي تغذية خبير. بناءً على المعلومات التالية، قم بإنشاء خطة غذائية أسبوعية مفصلة:

معلومات المستخدم:
- الاسم: ${userData?.name}
- العمر: ${userData?.age} سنة
- الجنس: ${userData?.gender === 'male' ? 'ذكر' : 'أنثى'}
- الوزن: ${userData?.weight} كجم
- الطول: ${userData?.height} سم

تاريخ المحادثة:
${chatHistory.map(msg => `${msg.role === 'user' ? 'المستخدم' : 'رزن'}: ${msg.content}`).join('\n')}

قم بإنشاء خطة غذائية تتضمن:
1. حساب السعرات الحرارية اليومية المطلوبة
2. توزيع الماكروز (بروتين، كربوهيدرات، دهون)
3. خطة وجبات مفصلة لمدة 7 أيام (الإفطار، الغداء، العشاء، وجبات خفيفة)
4. نصائح صحية مخصصة
5. توصيات للمياه والنشاط البدني

قدم الخطة بتنسيق واضح ومنظم.`;

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: 'أنشئ لي خطة غذائية أسبوعية كاملة' }
          ],
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        throw new Error('فشل إنشاء الخطة الغذائية');
      }

      const data = await response.json();
      const plan = data.choices[0].message.content;
      setMealPlan(plan);
      navigate('/meal-plan');
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ في إنشاء الخطة الغذائية. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl h-[80vh] flex flex-col">
        <div className="gradient-card soft-shadow rounded-3xl flex flex-col h-full overflow-hidden">
          <div className="gradient-hero p-4 flex items-center gap-3">
            <Bot className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white" dir="rtl">محادثة مع رزن</h2>
              <p className="text-white/80 text-sm" dir="rtl">أجب على الأسئلة للحصول على خطة غذائية مخصصة</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                  dir="rtl"
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end">
                <div className="bg-muted rounded-2xl p-4 animate-pulse" dir="rtl">
                  رزن يكتب...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border space-y-3">
            {questionCount >= 10 && (
              <Button
                onClick={generateMealPlan}
                disabled={isLoading}
                className="w-full gradient-hero text-white hover:opacity-90 glow-effect"
              >
                <FileCheck className="w-5 h-5 ml-2" />
                <span dir="rtl">اعرض الخطة الغذائية</span>
              </Button>
            )}
            
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="اكتب إجابتك هنا..."
                disabled={isLoading}
                dir="rtl"
                className="text-right"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !message.trim()}
                size="icon"
                className="gradient-hero text-white"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
