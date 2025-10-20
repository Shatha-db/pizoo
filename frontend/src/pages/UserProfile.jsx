import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Heart, X, Briefcase, GraduationCap, Ruler, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "../App";
import { toast } from "sonner";

const UserProfile = ({ user: currentUser }) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      const response = await api.get(`/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      toast.error("فشل تحميل الملف الشخصي");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await api.post("/swipes", {
        to_user_id: userId,
        action: "like",
      });

      if (response.data.is_match) {
        toast.success("🎉 مطابقة جديدة!");
        navigate("/matches");
      } else {
        toast.success("تم إرسال الإعجاب");
        navigate(-1);
      }
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  const handlePass = async () => {
    try {
      await api.post("/swipes", {
        to_user_id: userId,
        action: "pass",
      });
      navigate(-1);
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <p className="text-white text-xl">المستخدم غير موجود</p>
      </div>
    );
  }

  const totalPhotos = user.photos?.length || 1;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <header className="py-4 px-6 bg-white/10 backdrop-blur-lg border-b border-white/20 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button
            data-testid="back-btn"
            onClick={() => navigate(-1)}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">{user.name}</h1>
        </div>
      </header>

      <div className="pt-20 pb-24">
        {/* Photos Section */}
        <div className="max-w-2xl mx-auto px-4 mb-6">
          <div className="relative aspect-[3/4] bg-gray-200 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={user.photos?.[currentPhotoIndex] || "https://via.placeholder.com/600x800"}
              alt={user.name}
              className="w-full h-full object-cover"
            />

            {/* Online indicator */}
            {user.online && (
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-gray-800">متصل الآن</span>
              </div>
            )}

            {/* Verified badge */}
            {user.verified && (
              <div className="absolute top-6 left-6">
                <CheckCircle className="w-10 h-10 text-blue-500 fill-white drop-shadow-lg" />
              </div>
            )}

            {/* Photo Navigation */}
            {totalPhotos > 1 && (
              <>
                <div className="absolute top-20 left-0 right-0 flex gap-2 px-6">
                  {Array.from({ length: totalPhotos }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1 rounded-full ${
                        i === currentPhotoIndex ? "bg-white" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
                
                {currentPhotoIndex > 0 && (
                  <button
                    onClick={() => setCurrentPhotoIndex(currentPhotoIndex - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                  >
                    <ChevronLeft className="w-7 h-7" />
                  </button>
                )}
                
                {currentPhotoIndex < totalPhotos - 1 && (
                  <button
                    onClick={() => setCurrentPhotoIndex(currentPhotoIndex + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                  >
                    <ChevronRight className="w-7 h-7" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {user.name}, {user.age}
                </h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">{user.location}</span>
                </div>
              </div>
            </div>

            {user.bio && (
              <p className="text-gray-700 text-lg mb-4">{user.bio}</p>
            )}

            {/* Details */}
            <div className="space-y-3">
              {user.height && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Ruler className="w-5 h-5" />
                  <span>{user.height}</span>
                </div>
              )}
              {user.education && (
                <div className="flex items-center gap-3 text-gray-700">
                  <GraduationCap className="w-5 h-5" />
                  <span>{user.education}</span>
                </div>
              )}
              {user.work && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Briefcase className="w-5 h-5" />
                  <span>{user.work}</span>
                </div>
              )}
            </div>
          </div>

          {/* Interests */}
          {user.interests?.length > 0 && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">الاهتمامات</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-medium"
                  >
                    #{interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 p-6">
        <div className="max-w-2xl mx-auto flex gap-4 justify-center">
          <button
            data-testid="pass-btn"
            onClick={handlePass}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all"
          >
            <X className="w-8 h-8 text-red-500" />
          </button>
          
          <button
            data-testid="like-btn"
            onClick={handleLike}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 shadow-xl flex items-center justify-center hover:scale-110 hover:shadow-2xl transition-all"
          >
            <Heart className="w-10 h-10 text-white fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;