import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Mail, Lock, User, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "../App";
import { toast } from "sonner";

const Auth = ({ setUser }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
    gender: "male",
    location: "",
    bio: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            ...formData,
            age: parseInt(formData.age),
            interests: [],
          };

      const response = await api.post(endpoint, payload);
      localStorage.setItem("pizoo_token", response.data.token);
      setUser(response.data.user);
      toast.success(isLogin ? "تم تسجيل الدخول بنجاح" : "تم إنشاء الحساب بنجاح");
      navigate("/discover");
    } catch (error) {
      toast.error(error.response?.data?.detail || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Heart className="w-9 h-9 text-white fill-white" />
            </div>
            <h1 className="text-5xl font-bold text-white">Pizoo</h1>
          </div>
          <p className="text-white/90 text-lg">اكتشف شريك حياتك</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-full">
            <button
              data-testid="toggle-login-btn"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-full font-semibold transition-all ${
                isLogin ? "bg-purple-600 text-white shadow-md" : "text-gray-600"
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              data-testid="toggle-register-btn"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-full font-semibold transition-all ${
                !isLogin ? "bg-purple-600 text-white shadow-md" : "text-gray-600"
              }`}
            >
              إنشاء حساب
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-gray-700 font-medium mb-2 block">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                <Input
                  data-testid="email-input"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pr-11 py-6 rounded-xl border-2 border-gray-200 focus:border-purple-500"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-700 font-medium mb-2 block">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                <Input
                  data-testid="password-input"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pr-11 py-6 rounded-xl border-2 border-gray-200 focus:border-purple-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <Label className="text-gray-700 font-medium mb-2 block">الاسم</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                    <Input
                      data-testid="name-input"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pr-11 py-6 rounded-xl border-2 border-gray-200 focus:border-purple-500"
                      placeholder="الاسم الكامل"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block">العمر</Label>
                    <div className="relative">
                      <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                      <Input
                        data-testid="age-input"
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="pr-11 py-6 rounded-xl border-2 border-gray-200 focus:border-purple-500"
                        placeholder="25"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block">الجنس</Label>
                    <select
                      data-testid="gender-select"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                      required
                    >
                      <option value="male">ذكر</option>
                      <option value="female">أنثى</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700 font-medium mb-2 block">الموقع</Label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                    <Input
                      data-testid="location-input"
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="pr-11 py-6 rounded-xl border-2 border-gray-200 focus:border-purple-500"
                      placeholder="المدينة، الدولة"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <Button
              data-testid="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-6 text-lg font-bold rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? "جاري التحميل..." : isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;