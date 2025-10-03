import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './../component/ui/button';
import { Input } from './../component/ui/input';
import { Bot, Send, FileCheck } from 'lucide-react';
import { useUserData } from '@/contexts/UserDataContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          messages: newHistory,
          userData,
          questionCount 
        }
      });

      if (error) {
        console.error('Error:', error);
        throw new Error(error.message || 'فشل الاتصال بالخادم');
      }

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
      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: { 
          userData,
          chatHistory 
        }
      });

      if (error) {
        console.error('Error:', error);
        throw new Error(error.message || 'فشل إنشاء الخطة الغذائية');
      }

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
