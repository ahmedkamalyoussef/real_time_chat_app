import { Play, Pause } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const MessageItem = ({ message, authUser }) => {
  const isOwnMessage = message.senderId === authUser._id;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // تحديث الوقت أثناء التشغيل
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // عند تحميل البيانات
  const handleLoadedData = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // عند انتهاء التشغيل
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // تشغيل/إيقاف الصوت
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // تنسيق الوقت
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // حساب النسبة المئوية للتقدم
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="chat-bubble max-w-xs">
      {/* Text message */}
      {message.type === "text" && <p>{message.content}</p>}

      {/* Image message */}
      {message.type === "image" && (
        <img
          src={message.media}
          alt="sent"
          className="rounded-lg max-w-[200px]"
        />
      )}

      {/* Audio message - استخدام الـ UI الجديد المبسط */}
      {message.type === "audio" && (
        <div className="flex items-center min-w-[200px] gap-2">
          {/* الصوت المخفي */}
          <audio
            ref={audioRef}
            src={message.media}
            onTimeUpdate={handleTimeUpdate}
            onLoadedData={handleLoadedData}
            onEnded={handleEnded}
            preload="metadata"
          />

          {/* زر التشغيل/الإيقاف */}
          <button
            onClick={togglePlayPause}
            className="btn btn-circle btn-sm"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>

          {/* شريط التقدم */}
          <div className="w-full bg-gray-200 rounded-lg h-2 relative flex-1">
            <div 
              className="bg-blue-500 h-2 rounded-lg transition-all duration-100" 
              style={{ width: `${progressPercentage}%` }} 
            />
          </div>

          {/* عرض الوقت */}
          <span className="text-xs text-gray-500">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageItem;