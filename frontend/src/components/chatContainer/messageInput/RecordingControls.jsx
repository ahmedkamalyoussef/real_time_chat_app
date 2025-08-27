import { useEffect, useState } from "react";

// في RecordingControls.jsx
const RecordingControls = ({ stopRecording, cancelRecording }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="flex items-center gap-3 w-full px-4 py-2 bg-base-200 rounded-lg shadow-inner">
      {/* Recording indicator */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-8 h-8 rounded-full bg-red-500 opacity-30 animate-ping"></div>
        <div className="w-3 h-3 rounded-full bg-red-500 z-10"></div>
      </div>

      {/* Timer */}
      <div className="flex-1">
        <span className="text-lg font-mono text-red-500">{formatTime(seconds)}</span>
        <p className="text-xs text-base-content/60">Recording...</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={stopRecording}
          className="btn btn-sm btn-success"
        >
          Send
        </button>
        <button
          onClick={cancelRecording}
          className="btn btn-sm btn-error"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RecordingControls;
