import { useNavigate } from "react-router-dom";
import { Heart, Sparkles, MessageCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <header className="py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Heart className="w-7 h-7 text-white fill-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Pizoo</h1>
          </div>
          <Button
            data-testid="header-signin-btn"
            onClick={() => navigate("/auth")}
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-0 px-8 py-6 text-lg font-semibold rounded-full"
          >
            تسجيل الدخول
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-white font-medium">منصة التعارف الأولى</span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
            اكتشف شريك حياتك
            <br />
            <span className="text-pink-200">مع Pizoo</span>
          </h2>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            انضم إلى آلاف المستخدمين الذين وجدوا الحب والصداقات الحقيقية من خلال منصتنا
          </p>
          
          <div className="flex gap-4 justify-center pt-6">
            <Button
              data-testid="hero-getstarted-btn"
              onClick={() => navigate("/auth")}
              className="bg-white hover:bg-white/90 text-purple-600 px-12 py-7 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              ابدأ الآن مجاناً
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div data-testid="feature-swipe" className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl text-center space-y-4 hover:bg-white/15 transition-all">
            <div className="w-16 h-16 mx-auto bg-pink-400/30 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">سوايب ذكي</h3>
            <p className="text-white/80">اسحب يميناً للإعجاب، يساراً للتمرير - بسيط وسريع</p>
          </div>

          <div data-testid="feature-match" className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl text-center space-y-4 hover:bg-white/15 transition-all">
            <div className="w-16 h-16 mx-auto bg-orange-400/30 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">مطابقات فورية</h3>
            <p className="text-white/80">احصل على إشعار فوري عند حدوث مطابقة</p>
          </div>

          <div data-testid="feature-chat" className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl text-center space-y-4 hover:bg-white/15 transition-all">
            <div className="w-16 h-16 mx-auto bg-purple-400/30 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">دردشة آمنة</h3>
            <p className="text-white/80">تحدث مع مطابقاتك في بيئة آمنة وخاصة</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-8 py-20 text-center">
        <div className="bg-white/10 backdrop-blur-xl p-12 rounded-3xl space-y-6">
          <h3 className="text-4xl font-bold text-white">جاهز للبدء؟</h3>
          <p className="text-xl text-white/90">انضم إلى Pizoo الآن واكتشف عالماً من الفرص</p>
          <Button
            data-testid="cta-join-btn"
            onClick={() => navigate("/auth")}
            className="bg-white hover:bg-white/90 text-purple-600 px-12 py-7 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            انضم مجاناً
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-white/60">© 2025 Pizoo. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

export default Landing;