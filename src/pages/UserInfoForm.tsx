import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './../component/ui/button';
import { Input } from './../component/ui/input';
import { Label } from './../component/ui/label';
import { RadioGroup, RadioGroupItem } from './../component/ui/radio-group';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useUserData } from '@/contexts/UserDataContext';
import { toast } from 'sonner';

const UserInfoForm = () => {
  const navigate = useNavigate();
  const { setUserData } = useUserData();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: '',
    weight: '',
    height: ''
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.age || !formData.gender || !formData.weight || !formData.height) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }
    setUserData(formData);
    navigate('/chat');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="gradient-card soft-shadow rounded-3xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary mb-2" dir="rtl">معلوماتك الأساسية</h2>
            <p className="text-muted-foreground" dir="rtl">سنحتاج بعض المعلومات لتقديم أفضل خطة غذائية</p>
          </div>

          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="space-y-2">
                <Label htmlFor="name" dir="rtl">الاسم</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="أدخل اسمك"
                  dir="rtl"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" dir="rtl">رقم الهاتف</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="أدخل رقم هاتفك"
                  dir="rtl"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" dir="rtl">العمر</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  placeholder="أدخل عمرك"
                  dir="rtl"
                  className="text-right"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="space-y-3">
                <Label dir="rtl">الجنس</Label>
                <RadioGroup value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" dir="rtl">ذكر</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" dir="rtl">أنثى</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" dir="rtl">الوزن (كجم)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  placeholder="أدخل وزنك"
                  dir="rtl"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height" dir="rtl">الطول (سم)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  placeholder="أدخل طولك"
                  dir="rtl"
                  className="text-right"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {step === 2 && (
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                <span dir="rtl">السابق</span>
              </Button>
            )}
            
            {step === 1 ? (
              <Button
                onClick={() => setStep(2)}
                className="flex-1 gradient-hero text-white hover:opacity-90"
              >
                <span dir="rtl">التالي</span>
                <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex-1 gradient-hero text-white hover:opacity-90"
              >
                <span dir="rtl">ابدأ المحادثة</span>
                <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoForm;
