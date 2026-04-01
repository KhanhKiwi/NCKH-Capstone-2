import { useRef, useState, useEffect } from 'react';

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [showEnablePrompt, setShowEnablePrompt] = useState(false);
  const promptShownRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, []);

  // Show enable prompt once per page load
  useEffect(() => {
    if (!promptShownRef.current && !playing) {
      setShowEnablePrompt(true);
      promptShownRef.current = true;
    }
    if (playing) setShowEnablePrompt(false);
  }, [playing]);

  // Không tự động phát, chỉ phát khi người dùng nhấn nút



  return (
    <>
      <audio
        ref={audioRef}
        src={encodeURI('/mucsic/30 phút nhạc Lofi Chill không lời thư giãn nhẹ nhàng _.mp3')}
        loop
        preload="auto"
      />
      {showEnablePrompt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-gradient-to-b from-white to-[#fff7e6] rounded-2xl p-6 w-full max-w-lg text-center border border-[#e1caa0] shadow-2xl transform transition-all duration-300 animate-fade-in-up">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#f4e9d6] flex items-center justify-center border border-[#e1caa0] shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#b48a3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V6l12-3v12"></path>
                  <path d="M5 18h.01"></path>
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-extrabold text-[#4a3f2e]">Bật nhạc nền</h3>
                <p className="text-sm text-[#6b5a3f]">Âm nhạc nhẹ nhàng sẽ giúp trải nghiệm chơi mượt mà hơn.</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                className="px-6 py-2 bg-[#b48a3c] text-white rounded-full shadow hover:scale-105 transition-transform"
                onClick={async () => {
                  const audio = audioRef.current;
                  try {
                    audio?.load();
                    if (audio) audio.volume = 0.2;
                    await audio?.play();
                    setPlaying(true);
                    setShowEnablePrompt(false);
                  } catch (e) {
                    alert('Không thể phát nhạc: ' + (e instanceof Error ? e.message : 'Lỗi không xác định'));
                  }
                }}
              >
                Bật nhạc
              </button>
              <button
                className="px-5 py-2 bg-white border border-[#e1caa0] text-[#4a3f2e] rounded-full shadow"
                onClick={() => setShowEnablePrompt(false)}
              >
                Tắt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
