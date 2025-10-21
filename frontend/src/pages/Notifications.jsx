import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Users, User as UserIcon, Bell, Grid3x3, CreditCard, MessageCircle, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "../App";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

const Notifications = ({ user }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data);
    } catch (error) {
      toast.error("فشل تحميل الإشعارات");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast.success("تم تعليم الجميع كمقروء");
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    if (notification.type === "match") {
      navigate("/matches");
    } else if (notification.type === "message" && notification.data.match_id) {
      navigate(`/chat/${notification.data.match_id}`);
    } else if (notification.type === "like") {
      navigate("/likes-me");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "match":
        return <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />;
      case "message":
        return <MessageCircle className="w-6 h-6 text-purple-500" />;
      case "like":
        return <Heart className="w-6 h-6 text-red-500" />;
      default:
        return <Bell className="w-6 h-6 text-blue-500" />;
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
              className="bg-white/10 hover:bg-white/20 text-white rounded-full px-6 py-5"
            >
              <CreditCard className="w-5 h-5" />
            </Button>
            <Button
              data-testid="nav-notifications-btn"
              onClick={() => navigate("/notifications")}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full px-6 py-5"
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
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">الإشعارات</h2>
          {notifications.some(n => !n.read) && (
            <Button
              onClick={markAllAsRead}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full px-6 py-3"
            >
              <CheckCheck className="w-4 h-4 ml-2" />
              تعليم الكل كمقروء
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div data-testid="no-notifications" className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12">
              <Bell className="w-20 h-20 text-white/50 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">لا توجد إشعارات</h3>
              <p className="text-white/80">ستظهر الإشعارات هنا عندما تحصل على مطابقات أو رسائل</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                data-testid={`notification-${notification.id}`}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                  !notification.read ? "border-l-4 border-purple-500" : ""
                }`}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-gray-800 text-lg">{notification.title}</h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-sm text-gray-400">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: ar })}
                    </p>
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

export default Notifications;