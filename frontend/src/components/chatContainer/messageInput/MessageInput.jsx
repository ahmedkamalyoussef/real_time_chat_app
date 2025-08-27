import React, { useState, useRef } from "react";
import { Send, Mic, X } from "lucide-react";
import { useChatStore } from "../../../store/useChatStore";
import TextAndImageInput from "./TextAndImageInput";
import ImagePreview from "./ImagePreview";

function MessageInput() {
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  // Add a new ref to track if recording was cancelled
  const isCancelledRef = useRef(false);

  const typingTimeoutRef = useRef(null);
  const { sendMessage, doSomething, selectedFriend } = useChatStore();

  const handleContentChange = (e) => {
    setContent(e.target.value);

    // Only trigger typing indicator if there's a selected friend
    if (e.target.value.trim() && selectedFriend) {
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      doSomething("typing");

      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        doSomething("stop-typing");
      }, 500);
    }
  };

  // 🟢 إرسال رسالة (نص / صورة)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim() && !imagePreview) return;

    await sendMessage({
      content: content.trim(),
      media: imagePreview,
      type: imagePreview ? "image" : "text",
    });

    setContent("");
    setImagePreview(null);
  };

  // 🟢 عند اختيار صورة
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // 🟢 بدء التسجيل
  const startRecording = async () => {
    try {
      // Reset cancelled state
      isCancelledRef.current = false;

      // Clear any existing typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Send recording indicator (without dots)
      doSomething("recording");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // استخدم webm للتوافق الأفضل
      const options = { mimeType: 'audio/webm;codecs=opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'audio/webm';
      }

      mediaRecorderRef.current = new MediaRecorder(stream, options);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        // Only process and send if not cancelled
        if (!isCancelledRef.current) {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const reader = new FileReader();

          doSomething("stop-recording");
          reader.onloadend = async () => {
            await sendMessage({
              content: "",
              media: reader.result,
              type: "audio",
            });
          };

          reader.readAsDataURL(audioBlob);
        }

        // Clear chunks regardless
        audioChunksRef.current = [];

        // Stop stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setRecordingTime(0);

      // بدء العداد
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Error starting recording:", error);
      // Stop recording indicator in case of error
      doSomething("stop-recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && recording) {
      // Set cancelled flag before stopping
      isCancelledRef.current = true;

      mediaRecorderRef.current.stop();
      setRecording(false);
      clearInterval(timerRef.current);
      setRecordingTime(0);

      // Stop recording indicator
      doSomething("stop-recording");

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  // تنسيق الوقت
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 border-t bg-base-100">
      {/* لو في صورة مختارة */}
      <ImagePreview imagePreview={imagePreview} removeImage={() => setImagePreview(null)} />

      <form onSubmit={handleSendMessage} className="flex items-end gap-3">
        {/* لو مش بيسجل - اظهر الـ input العادي */}
        {!recording && (
          <div className="flex-1">
            <TextAndImageInput
              content={content}
              handleContentChange={(e) => handleContentChange(e)}
              fileInputRef={fileInputRef}
              handleImageChange={handleImageChange}
              imagePreview={imagePreview}
            />
          </div>
        )}

        {/* لو بيسجل - اظهر واجهة التسجيل */}
        {recording && (
          <div className="flex-1 flex items-center gap-3 bg-base-200 rounded-full px-4 py-2">
            {/* أيقونة الميك المتحركة */}
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-red-500 p-2 rounded-full">
                <Mic className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* الموجات الصوتية المتحركة */}
            <div className="flex items-center gap-1 flex-1">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full"
                  style={{
                    height: `${Math.random() * 20 + 10}px`,
                    animation: `pulse 0.5s infinite ${i * 0.1}s`,
                  }}
                />
              ))}
            </div>

            {/* عرض الوقت */}
            <span className="text-sm font-medium text-base-content">
              {formatTime(recordingTime)}
            </span>

            {/* زر الحذف */}
            <button
              type="button"
              onClick={cancelRecording}
              className="btn btn-circle btn-sm btn-ghost text-red-500 hover:bg-red-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* الأزرار */}
        <div className="flex items-center gap-2">
          {!recording ? (
            <>
              {/* لو في نص أو صورة - اظهر زر الإرسال */}
              {(content.trim() || imagePreview) ? (
                <button
                  type="submit"
                  className="btn btn-circle btn-primary"
                >
                  <Send className="w-5 h-5" />
                </button>
              ) : (
                /* لو مافيش حاجة - اظهر زر التسجيل */
                <button
                  type="button"
                  onClick={startRecording}
                  className="btn btn-circle btn-primary"
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}
            </>
          ) : (
            /* أثناء التسجيل - زر الإرسال */
            <button
              type="button"
              onClick={stopRecording}
              className="btn btn-circle btn-primary"
            >
              <Send className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default MessageInput;







