import { useNavigate } from "react-router-dom";
import { Heart, Users, User as UserIcon, MapPin, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("pizoo_token");
    setUser(null);
    toast.success("تم تسجيل الخروج بنجاح");
    navigate("/");
  };

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
              data-testid="nav-profile-btn"
              onClick={() => navigate("/profile")}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full px-6 py-5"
            >
              <UserIcon className="w-5 h-5" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
              <UserIcon className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {user.name}, {user.age}
            </h2>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{user.location}</span>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">البريد الإلكتروني</p>
              <p className="text-lg font-medium text-gray-800">{user.email}</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">الجنس</p>
              <p className="text-lg font-medium text-gray-800">{user.gender === "male" ? "ذكر" : "أنثى"}</p>
            </div>

            {user.bio && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">نبذة عني</p>
                <p className="text-lg text-gray-800">{user.bio}</p>
              </div>
            )}
          </div>

          {/* Logout */}
          <Button
            data-testid="logout-btn"
            onClick={handleLogout}
            className="w-full py-6 text-lg font-bold rounded-xl bg-red-500 hover:bg-red-600 text-white"
          >
            <LogOut className="w-5 h-5 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;