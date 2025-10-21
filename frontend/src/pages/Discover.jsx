import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, X, MapPin, Users, MessageCircle, User as UserIcon, ChevronLeft, ChevronRight, Bell, Grid3x3, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "../App";
import { toast } from "sonner";

const Discover = ({ user }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get("/users/discover");
      setUsers(response.data);
    } catch (error) {
      toast.error("فشل تحميل المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (action) => {
    if (swiping || currentIndex >= users.length) return;
    
    setSwiping(true);
    const currentUser = users[currentIndex];

    try {
      const response = await api.post("/swipes", {
        to_user_id: currentUser.id,
        action,
      });

      if (response.data.is_match) {
        toast.success("🎉 مطابقة جديدة!");
      }

      setCurrentIndex(currentIndex + 1);
      setCurrentPhotoIndex(0);
    } catch (error) {
      toast.error("حدث خطأ");
    } finally {
      setSwiping(false);
    }
  };

  const currentUser = users[currentIndex];
  const totalPhotos = currentUser?.photos?.length || 1;

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
              className="bg-white/20 hover:bg-white/30 text-white rounded-full px-6 py-5"
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
              className="bg-white/10 hover:bg-white/20 text-white rounded-full px-6 py-5"
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

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 py-8">
        {currentIndex < users.length ? (
          <div data-testid="user-card" className="relative">
            {/* Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
              {/* Photo */}
              <div className="relative aspect-[3/4] bg-gray-200">
                <img
                  src={currentUser.photos?.[currentPhotoIndex] || "https://via.placeholder.com/400x600?text=No+Photo"}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Photo Navigation */}
                {totalPhotos > 1 && (
                  <>
                    <div className="absolute top-4 left-0 right-0 flex gap-2 px-4">
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
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                    )}
                    
                    {currentPhotoIndex < totalPhotos - 1 && (
                      <button
                        onClick={() => setCurrentPhotoIndex(currentPhotoIndex + 1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    )}
                  </>
                )}
                
                {/* User Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
                  {/* Verified badge */}
                  {currentUser.verified && (
                    <div className="mb-3">
                      <CheckCircle className="w-8 h-8 text-blue-500 fill-white inline-block" />
                    </div>
                  )}
                  
                  {/* Interests tags */}
                  {currentUser.interests?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {currentUser.interests.slice(0, 3).map((interest, idx) => (
                        <span
                          key={idx}
                          className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-medium"
                        >
                          #{interest}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <h2 className="text-3xl font-bold mb-2">
                    {currentUser.name}, {currentUser.age}
                  </h2>
                  <div className="flex items-center gap-2 text-white/90 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{currentUser.location}</span>
                  </div>
                  {currentUser.bio && (
                    <p className="text-white/90 line-clamp-2">{currentUser.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-6 mt-8">
              <button
                data-testid="pass-btn"
                onClick={() => handleSwipe("pass")}
                disabled={swiping}
                className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all disabled:opacity-50"
              >
                <X className="w-8 h-8 text-red-500" />
              </button>
              
              <button
                data-testid="like-btn"
                onClick={() => handleSwipe("like")}
                disabled={swiping}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 shadow-xl flex items-center justify-center hover:scale-110 hover:shadow-2xl transition-all disabled:opacity-50"
              >
                <Heart className="w-10 h-10 text-white fill-white" />
              </button>
            </div>
          </div>
        ) : (
          <div data-testid="no-more-users" className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12">
              <Heart className="w-20 h-20 text-white/50 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">لا يوجد المزيد من المستخدمين</h2>
              <p className="text-white/80 mb-8">تحقق لاحقاً للعثور على مطابقات جديدة</p>
              <Button
                onClick={() => navigate("/matches")}
                className="bg-white hover:bg-white/90 text-purple-600 px-8 py-6 rounded-full font-bold"
              >
                عرض المطابقات
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;