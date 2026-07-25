import { useEffect, useRef } from 'react';

const AudioPlayer = ({ audioBase64 }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioBase64) return;
    const src = `data:audio/mpeg;base64,${audioBase64}`;
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.play().catch(() => {
        // Autoplay blocked by browser — user interaction required
      });
    }
  }, [audioBase64]);

  return <audio ref={audioRef} style={{ display: 'none' }} />;
};

export default AudioPlayer;
