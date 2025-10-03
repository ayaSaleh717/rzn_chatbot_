import { useState } from 'react';
import { Button } from './../component/ui/button';
import { Input } from './../component/ui/input';
import { Label } from './../component/ui/label';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

const Records = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    if (password === 'doctor1') {
      setIsAuthenticated(true);
      toast.success('تم تسجيل الدخول بنجاح');
    } else {
      toast.error('كلمة المرور غير صحيحة');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="gradient-card soft-shadow rounded-3xl p-8 space-y-6">
            <div className="text-center">
              <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                <Lock className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-primary mb-2" dir="rtl">دخول الطبيب</h2>
              <p className="text-muted-foreground" dir="rtl">يرجى إدخال كلمة المرور للوصول إلى السجلات</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" dir="rtl">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="أدخل كلمة المرور"
                  dir="rtl"
                  className="text-right"
                />
              </div>

              <Button
                onClick={handleLogin}
                className="w-full gradient-hero text-white hover:opacity-90"
              >
                <span dir="rtl">تسجيل الدخول</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="gradient-card soft-shadow rounded-3xl p-8">
          <h1 className="text-3xl font-bold text-primary mb-6 text-center" dir="rtl">سجل المرضى</h1>
          
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg" dir="rtl">
              لا توجد سجلات حالياً. سيتم عرض سجلات المرضى هنا بعد حفظها.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Records;
