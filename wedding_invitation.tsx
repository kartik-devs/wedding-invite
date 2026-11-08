import React, { useState, useEffect, useRef } from 'react';

// --- Assets & Icons ---
import { MapPin, Calendar, Clock, ChevronRight, Heart, ExternalLink, Volume2, VolumeX } from 'lucide-react';

// --- Video & Audio Assets ---
const PORTRAIT_VIDEO = "./gemini_generated_video_87da8ed6.mp4";
const LANDSCAPE_VIDEO = "./gemini_generated_video_59f518db.mp4";
const MANTRA_AUDIO = "./ganesha_mantra.mp3";

// --- Styling Injection ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');

  :root {
    --bg-cream: #FDFBF7;
    --text-dark: #333333;
    --text-muted: #666666;
    --accent-red: #8B1E28;
    --accent-gold: #C4A47C;
  }

  body {
    background-color: var(--bg-cream);
    color: var(--text-dark);
    font-family: 'Playfair Display', serif;
    overflow-x: hidden;
    margin: 0;
    padding: 0;
  }

  .font-script {
    font-family: 'Alex Brush', cursive;
  }

  .text-shadow-sm {
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  }
  
  .text-shadow-md {
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }

  /* Petal Animation */
  .petal {
    position: fixed;
    top: -10vh;
    transform: translateZ(0);
    animation: fall linear forwards;
    pointer-events: none;
    z-index: 50;
  }

  @keyframes fall {
    0% {
      transform: translate3d(0, 0, 0) rotate(0deg) scale(0.5);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translate3d(var(--end-x), 110vh, 0) rotate(var(--end-rotation)) scale(var(--scale));
      opacity: 0;
    }
  }

  /* Smooth scroll behavior */
  html {
    scroll-behavior: smooth;
  }

  /* Custom Input Styles */
  .custom-input {
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--accent-gold);
    border-radius: 0;
    padding: 0.5rem 0;
    color: var(--text-dark);
    font-family: 'Playfair Display', serif;
  }
  .custom-input:focus {
    outline: none;
    border-bottom-color: var(--accent-red);
  }
  
  .polaroid {
    background: white;
    padding: 10px 10px 25px 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
  }
  .polaroid:hover {
    transform: scale(1.02) rotate(-1deg);
  }

  /* Hide scrollbar for gallery */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  /* Cutout Animations */
  .chibi-cutout {
    filter: drop-shadow(4px 8px 12px rgba(0,0,0,0.3));
    transition: transform 0.3s ease;
  }
  .chibi-cutout:hover {
    transform: scale(1.05) translateY(-5px);
  }
  
  .slide-in-left {
    animation: slideLeft 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }
  .slide-in-right {
    animation: slideRight 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }
  
  @keyframes slideLeft {
    0% { transform: translateX(-100vw) rotate(-10deg); opacity: 0; }
    100% { transform: translateX(0) rotate(0deg); opacity: 1; }
  }
  @keyframes slideRight {
    0% { transform: translateX(100vw) rotate(10deg); opacity: 0; }
    100% { transform: translateX(0) rotate(0deg); opacity: 1; }
  }

  .pulse-gold {
    animation: pulseGold 2.2s infinite ease-in-out;
  }
  @keyframes pulseGold {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(196, 164, 124, 0.4);
    }
    50% {
      transform: scale(1.03);
      box-shadow: 0 0 20px 4px rgba(196, 164, 124, 0.6);
    }
  }
`;

// --- Components ---

const OrnateDivider = () => (
  <div className="flex justify-center items-center my-8 opacity-80">
    <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 20 L50 20 M150 20 L190 20" stroke="#C4A47C" strokeWidth="1" />
      <circle cx="100" cy="20" r="4" fill="#8B1E28" />
      <path d="M85 20 Q92.5 10 100 20 Q107.5 30 115 20" stroke="#C4A47C" strokeWidth="1" fill="none" />
      <path d="M85 20 Q92.5 30 100 20 Q107.5 10 115 20" stroke="#C4A47C" strokeWidth="1" fill="none" />
    </svg>
  </div>
);

const Petals = () => {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    // Generate static petal SVGs
    const petalSVG = `data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" fill="%23e8b4b8" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8 2 4 6 4 12C4 18 12 22 12 22C12 22 20 18 20 12C20 6 16 2 12 2Z"/></svg>`;
    
    const newPetals = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      animationDuration: `${10 + Math.random() * 15}s`,
      animationDelay: `${Math.random() * 10}s`,
      '--end-x': `${(Math.random() - 0.5) * 50}vw`,
      '--end-rotation': `${Math.random() * 720}deg`,
      '--scale': `${0.3 + Math.random() * 0.7}`,
      backgroundImage: `url('${petalSVG}')`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      width: '20px',
      height: '20px',
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {petals.map((style) => (
        <div key={style.id} className="petal" style={style} />
      ))}
    </div>
  );
};

const ScratchCard = ({ revealText }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Set internal canvas resolution based on display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Fill with textured maroon color
    ctx.fillStyle = '#8B1E28';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some noise/texture
    for(let i = 0; i < 2000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#7a1922' : '#9c232f';
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }

    // Add 'Scratch Here' text
    ctx.font = "italic 1.2rem 'Playfair Display'";
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch to reveal", canvas.width / 2, canvas.height / 2);

  }, []);

  const getPointerPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handlePointerDown = (e) => {
    if (isRevealed) return;
    setIsDrawing(true);
    scratch(e);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    checkReveal();
  };

  const handlePointerMove = (e) => {
    if (!isDrawing || isRevealed) return;
    // Prevent scrolling while scratching on touch devices
    if(e.cancelable) e.preventDefault(); 
    scratch(e);
  };

  const scratch = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPointerPos(e);
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
    ctx.fill();
  };

  const checkReveal = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    // Check alpha channel of pixels
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }

    const totalPixels = pixels.length / 4;
    const percentErased = (transparentPixels / totalPixels) * 100;

    if (percentErased > 40) { // If 40% erased, reveal completely
      setIsRevealed(true);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-md h-40 mx-auto rounded-lg overflow-hidden shadow-lg select-none"
      style={{ touchAction: 'none' }} // Crucial for smooth touch scratching
    >
      {/* Revealed Content underneath */}
      <div className="absolute inset-0 bg-[#F5EEDC] flex flex-col items-center justify-center p-4 text-center border-2 border-[#C4A47C]">
        <p className="text-sm font-semibold tracking-widest text-[#666] mb-2 uppercase">Friday</p>
        <p className="text-2xl md:text-3xl text-[#8B1E28] font-bold mb-1">13 November 2026</p>
        <p className="font-script text-2xl text-[#C4A47C]">Our forever begins</p>
      </div>

      {/* Canvas on top */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full cursor-crosshair transition-opacity duration-1000 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
        onTouchMove={handlePointerMove}
      />
    </div>
  );
};

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    } else {
        timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const TimeBox = ({ value, label }) => (
    <div className="flex flex-col items-center mx-1 md:mx-3">
      <div className="bg-[#8B1E28] text-[#FDFBF7] rounded shadow-md w-14 h-16 md:w-20 md:h-24 flex items-center justify-center relative overflow-hidden border border-[#C4A47C]/30">
         {/* Inner highlight line for depth */}
         <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/20"></div>
        <span className="text-2xl md:text-4xl font-semibold z-10">{String(value).padStart(2, '0')}</span>
      </div>
      <span className="text-[10px] md:text-xs tracking-[0.2em] mt-3 text-[#666] uppercase">{label}</span>
    </div>
  );

  return (
    <div className="flex justify-center items-center my-6">
      <TimeBox value={timeLeft.days || 0} label="Days" />
      <TimeBox value={timeLeft.hours || 0} label="Hours" />
      <TimeBox value={timeLeft.minutes || 0} label="Minutes" />
      <TimeBox value={timeLeft.seconds || 0} label="Seconds" />
    </div>
  );
};

// --- Main Application Component ---

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [introStage, setIntroStage] = useState<'idle' | 'playing' | 'fading_to_white' | 'revealing_ui' | 'done'>('idle');
  const [showCard, setShowCard] = useState(false);
  const [isPlayingMantra, setIsPlayingMantra] = useState(false);

  const [isPortrait, setIsPortrait] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia ? window.matchMedia('(orientation: portrait)').matches : window.innerHeight > window.innerWidth;
    }
    return false;
  });

  const portraitVideoRef = useRef<HTMLVideoElement | null>(null);
  const landscapeVideoRef = useRef<HTMLVideoElement | null>(null);
  const mantraAudioRef = useRef<HTMLAudioElement | null>(null);

  const [rsvpData, setRsvpData] = useState({ name: '', guests: 1, events: [] });
  const [wishData, setWishData] = useState({ name: '', message: '' });

  // Add styles to head
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);
    return () => { document.head.removeChild(styleSheet); }
  }, []);

  // Show Lord Ganesha alone for the first 2 seconds, then smoothly reveal the invitation card
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCard(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Track orientation changes
  useEffect(() => {
    const handleOrientation = () => {
      const portrait = window.matchMedia ? window.matchMedia('(orientation: portrait)').matches : window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);
    };

    handleOrientation();
    window.addEventListener('resize', handleOrientation);
    window.addEventListener('orientationchange', handleOrientation);

    const mql = window.matchMedia ? window.matchMedia('(orientation: portrait)') : null;
    if (mql?.addEventListener) {
      mql.addEventListener('change', handleOrientation);
    }

    return () => {
      window.removeEventListener('resize', handleOrientation);
      window.removeEventListener('orientationchange', handleOrientation);
      if (mql?.removeEventListener) {
        mql.removeEventListener('change', handleOrientation);
      }
    };
  }, []);

  // Sync playback time if orientation changes while playing
  useEffect(() => {
    if (introStage === 'playing') {
      const activeVideo = isPortrait ? portraitVideoRef.current : landscapeVideoRef.current;
      const prevVideo = isPortrait ? landscapeVideoRef.current : portraitVideoRef.current;
      if (activeVideo && prevVideo && !prevVideo.paused) {
        const currentTime = prevVideo.currentTime;
        prevVideo.pause();
        activeVideo.currentTime = currentTime;
        activeVideo.muted = true;
        activeVideo.play().catch(() => {});
      }
    }
  }, [isPortrait, introStage]);

  // Force render first frame on load
  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const vid = e.currentTarget;
    if (vid.currentTime === 0) {
      vid.currentTime = 0.001;
    }
  };

  // Start video and Ganesha Mantra on Click, Tap or Enter
  const handleStartIntro = () => {
    if (introStage !== 'idle') return;
    setIntroStage('playing');

    // Start background Ganesha Mantra
    if (mantraAudioRef.current) {
      mantraAudioRef.current.volume = 0.7;
      mantraAudioRef.current.play().then(() => {
        setIsPlayingMantra(true);
      }).catch((err) => {
        console.warn("Mantra playback waiting for user interaction:", err);
      });
    }

    // Play active video (muted so mantra is the clear, sacred soundtrack)
    const activeVideo = isPortrait ? portraitVideoRef.current : landscapeVideoRef.current;
    if (activeVideo) {
      activeVideo.muted = true;
      activeVideo.volume = 0;
      activeVideo.currentTime = 0;
      activeVideo.play().catch(() => {});
    }
  };

  // Transition to complete white and then load the main UI
  const triggerWhiteTransition = () => {
    if (introStage === 'fading_to_white' || introStage === 'revealing_ui' || introStage === 'done') return;
    setIntroStage('fading_to_white');

    // Fade to solid white over 800ms
    setTimeout(() => {
      setHasStarted(true);
      window.scrollTo(0, 0);

      portraitVideoRef.current?.pause();
      landscapeVideoRef.current?.pause();

      setIntroStage('revealing_ui');

      setTimeout(() => {
        setIntroStage('done');
      }, 800);
    }, 800);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const vid = e.currentTarget;
    if (vid.duration && vid.currentTime >= vid.duration - 0.35) {
      triggerWhiteTransition();
    }
  };

  const handleVideoEnded = () => {
    triggerWhiteTransition();
  };

  // Keyboard shortcut listener: Enter key to start or skip to main UI
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (introStage === 'idle') {
          e.preventDefault();
          handleStartIntro();
        } else if (introStage === 'playing') {
          e.preventDefault();
          triggerWhiteTransition();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [introStage, isPortrait]);

  const toggleMantra = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!mantraAudioRef.current) return;
    if (isPlayingMantra) {
      mantraAudioRef.current.pause();
      setIsPlayingMantra(false);
    } else {
      mantraAudioRef.current.play().then(() => {
        setIsPlayingMantra(true);
      }).catch(() => {});
    }
  };

  const toggleEvent = (eventName) => {
    setRsvpData(prev => ({
      ...prev,
      events: prev.events.includes(eventName) 
        ? prev.events.filter(e => e !== eventName)
        : [...prev.events, eventName]
    }));
  };

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    console.log("RSVP Submitted:", rsvpData);
    alert("Thank you for your RSVP!");
    setRsvpData({ name: '', guests: 1, events: [] });
  };

  const handleWishSubmit = (e) => {
    e.preventDefault();
    console.log("Wish Submitted:", wishData);
    alert("Your wish has been saved!");
    setWishData({ name: '', message: '' });
  };

  return (
    <div className={`relative min-h-screen ${!hasStarted ? 'h-screen overflow-hidden' : ''}`}>
      <Petals />

      {/* --- Ganesha Mantra Audio Background --- */}
      <audio
        ref={mantraAudioRef}
        src={MANTRA_AUDIO}
        loop
        preload="auto"
      />

      {/* --- Floating Mantra Audio Controller (Persistent across Intro and Main UI) --- */}
      <div className="fixed top-5 right-5 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleMantra}
          className="group flex items-center gap-2 bg-[#8B1E28]/90 hover:bg-[#8B1E28] text-white px-3.5 py-2 rounded-full border border-[#C4A47C]/60 shadow-lg backdrop-blur-md transition-all duration-300 cursor-pointer"
          title={isPlayingMantra ? "Pause Ganesha Mantra" : "Play Ganesha Mantra"}
        >
          {isPlayingMantra ? (
            <>
              <Volume2 className="w-4 h-4 text-[#EAE0D5] animate-pulse" />
              <span className="text-[11px] uppercase tracking-widest font-sans pr-1 hidden sm:inline text-[#EAE0D5]">Mantra On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-white/70" />
              <span className="text-[11px] uppercase tracking-widest font-sans pr-1 hidden sm:inline text-white/80">Play Mantra</span>
            </>
          )}
        </button>

        {introStage === 'playing' && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerWhiteTransition();
            }}
            className="bg-black/50 hover:bg-black/80 backdrop-blur-md text-white text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Skip</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* --- Intro Video Section (First Frame -> Play on Click/Tap/Enter -> White Transition) --- */}
      {introStage !== 'done' && (
        <div 
          onClick={introStage === 'idle' ? handleStartIntro : undefined}
          className={`fixed inset-0 z-40 bg-black flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ${
            introStage === 'revealing_ui' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Portrait Video (gemini_generated_video_87da8ed6.mp4) */}
          <video 
            ref={portraitVideoRef}
            src={PORTRAIT_VIDEO}
            preload="auto"
            playsInline
            muted
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleVideoEnded}
            onTimeUpdate={handleTimeUpdate}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isPortrait ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
          />

          {/* Landscape Video (gemini_generated_video_59f518db.mp4) */}
          <video 
            ref={landscapeVideoRef}
            src={LANDSCAPE_VIDEO}
            preload="auto"
            playsInline
            muted
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleVideoEnded}
            onTimeUpdate={handleTimeUpdate}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              !isPortrait ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
          />

          {/* Dark Vignette Overlay on Idle (starts hidden for 2s so Ganesha is fully seen, then fades in) */}
          <div 
            className={`absolute inset-0 z-20 bg-gradient-to-b from-black/55 via-black/25 to-black/65 transition-opacity duration-1000 ${
              introStage === 'idle' && showCard ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />

          {/* Hero Content on Idle State (Waits 2s so Ganesha is seen alone first, then glides in) */}
          <div 
            className={`relative z-20 text-center p-6 md:p-10 max-w-xl mx-4 bg-black/30 backdrop-blur-[2px] rounded-2xl border border-white/20 transition-all duration-1000 transform ${
              introStage === 'idle' && showCard 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
            }`}
          >
            <p className="text-[#FDFBF7] tracking-[0.3em] text-xs md:text-sm mb-3 uppercase">A Celebration of Love</p>
            <h1 className="font-script text-5xl sm:text-6xl md:text-8xl text-white mb-2 text-shadow-md">Kartik & Karishma</h1>
            <p className="text-[#FDFBF7] italic text-base md:text-xl mb-8 font-light">An invitation to love.</p>
            
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleStartIntro();
              }}
              className="pulse-gold group bg-[#8B1E28]/95 hover:bg-[#8B1E28] text-white px-8 py-3.5 rounded-full uppercase tracking-[0.2em] text-xs md:text-sm transition-all duration-300 flex items-center justify-center mx-auto border border-[#C4A47C]/50 hover:border-[#C4A47C] shadow-xl cursor-pointer"
            >
              <span>Tap to Enter</span>
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-5 flex items-center justify-center gap-2 text-[#EAE0D5]/75 text-xs tracking-wider">
              <span>Click, tap anywhere or press</span>
              <kbd className="px-2 py-0.5 rounded bg-white/15 border border-white/30 text-[11px] font-mono text-white">Enter ↵</kbd>
            </div>
          </div>
        </div>
      )}

      {/* --- Cinematic Pure White Transition Curtain --- */}
      {(introStage === 'fading_to_white' || introStage === 'revealing_ui') && (
        <div 
          className="fixed inset-0 z-50 bg-white pointer-events-none transition-opacity ease-in-out"
          style={{
            transitionDuration: '800ms',
            opacity: introStage === 'fading_to_white' ? 1 : 0
          }}
        />
      )}

      {/* --- Main Content (Hidden initially, fades into view) --- */}
      <div 
        id="invitation-content" 
        className={`relative z-10 transition-opacity duration-1000 ${hasStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="bg-[#FDFBF7] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] relative z-20">
          
          {/* Section: Invitation Details */}
          <section className="py-20 px-6 max-w-4xl mx-auto text-center">
            <OrnateDivider />
            <p className="tracking-widest text-[#666] text-sm uppercase mb-8">Together with our families</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#333] mb-6">We Joyfully Invite You</h2>
            <p className="italic text-[#666] mb-8">to celebrate the wedding of</p>
            
            <div className="flex flex-col items-center justify-center mb-12">
              <span className="font-script text-5xl md:text-7xl text-[#8B1E28] mb-2">Kartik</span>
              <span className="text-[#C4A47C] font-script text-3xl my-2">&</span>
              <span className="font-script text-5xl md:text-7xl text-[#8B1E28] mt-2">Karishma</span>
            </div>

            <p className="tracking-widest text-[#666] text-xs uppercase mb-8">With the blessings of</p>
            <div className="flex flex-col md:flex-row justify-center items-start gap-10 md:gap-24 text-[#444] mb-8">
              {/* Kartik's Family */}
              <div className="text-center space-y-4">
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-[#C4A47C] font-semibold mb-1">Grandparents</p>
                  <p className="font-semibold text-base mb-0.5">Late Shri Bishan Singh Rana</p>
                  <p className="text-sm text-[#555]">& Smt. Rama Rana</p>
                </div>
                <div className="w-12 h-[1px] bg-[#C4A47C]/30 mx-auto"></div>
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-[#C4A47C] font-semibold mb-1">Parents</p>
                  <p className="font-semibold text-base mb-0.5">Shri Pawan Rana</p>
                  <p className="text-sm text-[#555]">& Smt. Shivani Rana</p>
                </div>
              </div>

              {/* Karishma's Family */}
              <div className="text-center space-y-4">
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-[#C4A47C] font-semibold mb-1">Grandparents</p>
                  <p className="font-semibold text-base mb-0.5">Shri Harish Bhatia</p>
                  <p className="text-sm text-[#555]">& Smt. Prem Bhatia</p>
                </div>
                <div className="w-12 h-[1px] bg-[#C4A47C]/30 mx-auto"></div>
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-[#C4A47C] font-semibold mb-1">Parents</p>
                  <p className="font-semibold text-base mb-0.5">Late Shri Rakesh Bhatia</p>
                  <p className="text-sm text-[#555]">& Late Smt. Minakshi Bhatia</p>
                </div>
              </div>
            </div>
            <p className="italic text-[#666]">and our loving families</p>
            <OrnateDivider />
          </section>

          {/* Section: Date Reveal */}
          <section className="py-16 px-6 bg-[#FAF6F0] text-center border-y border-[#EAE0D5]">
            <p className="tracking-widest text-[#888] text-xs uppercase mb-2">A Little Secret Awaits</p>
            <h2 className="font-script text-4xl md:text-5xl text-[#333] mb-4">A date to remember</h2>
            <p className="text-[#666] mb-10 italic">Scratch the keepsake below to reveal our special day.</p>
            
            <ScratchCard />
            <p className="text-xs text-[#888] mt-6 tracking-wider uppercase">Or wait for the countdown below</p>
          </section>

          {/* Section: Countdown */}
          <section className="py-20 px-6 max-w-4xl mx-auto text-center">
            <p className="tracking-widest text-[#666] text-xs uppercase mb-4">Every moment brings us closer</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#8B1E28] mb-8">Countdown to Forever</h2>
            <Countdown targetDate="2026-11-13T09:00:00+05:30" />
            <p className="text-[#666] mt-6 text-sm tracking-wide">13 November 2026 • 9:00 AM IST</p>
            <OrnateDivider />
          </section>

          {/* Section: Itinerary */}
          <section className="py-16 bg-[#FDFBF7] overflow-hidden">
            <div className="text-center mb-10">
              <p className="tracking-widest text-[#888] text-xs uppercase mb-2">Celebration Schedule</p>
              <h2 className="font-script text-5xl text-[#333] mb-2">Wedding Itinerary</h2>
              <p className="italic text-[#666]">Join us in our joy and rituals.</p>
            </div>
            
            <div className="max-w-2xl mx-auto px-6 space-y-12">
              {/* Day 1: Thursday */}
              <div className="relative border-l border-[#C4A47C] pl-6 md:pl-8 ml-4 md:ml-0">
                <div className="absolute w-4 h-4 bg-[#8B1E28] rounded-full -left-[9px] top-1 border-4 border-[#FDFBF7]"></div>
                <h3 className="text-2xl text-[#8B1E28] font-serif mb-6">Thursday, 12th November</h3>
                
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4">
                    <span className="text-[#C4A47C] font-semibold w-24">4:00 PM</span>
                    <span className="text-lg text-[#444]">Sandh</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4">
                    <span className="text-[#C4A47C] font-semibold w-24">5:00 PM</span>
                    <span className="text-lg text-[#444]">Uptan</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4">
                    <span className="text-[#C4A47C] font-semibold w-24">7:00 PM</span>
                    <span className="text-lg text-[#444]">Kirtan</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4">
                    <span className="text-[#C4A47C] font-semibold w-24">10:00 PM</span>
                    <span className="text-lg text-[#444]">Lady Sangeet</span>
                  </div>
                </div>
              </div>

              {/* Day 2: Friday */}
              <div className="relative border-l border-[#C4A47C] pl-6 md:pl-8 ml-4 md:ml-0">
                <div className="absolute w-4 h-4 bg-[#8B1E28] rounded-full -left-[9px] top-1 border-4 border-[#FDFBF7]"></div>
                <h3 className="text-2xl text-[#8B1E28] font-serif mb-6">Friday, 13th November</h3>
                
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4">
                    <span className="text-[#C4A47C] font-semibold w-24">9:00 AM</span>
                    <span className="text-lg font-semibold text-[#8B1E28]">The Wedding</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: RSVP Form */}
          <section className="py-20 px-6 bg-[#FAF6F0] border-y border-[#EAE0D5]">
            <div className="max-w-3xl mx-auto">
               <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-semibold text-[#333] mb-4">Two Families. One Beautiful Beginning</h2>
                  <p className="italic text-[#666]">The love that raised us. The blessings that bring us together.</p>
               </div>
               
               <div className="bg-[#FDFBF7] p-8 md:p-12 rounded-lg shadow-lg border border-[#EAE0D5] relative overflow-hidden">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#C4A47C]/20 to-transparent"></div>
                  
                  <h3 className="text-3xl text-[#8B1E28] mb-8 font-serif uppercase tracking-widest">RSVP</h3>
                  
                  <form onSubmit={handleRsvpSubmit}>
                    <div className="mb-8">
                      <label className="block text-xs uppercase tracking-widest text-[#666] mb-2">Full Name</label>
                      <input 
                        type="text" 
                        required
                        className="custom-input w-full" 
                        placeholder="Your full name"
                        value={rsvpData.name}
                        onChange={(e) => setRsvpData({...rsvpData, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="mb-8">
                      <label className="block text-xs uppercase tracking-widest text-[#666] mb-2">Number of Guests</label>
                      <div className="flex items-center border border-[#EAE0D5] rounded w-fit">
                        <button type="button" onClick={() => setRsvpData(p => ({...p, guests: Math.max(1, p.guests - 1)}))} className="px-4 py-2 text-[#888] hover:bg-[#F5EEDC] transition">-</button>
                        <span className="px-4 py-2 border-x border-[#EAE0D5] w-12 text-center">{rsvpData.guests}</span>
                        <button type="button" onClick={() => setRsvpData(p => ({...p, guests: p.guests + 1}))} className="px-4 py-2 text-[#888] hover:bg-[#F5EEDC] transition">+</button>
                      </div>
                    </div>

                    <div className="mb-10">
                      <label className="block text-xs uppercase tracking-widest text-[#666] mb-4">Events Attending</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['The Wedding', 'Sandh', 'Uptan', 'Kirtan', 'Lady Sangeet'].map(event => (
                          <label key={event} className="flex items-center space-x-3 cursor-pointer group">
                            <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${rsvpData.events.includes(event) ? 'bg-[#8B1E28] border-[#8B1E28]' : 'border-[#C4A47C] group-hover:border-[#8B1E28]'}`}>
                              {rsvpData.events.includes(event) && <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>}
                            </div>
                            <span className="text-sm text-[#444] group-hover:text-[#8B1E28] transition-colors">{event}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-[#8B1E28] text-white py-4 rounded uppercase tracking-[0.2em] text-sm hover:bg-[#6a151d] transition-colors shadow-md">
                      Confirm Attendance
                    </button>
                  </form>
               </div>
            </div>
          </section>

          {/* Section: Guestbook / Wishes */}
          <section className="py-20 px-6 max-w-2xl mx-auto">
            <OrnateDivider />
            <div className="text-center mb-10">
              <h2 className="text-3xl font-semibold text-[#333] mb-2 font-serif">Little Wishes</h2>
              <p className="italic text-[#666]">Be the first to leave a little wish.</p>
            </div>

            <form onSubmit={handleWishSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-[#EAE0D5]">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#666] mb-2">Your Name</label>
                <input 
                  type="text" required
                  className="custom-input w-full"
                  placeholder="Your name"
                  value={wishData.name}
                  onChange={(e) => setWishData({...wishData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#666] mb-2">Your Message</label>
                <textarea 
                  required rows="3"
                  className="custom-input w-full resize-none"
                  placeholder="Write your wish..."
                  value={wishData.message}
                  onChange={(e) => setWishData({...wishData, message: e.target.value})}
                ></textarea>
                <div className="text-right text-[10px] text-[#888] mt-1">{wishData.message.length}/200</div>
              </div>
              <button type="submit" className="w-full bg-[#8B1E28]/90 text-white py-3 rounded uppercase tracking-[0.1em] text-sm hover:bg-[#8B1E28] transition-colors flex items-center justify-center">
                Save Your Wish <Heart className="w-4 h-4 ml-2" />
              </button>
            </form>
          </section>

          {/* Section: Thank You Footer */}
          <footer className="bg-[#8B1E28] text-white py-24 px-6 text-center relative overflow-hidden">
             {/* Gradient overlay for depth */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
             
             <div className="relative z-10 max-w-3xl mx-auto">
                <p className="tracking-[0.3em] text-xs uppercase mb-8 text-[#EAE0D5]">Thank You</p>
                <h2 className="font-script text-5xl md:text-7xl mb-6 text-shadow-sm">For being a part of our story.</h2>
                <p className="font-serif italic text-lg md:text-xl text-[#EAE0D5] mb-16 max-w-xl mx-auto">
                  We cannot wait to celebrate this beautiful beginning with you.
                </p>
                
                <p className="tracking-[0.2em] text-xs uppercase mb-4 text-[#C4A47C]">With Love</p>
                <p className="font-serif text-xl md:text-2xl tracking-wider">Rana & Bhatia Families</p>
             </div>
          </footer>

        </div>
      </div>
    </div>
  );
}