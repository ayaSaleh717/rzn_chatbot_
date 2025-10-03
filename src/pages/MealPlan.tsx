import { Button } from './../component/ui/button';
import { Printer, RefreshCw, User } from 'lucide-react';
import { useUserData } from '@/contexts/UserDataContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';

const DEEPSEEK_API_KEY = 'sk-925ed15fe6f047a58cab583bc1b99599';

const MealPlan = () => {
  const { userData, mealPlan, chatHistory, setMealPlan } = useUserData();
  const navigate = useNavigate();
  const [isRegenerating, setIsRegenerating] = useState(false);

  if (!userData || !mealPlan) {
    navigate('/');
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  const calculateBMI = () => {
    const heightInMeters = parseInt(userData.height) / 100;
    const weight = parseInt(userData.weight);
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    return bmi;
  };

  const regeneratePlan = async () => {
    setIsRegenerating(true);
    try {
      const systemPrompt = `أنت أخصائي تغذية خبير. قم بإنشاء خطة غذائية أسبوعية جديدة ومختلفة بناءً على نفس المعلومات:

معلومات المستخدم:
- الاسم: ${userData.name}
- العمر: ${userData.age} سنة
- الجنس: ${userData.gender === 'male' ? 'ذكر' : 'أنثى'}
- الوزن: ${userData.weight} كجم
- الطول: ${userData.height} سم

تاريخ المحادثة:
${chatHistory.map(msg => `${msg.role === 'user' ? 'المستخدم' : 'رزن'}: ${msg.content}`).join('\n')}

قم بإنشاء خطة غذائية جديدة تتضمن وجبات مختلفة تماماً عن الخطة السابقة، مع الحفاظ على نفس المعايير الغذائية.`;

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
            { role: 'user', content: 'أنشئ لي خطة غذائية أسبوعية جديدة ومختلفة' }
          ],
          temperature: 0.8,
        })
      });

      if (!response.ok) {
        throw new Error('فشل إنشاء الخطة الجديدة');
      }

      const data = await response.json();
      const newPlan = data.choices[0].message.content;
      setMealPlan(newPlan);
      toast.success('تم إنشاء خطة غذائية جديدة بنجاح!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ في إنشاء الخطة الجديدة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="gradient-card soft-shadow rounded-3xl p-8 space-y-6 print:shadow-none">
          <div className="gradient-hero rounded-2xl p-6 text-white">
            <h1 className="text-3xl font-bold mb-4 text-center" dir="rtl">خطتك الغذائية الأسبوعية</h1>
            
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5" />
                  <h3 className="font-semibold" dir="rtl">المعلومات الشخصية</h3>
                </div>
                <div className="space-y-1 text-sm" dir="rtl">
                  <p>الاسم: {userData.name}</p>
                  <p>العمر: {userData.age} سنة</p>
                  <p>الجنس: {userData.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                  <p>رقم الهاتف: {userData.phone}</p>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5" />
                  <h3 className="font-semibold" dir="rtl">المقاييس الصحية</h3>
                </div>
                <div className="space-y-1 text-sm" dir="rtl">
                  <p>الوزن: {userData.weight} كجم</p>
                  <p>الطول: {userData.height} سم</p>
                  <p>مؤشر كتلة الجسم (BMI): {calculateBMI()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none" dir="rtl">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {mealPlan}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 print:hidden">
            <Button
              onClick={handlePrint}
              className="flex-1 gradient-hero text-white hover:opacity-90"
            >
              <Printer className="w-5 h-5 ml-2" />
              <span dir="rtl">طباعة الخطة</span>
            </Button>
            <Button
              onClick={regeneratePlan}
              disabled={isRegenerating}
              variant="outline"
              className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white"
            >
              <RefreshCw className={`w-5 h-5 ml-2 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span dir="rtl">{isRegenerating ? 'جاري التوليد...' : 'توليد خطة جديدة'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlan;
