import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "../App";
import { toast } from "sonner";

const Chat = ({ user }) => {
  const navigate = useNavigate();
  const { matchId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMatch();
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [matchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMatch = async () => {
    try {
      const response = await api.get("/matches");
      const match = response.data.find((m) => m.match_id === matchId);
      if (match) {
        setOtherUser(match.user);
      }
    } catch (error) {
      toast.error("فشل تحميل بيانات المطابقة");
    }
  };

  const loadMessages = async () => {
    try {
      const response = await api.get(`/messages/${matchId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await api.post("/messages", {
        match_id: matchId,
        content: newMessage,
      });
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      toast.error("فشل إرسال الرسالة");
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
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <header className="py-4 px-6 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            data-testid="back-btn"
            onClick={() => navigate("/matches")}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          {otherUser && (
            <div className="flex items-center gap-3 flex-1">
              <img
                src={otherUser.photos?.[0] || "https://via.placeholder.com/50"}
                alt={otherUser.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
              />
              <div>
                <h2 className="text-white font-bold text-lg">{otherUser.name}</h2>
                <p className="text-white/80 text-sm">{otherUser.location}</p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div data-testid="no-messages" className="text-center py-20">
              <Heart className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white/80 text-lg">ابدأ المحادثة وقل مرحباً!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === user.id;
              return (
                <div
                  key={msg.id}
                  data-testid={`message-${msg.id}`}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-5 py-3 rounded-2xl ${
                      isMe
                        ? "bg-gradient-to-br from-purple-600 to-pink-500 text-white"
                        : "bg-white/95 text-gray-800"
                    }`}
                  >
                    <p className="break-words">{msg.content}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/10 backdrop-blur-lg border-t border-white/20 p-4">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-3">
          <Input
            data-testid="message-input"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالة..."
            className="flex-1 bg-white/95 border-0 rounded-full px-6 py-6 text-lg"
          />
          <Button
            data-testid="send-btn"
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-full px-8 py-6 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;