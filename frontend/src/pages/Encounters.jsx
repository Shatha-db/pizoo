import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, X, MapPin, Users, User as UserIcon, Bell, Grid3x3, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "../App";
import { toast } from "sonner";

const Encounters = ({ user }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "swipe"

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

  const handleLike = async (userId) => {
    try {
      const response = await api.post("/swipes", {
        to_user_id: userId,
        action: "like",
      });

      if (response.data.is_match) {
        toast.success("🎉 مطابقة جديدة!");
      }

      // Remove from list
      setUsers(users.filter(u => u.id !== userId));
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
      setUsers(users.filter(u => u.id !== userId));
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
              className="bg-white/20 hover:bg-white/30 text-white rounded-full px-6 py-5"
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-white mb-6">الأشخاص القريبون</h2>

        {users.length === 0 ? (
          <div data-testid="no-users" className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12">
              <Heart className="w-20 h-20 text-white/50 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">لا يوجد مستخدمون جدد</h3>
              <p className="text-white/80">تحقق لاحقاً للعثور على مطابقات جديدة</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {users.map((displayUser) => (
              <div
                key={displayUser.id}
                data-testid={`user-card-${displayUser.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
                onClick={() => navigate(`/user/${displayUser.id}`)}
              >
                <div className="relative aspect-[3/4]">
                  <img
                    src={displayUser.photos?.[0] || "https://via.placeholder.com/300x400"}
                    alt={displayUser.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Online indicator */}
                  {displayUser.online && (
                    <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                  
                  {/* Verified badge */}
                  {displayUser.verified && (
                    <div className="absolute top-3 left-3">
                      <CheckCircle className="w-6 h-6 text-blue-500 fill-white" />
                    </div>
                  )}

                  {/* Interests */}
                  {displayUser.interests?.length > 0 && (
                    <div className="absolute bottom-16 left-3 right-3 flex flex-wrap gap-1">
                      {displayUser.interests.slice(0, 2).map((interest, idx) => (
                        <span
                          key={idx}
                          className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium"
                        >
                          #{interest}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* User Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <h3 className="text-white font-bold text-lg">
                      {displayUser.name}, {displayUser.age}
                    </h3>
                    <div className="flex items-center gap-1 text-white/90 text-sm">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{displayUser.location}</span>
                    </div>
                  </div>

                  {/* Action buttons on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePass(displayUser.id);
                      }}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <X className="w-6 h-6 text-red-500" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(displayUser.id);
                      }}
                      className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Heart className="w-7 h-7 text-white fill-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Encounters;