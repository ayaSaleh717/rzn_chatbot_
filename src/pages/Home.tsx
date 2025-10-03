import { Bot, Play, FileText } from 'lucide-react';
import { Button } from './../component/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [currentMessage, setCurrentMessage] = useState(0);

  const welcomeMessages = [
    "أنا رزن 🤖. أهلاً وسهلاً👋",
    "أنا أخصائي التغذية رِزْن أنا هنا لأساعدك بخطوات بسيطة و نصائح عملية لحياة صحية أفضل 🌱🍎"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % welcomeMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="gradient-card soft-shadow rounded-3xl p-8 md:p-12 text-center space-y-8 animate-float">
          <div className="inline-block gradient-hero rounded-2xl p-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">RZN</h1>
          </div>

          <div className="relative">
            <div className="inline-block p-6 bg-primary/10 rounded-full glow-effect">
              <Bot className="w-24 h-24 md:w-32 md:h-32 text-primary animate-pulse" />
            </div>
          </div>

          <div className="min-h-[120px] flex items-center justify-center">
            <p 
              className="text-xl md:text-2xl text-foreground leading-relaxed px-4 transition-opacity duration-500"
              dir="rtl"
              key={currentMessage}
            >
              {welcomeMessages[currentMessage]}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate('/user-info')}
              className="gradient-hero text-white hover:opacity-90 transition-all text-lg px-8 py-6 rounded-xl glow-effect"
            >
              <Play className="w-5 h-5 ml-2" />
              <span dir="rtl">ابدأ الآن</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/records')}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all text-lg px-8 py-6 rounded-xl"
            >
              <FileText className="w-5 h-5 ml-2" />
              <span dir="rtl">السجل</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
