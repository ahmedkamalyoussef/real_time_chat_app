import React, { useState, useRef } from "react";
import { Send, Mic, X } from "lucide-react";
import { useGroupChatStore } from "../../store/useGroupChatStore";
import TextAndImageInput from "../chatContainer/messageInput/TextAndImageInput";
import ImagePreview from "../chatContainer/messageInput/ImagePreview";

function GroupMessageInput() {
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

  const { sendGroupMessage, selectedGroup } = useGroupChatStore();

  const handleContentChange = (e) => setContent(e.target.value);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim() && !imagePreview) return;
    await sendGroupMessage({
      content: content.trim(),
      media: imagePreview,
      type: imagePreview ? "image" : "text",
    });
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const options = { mimeType: 'audio/webm;codecs=opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'audio/webm';
      }
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        if (!isCancelledRef.current) {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const reader = new FileReader();
          reader.onloadend = async () => {
            await sendGroupMessage({ content: "", media: reader.result, type: "audio" });
          };
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
      console.error(e);
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
      isCancelledRef.current = true;
      mediaRecorderRef.current.stop();
      setRecording(false);
      clearInterval(timerRef.current);
      setRecordingTime(0);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!selectedGroup) return null;

  return (
    <div className="p-4 border-t bg-base-100">
      <ImagePreview imagePreview={imagePreview} removeImage={() => setImagePreview(null)} />
      <form onSubmit={handleSendMessage} className="flex items-end gap-3">
        {!recording && (
          <div className="flex-1">
            <TextAndImageInput
              content={content}
              handleContentChange={handleContentChange}
              fileInputRef={fileInputRef}
              handleImageChange={handleImageChange}
              imagePreview={imagePreview}
            />
          </div>
        )}

        {recording && (
          <div className="flex-1 flex items-center gap-3 bg-base-200 rounded-full px-4 py-2">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-red-500 p-2 rounded-full">
                <Mic className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1 flex-1">
              {[...Array(40)].map((_, i) => (
                <div key={i} className="w-1 bg-primary rounded-full" style={{ height: `${Math.random() * 20 + 10}px`, animation: `pulse 0.5s infinite ${i * 0.1}s` }} />
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
              <button type="submit" className="btn btn-circle btn-primary">
                <Send className="w-5 h-5" />
              </button>
            ) : (
              <button type="button" onClick={startRecording} className="btn btn-circle btn-primary">
                <Mic className="w-5 h-5" />
              </button>
            )
          ) : (
            <button type="button" onClick={stopRecording} className="btn btn-circle btn-primary">
              <Send className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default GroupMessageInput;
