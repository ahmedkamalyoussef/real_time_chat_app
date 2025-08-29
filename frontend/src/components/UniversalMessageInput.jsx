import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, X } from "lucide-react";
import TextAndImageInput from "./chatContainer/messageInput/TextAndImageInput";
import ImagePreview from "./chatContainer/messageInput/ImagePreview";

function UniversalMessageInput({ sendMessage, onTyping, onStopTyping, disabled = false }) {
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const isCancelledRef = useRef(false);
  const visualizerRef = useRef(null);
  const [barCount, setBarCount] = useState(20);

  useEffect(() => {
    if (!recording || !visualizerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (visualizerRef.current) {
        const containerWidth = visualizerRef.current.offsetWidth;
        const newBarCount = Math.floor(containerWidth / 8); // 8px per bar (w-1 + gap-1)
        setBarCount(newBarCount > 0 ? newBarCount : 1);
      }
    });

    resizeObserver.observe(visualizerRef.current);

    // Initial calculation
    const containerWidth = visualizerRef.current.offsetWidth;
    const newBarCount = Math.floor(containerWidth / 8);
    setBarCount(newBarCount > 0 ? newBarCount : 1);

    return () => resizeObserver.disconnect();
  }, [recording]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (e.target.value.trim() && onTyping) {
      onTyping();
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim() && !imagePreview) return;
    await sendMessage({ content: content.trim(), media: imagePreview, type: imagePreview ? "image" : "text" });
    setContent("");
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      isCancelledRef.current = false;
      if (onTyping) onTyping("recording");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const options = { mimeType: 'audio/webm;codecs=opus' };
      mediaRecorderRef.current = new MediaRecorder(stream, MediaRecorder.isTypeSupported(options.mimeType) ? options : { mimeType: 'audio/webm' });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        if (onStopTyping) onStopTyping();
        if (!isCancelledRef.current) {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const reader = new FileReader();
          reader.onloadend = async () => await sendMessage({ content: "", media: reader.result, type: "audio" });
          reader.readAsDataURL(audioBlob);
        }
        audioChunksRef.current = [];
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch (e) {
      console.error("Error starting recording:", e);
      if (onStopTyping) onStopTyping();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && recording) {
      isCancelledRef.current = true;
      mediaRecorderRef.current.stop();
      setRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (disabled) return null;

  return (
    <div className="p-4 border-t bg-base-100">
      <ImagePreview imagePreview={imagePreview} removeImage={() => setImagePreview(null)} />
      <form onSubmit={handleSendMessage} className="flex items-end gap-3">
        {!recording ? (
          <div className="flex-1">
            <TextAndImageInput
              content={content}
              handleContentChange={handleContentChange}
              fileInputRef={fileInputRef}
              handleImageChange={handleImageChange}
              imagePreview={imagePreview}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center gap-3 bg-base-200 rounded-full px-4 py-2">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-red-500 p-2 rounded-full"><Mic className="w-4 h-4 text-white" /></div>
            </div>
            <div ref={visualizerRef} className="flex items-center gap-1 flex-1 h-6">
              {[...Array(barCount)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full"
                  style={{
                    height: `${Math.random() * 75 + 25}%`,
                    animation: `pulse 0.4s ease-in-out infinite alternate ${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-base-content">{formatTime(recordingTime)}</span>
            <button type="button" onClick={cancelRecording} className="btn btn-circle btn-sm btn-ghost text-red-500 hover:bg-red-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {!recording ? (
            (content.trim() || imagePreview) ? (
              <button type="submit" className="btn btn-circle btn-primary"><Send className="w-5 h-5" /></button>
            ) : (
              <button type="button" onClick={startRecording} className="btn btn-circle btn-primary"><Mic className="w-5 h-5" /></button>
            )
          ) : (
            <button type="button" onClick={stopRecording} className="btn btn-circle btn-primary"><Send className="w-5 h-5" /></button>
          )}
        </div>
      </form>
    </div>
  );
}

export default UniversalMessageInput;