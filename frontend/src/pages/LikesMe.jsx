import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Users, User as UserIcon, Bell, Grid3x3, CreditCard, MapPin, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "../App";
import { toast } from "sonner";

const LikesMe = ({ user }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLikes();
  }, []);

  const loadLikes = async () => {
    try {
      const response = await api.get("/swipes/likes-me");
      setLikes(response.data);
    } catch (error) {
      toast.error("فشل تحميل قائمة الإعجابات");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (userId) => {
    try {
      const response = await api.post("/swipes", {
        to_user_id: userId,
        action: "like",
      });

      if (response.data.is_match) {
        toast.success("🎉 مطابقة جديدة!");
      }

      setLikes(likes.filter(l => l.user.id !== userId));
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  const handlePass = async (userId) => {
    try {
      await api.post("/swipes", {
        to_user_id: userId,
        action: "pass",
      });
      setLikes(likes.filter(l => l.user.id !== userId));
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <p className="text-white text-xl">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <header className="py-4 px-6 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Pizoo</h1>
          </div>
          
          <nav className="flex gap-2">
            <Button
              data-testid="nav-encounters-btn"
              onClick={() => navigate("/encounters")}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full px-6 py-5"
            >
              <Grid3x3 className="w-5 h-5" />
            </Button>
            <Button
              data-testid="nav-discover-btn"
              onClick={() => navigate("/discover")}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full px-6 py-5"
            >
              <Heart className="w-5 h-5" />
            </Button>
            <Button
              data-testid="nav-matches-btn"
              onClick={() => navigate("/matches")}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full px-6 py-5"
            >
              <Users className="w-5 h-5" />
            </Button>
            <Button
              data-testid="nav-likes-btn"
              onClick={() => navigate("/likes-me")}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full px-6 py-5"
            >
              <CreditCard className="w-5 h-5" />
            </Button>
            <Button
              data-testid="nav-notifications-btn"
              onClick={() => navigate("/notifications")}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full px-6 py-5"
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Button
              data-testid="nav-profile-btn"
              onClick={() => navigate("/profile")}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full px-6 py-5"
            >
              <UserIcon className="w-5 h-5" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-white mb-8">من أعجب بك ({likes.length})</h2>

        {likes.length === 0 ? (
          <div data-testid="no-likes" className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12">
              <Heart className="w-20 h-20 text-white/50 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">لا توجد إعجابات بعد</h3>
              <p className="text-white/80 mb-8">استمر في السوايب للحصول على إعجابات</p>
              <Button
                onClick={() => navigate("/encounters")}
                className="bg-white hover:bg-white/90 text-purple-600 px-8 py-6 rounded-full font-bold"
              >
                ابدأ الاكتشاف
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {likes.map((like) => (
              <div
                key={like.user.id}
                data-testid={`like-card-${like.user.id}`}
                className="bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="relative aspect-[4/5]">
                  <img
                    src={like.user.photos?.[0] || "https://via.placeholder.com/400x500"}
                    alt={like.user.name}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => navigate(`/user/${like.user.id}`)}
                  />
                  
                  {/* Online indicator */}
                  {like.user.online && (
                    <div className="absolute top-4 right-4 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                  
                  {/* Verified badge */}
                  {like.user.verified && (
                    <div className="absolute top-4 left-4">
                      <CheckCircle className="w-7 h-7 text-blue-500 fill-white" />
                    </div>
                  )}

                  {/* User Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-5">
                    <h3 className="text-white font-bold text-2xl mb-2">
                      {like.user.name}, {like.user.age}
                    </h3>
                    <div className="flex items-center gap-2 text-white/90 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{like.user.location}</span>
                    </div>
                    {like.user.bio && (
                      <p className="text-white/80 text-sm line-clamp-2">{like.user.bio}</p>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="p-4 flex gap-3 justify-center">
                  <button
                    onClick={() => handlePass(like.user.id)}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center gap-2 font-semibold text-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    تمرير
                  </button>
                  <button
                    onClick={() => handleLike(like.user.id)}
                    className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl flex items-center justify-center gap-2 font-bold transition-colors"
                  >
                    <Heart className="w-5 h-5 fill-white" />
                    إعجاب
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikesMe;