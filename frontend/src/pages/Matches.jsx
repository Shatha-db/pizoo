import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Users, User as UserIcon, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "../App";
import { toast } from "sonner";

const Matches = ({ user }) => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await api.get("/matches");
      setMatches(response.data);
    } catch (error) {
      toast.error("فشل تحميل المطابقات");
    } finally {
      setLoading(false);
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
              data-testid="nav-discover-btn"
              onClick={() => navigate("/discover")}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full px-6 py-5"
            >
              <Heart className="w-5 h-5" />
            </Button>
            <Button
              data-testid="nav-matches-btn"
              onClick={() => navigate("/matches")}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full px-6 py-5"
            >
              <Users className="w-5 h-5" />
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
        <h2 className="text-3xl font-bold text-white mb-8">مطابقاتك ({matches.length})</h2>

        {matches.length === 0 ? (
          <div data-testid="no-matches" className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12">
              <Users className="w-20 h-20 text-white/50 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">لا توجد مطابقات بعد</h3>
              <p className="text-white/80 mb-8">ابدأ بالسوايب للعثور على مطابقات جديدة</p>
              <Button
                onClick={() => navigate("/discover")}
                className="bg-white hover:bg-white/90 text-purple-600 px-8 py-6 rounded-full font-bold"
              >
                ابدأ الاكتشاف
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {matches.map((match) => (
              <div
                key={match.match_id}
                data-testid={`match-card-${match.match_id}`}
                onClick={() => navigate(`/chat/${match.match_id}`)}
                className="bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer hover:scale-105"
              >
                <div className="flex gap-4 p-5">
                  {/* Photo */}
                  <div className="relative">
                    <img
                      src={match.user.photos?.[0] || "https://via.placeholder.com/100"}
                      alt={match.user.name}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {match.user.name}, {match.user.age}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{match.user.location}</span>
                    </div>
                    {match.last_message ? (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {match.last_message.content}
                      </p>
                    ) : (
                      <div className="flex items-center gap-2 text-purple-600 text-sm font-medium">
                        <MessageCircle className="w-4 h-4" />
                        <span>ابدأ المحادثة</span>
                      </div>
                    )}
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

export default Matches;