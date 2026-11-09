import React, { useState, useEffect, useRef } from 'react';

// --- Assets & Icons ---
import { MapPin, Calendar, Clock, ChevronRight, Heart, ExternalLink, Volume2, VolumeX, Check, Mail, Send } from 'lucide-react';

// --- Recipient Emails for RSVP & Wishes ---
const RECIPIENT_EMAILS = ["kartik711111@gmail.com", "ikrishmabhatia@gmail.com"];
const RECIPIENT_EMAILS_STR = RECIPIENT_EMAILS.join(",");

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

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fadeIn 0.45s ease-out forwards;
  }
`;

// --- Components ---

const OrnateDivider = () => (
  <div className="flex justify-center items-center my-6 md:my-8 opacity-85">
    <svg width="280" height="40" viewBox="0 0 280 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 20 L80 20 M200 20 L265 20" stroke="#C4A47C" strokeWidth="1.5" />
      <circle cx="140" cy="20" r="5" fill="#8B1E28" />
      <path d="M115 20 Q127.5 8 140 20 Q152.5 32 165 20" stroke="#C4A47C" strokeWidth="1.5" fill="none" />
      <path d="M115 20 Q127.5 32 140 20 Q152.5 8 165 20" stroke="#C4A47C" strokeWidth="1.5" fill="none" />
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
      className="relative w-full max-w-xl h-48 sm:h-52 md:h-56 mx-auto rounded-2xl overflow-hidden shadow-xl select-none border-2 border-[#C4A47C]"
      style={{ touchAction: 'none' }} // Crucial for smooth touch scratching
    >
      {/* Revealed Content underneath */}
      <div className="absolute inset-0 bg-[#F5EEDC] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-xs sm:text-sm md:text-base font-bold tracking-[0.3em] text-[#888] mb-2 uppercase font-sans">Friday</p>
        <p className="text-3xl sm:text-4xl md:text-5xl text-[#8B1E28] font-serif font-bold mb-2">13 November 2026</p>
        <p className="font-script text-3xl sm:text-4xl text-[#C4A47C]">Our forever begins</p>
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
    <div className="flex flex-col items-center mx-2 sm:mx-3 md:mx-5">
      <div className="bg-[#8B1E28] text-[#FDFBF7] rounded-xl shadow-lg w-16 h-20 sm:w-24 sm:h-28 md:w-32 md:h-36 flex items-center justify-center relative overflow-hidden border border-[#C4A47C]/40">
         {/* Inner highlight line for depth */}
         <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/25"></div>
        <span className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold z-10">{String(value).padStart(2, '0')}</span>
      </div>
      <span className="text-xs md:text-sm tracking-[0.25em] mt-3.5 text-[#777] uppercase font-semibold">{label}</span>
    </div>
  );

  return (
    <div className="flex justify-center items-center my-8">
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

  const [rsvpData, setRsvpData] = useState({ name: '', guests: 1, events: ['The Wedding'] });
  const [wishData, setWishData] = useState({ name: '', message: '' });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [wishSubmitted, setWishSubmitted] = useState(false);
  const [isSendingRsvp, setIsSendingRsvp] = useState(false);
  const [isSendingWish, setIsSendingWish] = useState(false);

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

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpData.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    setIsSendingRsvp(true);
    const eventsList = rsvpData.events.length > 0 ? rsvpData.events.join(", ") : "The Wedding";
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 1. Background notification via FormSubmit to both Kartik & Karishma
    RECIPIENT_EMAILS.forEach((recipient) => {
      fetch(`https://formsubmit.co/ajax/${recipient}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Wedding RSVP: ${rsvpData.name} (${rsvpData.guests} Guest${rsvpData.guests > 1 ? 's' : ''})`,
          Guest_Name: rsvpData.name,
          Number_of_Guests: rsvpData.guests,
          Events_Attending: eventsList,
          Submitted_At: now
        })
      }).catch((err) => {
        console.log("Background RSVP notification:", err);
      });
    });

    // 2. Direct email client trigger via mailto:
    const emailSubject = encodeURIComponent(`Wedding RSVP: ${rsvpData.name}`);
    const emailBody = encodeURIComponent(
      `Dear Kartik & Karishma,\n\nI am delighted to RSVP for your wedding celebrations!\n\n` +
      `• Guest Name: ${rsvpData.name}\n` +
      `• Number of Guests: ${rsvpData.guests}\n` +
      `• Events Attending: ${eventsList}\n\n` +
      `Looking forward to celebrating with you!\n\nWarm regards,\n${rsvpData.name}`
    );

    window.location.href = `mailto:${RECIPIENT_EMAILS_STR}?subject=${emailSubject}&body=${emailBody}`;

    setRsvpSubmitted(true);
    setIsSendingRsvp(false);
  };

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishData.name.trim() || !wishData.message.trim()) {
      alert("Please enter both your name and wish message.");
      return;
    }

    setIsSendingWish(true);
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 1. Background notification via FormSubmit to both Kartik & Karishma
    RECIPIENT_EMAILS.forEach((recipient) => {
      fetch(`https://formsubmit.co/ajax/${recipient}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New Wedding Wish from ${wishData.name}! ❤️`,
          Name: wishData.name,
          Blessing_Wish: wishData.message,
          Submitted_At: now
        })
      }).catch((err) => {
        console.log("Background wish notification:", err);
      });
    });

    // 2. Direct email client trigger via mailto:
    const emailSubject = encodeURIComponent(`Wedding Wish from ${wishData.name}`);
    const emailBody = encodeURIComponent(
      `Dear Kartik & Karishma,\n\nHere is my blessing and wish for your wedding:\n\n` +
      `"${wishData.message}"\n\n` +
      `With lots of love and best wishes,\n${wishData.name}`
    );

    window.location.href = `mailto:${RECIPIENT_EMAILS_STR}?subject=${emailSubject}&body=${emailBody}`;

    setWishSubmitted(true);
    setIsSendingWish(false);
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
          <section className="py-12 md:py-16 px-6 max-w-5xl mx-auto text-center">
            <OrnateDivider />
            <p className="tracking-[0.25em] text-[#777] text-sm md:text-base uppercase mb-3 font-sans font-medium">Together with our families</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-[#2B1B17] mb-3">We Joyfully Invite You</h2>
            <p className="italic text-lg sm:text-xl md:text-2xl text-[#666] mb-6 font-serif">to celebrate the wedding of</p>
            
            <div className="flex flex-col items-center justify-center my-4 md:my-8">
              <span className="font-script text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] text-[#8B1E28] leading-tight text-shadow-sm">Kartik</span>
              <span className="text-[#C4A47C] font-script text-4xl sm:text-5xl md:text-6xl my-1">&</span>
              <span className="font-script text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] text-[#8B1E28] leading-tight text-shadow-sm">Karishma</span>
            </div>

            <p className="tracking-[0.25em] text-[#8B1E28] text-xs sm:text-sm md:text-base uppercase font-semibold mb-6">With the blessings of</p>
            
            {/* Grandparents & Parents Family Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-5xl mx-auto my-6 text-[#444]">
              {/* Kartik's Family */}
              <div className="bg-[#FAF6F0] p-6 sm:p-8 md:p-10 rounded-2xl shadow-sm border border-[#C4A47C]/40 text-center relative overflow-hidden hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-[#C4A47C]/20 to-transparent"></div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#C4A47C]/20 to-transparent"></div>
                <span className="inline-block px-4 py-1 rounded-full bg-[#8B1E28]/10 text-[#8B1E28] text-xs uppercase tracking-[0.2em] font-semibold mb-6">Rana Family</span>

                <div className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#C4A47C] font-semibold mb-1.5 font-sans">Grandparents</p>
                    <p className="font-serif text-xl sm:text-2xl font-bold text-[#2B1B17] mb-1">Late Shri Bishan Singh Rana</p>
                    <p className="text-base sm:text-lg text-[#666] font-serif">& Smt. Rama Rana</p>
                  </div>

                  <div className="w-20 h-[1px] bg-[#C4A47C]/40 mx-auto"></div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#C4A47C] font-semibold mb-1.5 font-sans">Parents</p>
                    <p className="font-serif text-xl sm:text-2xl font-bold text-[#2B1B17] mb-1">Shri Pawan Rana</p>
                    <p className="text-base sm:text-lg text-[#666] font-serif">& Smt. Shivani Rana</p>
                  </div>
                </div>
              </div>

              {/* Karishma's Family */}
              <div className="bg-[#FAF6F0] p-6 sm:p-8 md:p-10 rounded-2xl shadow-sm border border-[#C4A47C]/40 text-center relative overflow-hidden hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-[#C4A47C]/20 to-transparent"></div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#C4A47C]/20 to-transparent"></div>
                <span className="inline-block px-4 py-1 rounded-full bg-[#8B1E28]/10 text-[#8B1E28] text-xs uppercase tracking-[0.2em] font-semibold mb-6">Bhatia Family</span>

                <div className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#C4A47C] font-semibold mb-1.5 font-sans">Grandparents</p>
                    <p className="font-serif text-xl sm:text-2xl font-bold text-[#2B1B17] mb-1">Shri Harish Bhatia</p>
                    <p className="text-base sm:text-lg text-[#666] font-serif">& Smt. Prem Bhatia</p>
                  </div>

                  <div className="w-20 h-[1px] bg-[#C4A47C]/40 mx-auto"></div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#C4A47C] font-semibold mb-1.5 font-sans">Parents</p>
                    <p className="font-serif text-xl sm:text-2xl font-bold text-[#2B1B17] mb-1">Late Shri Rakesh Bhatia</p>
                    <p className="text-base sm:text-lg text-[#666] font-serif">& Late Smt. Minakshi Bhatia</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="italic text-base sm:text-lg text-[#666] mt-6">and our loving families</p>
            <OrnateDivider />
          </section>

          {/* Section: Date Reveal */}
          <section className="py-14 md:py-18 px-6 bg-[#FAF6F0] text-center border-y border-[#EAE0D5]">
            <div className="max-w-4xl mx-auto">
              <p className="tracking-[0.25em] text-[#888] text-sm uppercase mb-2 font-medium">A Little Secret Awaits</p>
              <h2 className="font-script text-5xl md:text-6xl text-[#333] mb-3">A date to remember</h2>
              <p className="text-[#666] text-base md:text-lg mb-8 italic font-serif">Scratch the keepsake below to reveal our special day.</p>
              
              <ScratchCard />
              <p className="text-xs md:text-sm text-[#888] mt-6 tracking-wider uppercase font-medium">Or wait for the countdown below</p>
            </div>
          </section>

          {/* Section: Countdown */}
          <section className="py-14 md:py-18 px-6 max-w-5xl mx-auto text-center">
            <p className="tracking-[0.25em] text-[#666] text-sm uppercase mb-3 font-medium">Every moment brings us closer</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-[#8B1E28] mb-8 font-serif">Countdown to Forever</h2>
            <Countdown targetDate="2026-11-13T09:00:00+05:30" />
            <p className="text-[#666] mt-8 text-base md:text-lg tracking-wide font-serif font-medium">13 November 2026 • 9:00 AM IST</p>
            <OrnateDivider />
          </section>

          {/* Section: Itinerary (Side by Side 2-Column Desktop Grid) */}
          <section className="py-14 md:py-18 px-6 bg-[#FDFBF7] overflow-hidden">
            <div className="text-center mb-12">
              <p className="tracking-[0.25em] text-[#888] text-sm uppercase mb-2 font-medium">Celebration Schedule</p>
              <h2 className="font-script text-6xl md:text-7xl text-[#333] mb-3">Wedding Itinerary</h2>
              <p className="italic text-lg md:text-xl text-[#666] font-serif">Join us in our joy and rituals.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto">
              {/* Day 1: Thursday */}
              <div className="bg-[#FAF6F0] p-8 md:p-10 rounded-2xl border border-[#C4A47C]/40 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-3 mb-8 border-b border-[#C4A47C]/30 pb-4">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#8B1E28]"></div>
                  <h3 className="text-2xl md:text-3xl text-[#8B1E28] font-serif font-semibold">Thursday, 12th November</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/70 border border-[#EAE0D5] hover:border-[#8B1E28]/40 transition-colors">
                    <span className="text-lg md:text-xl font-serif text-[#333]">Sendh</span>
                    <span className="text-sm md:text-base font-semibold text-[#8B1E28] bg-[#8B1E28]/10 px-3.5 py-1 rounded-full font-sans">4:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/70 border border-[#EAE0D5] hover:border-[#8B1E28]/40 transition-colors">
                    <span className="text-lg md:text-xl font-serif text-[#333]">Ubtan</span>
                    <span className="text-sm md:text-base font-semibold text-[#8B1E28] bg-[#8B1E28]/10 px-3.5 py-1 rounded-full font-sans">5:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/70 border border-[#EAE0D5] hover:border-[#8B1E28]/40 transition-colors">
                    <span className="text-lg md:text-xl font-serif text-[#333]">Kirtan</span>
                    <span className="text-sm md:text-base font-semibold text-[#8B1E28] bg-[#8B1E28]/10 px-3.5 py-1 rounded-full font-sans">7:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/70 border border-[#EAE0D5] hover:border-[#8B1E28]/40 transition-colors">
                    <span className="text-lg md:text-xl font-serif text-[#333]">Lady Sangeet</span>
                    <span className="text-sm md:text-base font-semibold text-[#8B1E28] bg-[#8B1E28]/10 px-3.5 py-1 rounded-full font-sans">10:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Day 2: Friday */}
              <div className="bg-[#FAF6F0] p-8 md:p-10 rounded-2xl border-2 border-[#8B1E28]/35 shadow-md relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#8B1E28]/15 to-transparent"></div>
                
                <div>
                  <div className="flex items-center gap-3 mb-8 border-b border-[#C4A47C]/30 pb-4">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#8B1E28] animate-pulse"></div>
                    <h3 className="text-2xl md:text-3xl text-[#8B1E28] font-serif font-semibold">Friday, 13th November</h3>
                  </div>
                  
                  <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#8B1E28] to-[#6A151D] text-white shadow-lg text-center my-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#EAE0D5] mb-2 font-medium">The Auspicious Wedding</p>
                    <h4 className="font-script text-5xl md:text-6xl mb-2 text-white text-shadow-sm">The Wedding</h4>
                    <p className="text-2xl md:text-3xl font-serif font-bold text-[#EAE0D5] mt-3">9:00 AM IST</p>
                  </div>
                </div>

                <p className="text-center italic text-sm md:text-base text-[#666] font-serif mt-4">
                  We eagerly await your gracious presence to bless the couple.
                </p>
              </div>
            </div>
          </section>

          {/* Section: RSVP Form */}
          <section className="py-14 md:py-20 px-6 bg-[#FAF6F0] border-y border-[#EAE0D5]">
            <div className="max-w-4xl mx-auto">
               <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#333] mb-3 font-serif">Two Families. One Beautiful Beginning</h2>
                  <p className="italic text-base md:text-lg text-[#666] font-serif">The love that raised us. The blessings that bring us together.</p>
               </div>
               
               <div className="bg-[#FDFBF7] p-8 md:p-14 rounded-3xl shadow-xl border border-[#EAE0D5] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#C4A47C]/20 to-transparent"></div>
                  
                  <h3 className="text-3xl md:text-4xl text-[#8B1E28] mb-8 font-serif uppercase tracking-widest text-center">RSVP</h3>
                  
                  {rsvpSubmitted ? (
                    <div className="text-center py-6 px-4 space-y-5 animate-fade-in">
                      <div className="w-16 h-16 bg-[#8B1E28]/10 text-[#8B1E28] rounded-full flex items-center justify-center mx-auto border border-[#C4A47C]/40">
                        <Check className="w-8 h-8 stroke-current" />
                      </div>
                      <h4 className="font-serif text-3xl font-bold text-[#2B1B17]">RSVP Confirmed!</h4>
                      <p className="text-base md:text-lg text-[#555] font-serif max-w-lg mx-auto">
                        Thank you, <span className="font-semibold text-[#8B1E28]">{rsvpData.name}</span>! Your attendance for <span className="font-semibold text-[#8B1E28]">{rsvpData.guests} guest{rsvpData.guests > 1 ? 's' : ''}</span> has been confirmed.
                      </p>
                      <div className="bg-white/80 p-4 rounded-xl border border-[#C4A47C]/30 text-left max-w-md mx-auto text-sm space-y-1 text-[#444] font-serif">
                        <p><strong className="text-[#8B1E28]">Guest:</strong> {rsvpData.name}</p>
                        <p><strong className="text-[#8B1E28]">Guests:</strong> {rsvpData.guests}</p>
                        <p><strong className="text-[#8B1E28]">Events:</strong> {rsvpData.events.join(", ") || "The Wedding"}</p>
                      </div>
                      <p className="text-xs text-[#888] font-sans tracking-wide">
                        An email notification has been dispatched to Kartik &amp; Karishma (<strong className="text-[#8B1E28] font-mono">kartik711111@gmail.com</strong> &amp; <strong className="text-[#8B1E28] font-mono">ikrishmabhatia@gmail.com</strong>).
                      </p>
                      
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <a 
                          href={`mailto:${RECIPIENT_EMAILS_STR}?subject=${encodeURIComponent(`Wedding RSVP: ${rsvpData.name}`)}&body=${encodeURIComponent(
                            `Wedding RSVP Details:\n\n• Guest Name: ${rsvpData.name}\n• Number of Guests: ${rsvpData.guests}\n• Events Attending: ${rsvpData.events.join(", ") || 'The Wedding'}\n\nWarm regards,\n${rsvpData.name}`
                          )}`}
                          className="inline-flex items-center gap-2 bg-[#8B1E28] text-white px-5 py-2.5 rounded-xl text-xs md:text-sm font-sans tracking-wider uppercase font-semibold shadow hover:bg-[#6a151d] transition"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Open in Mail App</span>
                        </a>
                        <a 
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${RECIPIENT_EMAILS_STR}&su=${encodeURIComponent(`Wedding RSVP: ${rsvpData.name}`)}&body=${encodeURIComponent(
                            `Wedding RSVP Details:\n\n• Guest Name: ${rsvpData.name}\n• Number of Guests: ${rsvpData.guests}\n• Events Attending: ${rsvpData.events.join(", ") || 'The Wedding'}\n\nWarm regards,\n${rsvpData.name}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-white text-[#8B1E28] border border-[#8B1E28] px-5 py-2.5 rounded-xl text-xs md:text-sm font-sans tracking-wider uppercase font-semibold shadow-sm hover:bg-[#FAF6F0] transition"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Send via Gmail Web</span>
                        </a>
                      </div>

                      <button 
                        type="button" 
                        onClick={() => { setRsvpSubmitted(false); setRsvpData({ name: '', guests: 1, events: ['The Wedding'] }); }}
                        className="text-xs text-[#888] underline hover:text-[#8B1E28] pt-2 cursor-pointer font-sans block mx-auto"
                      >
                        Submit another RSVP
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit}>
                      <div className="mb-8">
                        <label className="block text-xs uppercase tracking-widest text-[#666] mb-2 font-semibold">Full Name</label>
                        <input 
                          type="text" 
                          required
                          className="custom-input w-full text-lg py-2" 
                          placeholder="Your full name"
                          value={rsvpData.name}
                          onChange={(e) => setRsvpData({...rsvpData, name: e.target.value})}
                        />
                      </div>
                      
                      <div className="mb-8">
                        <label className="block text-xs uppercase tracking-widest text-[#666] mb-2 font-semibold">Number of Guests</label>
                        <div className="flex items-center border border-[#EAE0D5] rounded-xl w-fit bg-white overflow-hidden shadow-sm">
                          <button type="button" onClick={() => setRsvpData(p => ({...p, guests: Math.max(1, p.guests - 1)}))} className="px-5 py-3 text-[#888] hover:bg-[#F5EEDC] transition text-lg font-bold">-</button>
                          <span className="px-5 py-3 border-x border-[#EAE0D5] w-14 text-center font-serif text-lg font-bold">{rsvpData.guests}</span>
                          <button type="button" onClick={() => setRsvpData(p => ({...p, guests: p.guests + 1}))} className="px-5 py-3 text-[#888] hover:bg-[#F5EEDC] transition text-lg font-bold">+</button>
                        </div>
                      </div>

                      <div className="mb-10">
                        <label className="block text-xs uppercase tracking-widest text-[#666] mb-4 font-semibold">
                          Events Attending <span className="text-[#888] font-normal lowercase">(click to select)</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                          {['The Wedding', 'Sendh', 'Ubtan', 'Kirtan', 'Lady Sangeet'].map(event => {
                            const isSelected = rsvpData.events.includes(event);
                            return (
                              <button
                                type="button"
                                key={event}
                                onClick={() => toggleEvent(event)}
                                className={`flex items-center space-x-3.5 p-3.5 rounded-xl border transition-all text-left shadow-sm cursor-pointer select-none ${
                                  isSelected 
                                    ? 'border-[#8B1E28] bg-[#8B1E28]/10 text-[#8B1E28]' 
                                    : 'border-[#C4A47C]/40 bg-white text-[#444] hover:border-[#8B1E28]/50 hover:bg-[#FDFBF7]'
                                }`}
                              >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                  isSelected 
                                    ? 'bg-[#8B1E28] border-[#8B1E28] text-white shadow-sm' 
                                    : 'border-[#C4A47C] bg-white'
                                }`}>
                                  {isSelected && (
                                    <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-base font-serif font-medium">{event}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSendingRsvp}
                        className="w-full bg-[#8B1E28] text-white py-4 md:py-5 rounded-2xl uppercase tracking-[0.25em] text-sm md:text-base font-semibold hover:bg-[#6a151d] transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>Confirm Attendance &amp; Send RSVP</span>
                      </button>
                    </form>
                  )}
               </div>
            </div>
          </section>

          {/* Section: Guestbook / Wishes */}
          <section className="py-14 md:py-20 px-6 max-w-3xl mx-auto">
            <OrnateDivider />
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#333] mb-2 font-serif">Little Wishes</h2>
              <p className="italic text-base md:text-lg text-[#666] font-serif">Be the first to leave a little wish for the couple.</p>
            </div>

            {wishSubmitted ? (
              <div className="text-center py-8 px-6 space-y-5 bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-[#EAE0D5] animate-fade-in">
                <div className="w-16 h-16 bg-[#8B1E28]/10 text-[#8B1E28] rounded-full flex items-center justify-center mx-auto border border-[#C4A47C]/40">
                  <Heart className="w-8 h-8 fill-current text-[#8B1E28]" />
                </div>
                <h4 className="font-serif text-3xl font-bold text-[#2B1B17]">Wish Received with Love!</h4>
                <p className="text-base md:text-lg text-[#555] font-serif max-w-lg mx-auto">
                  Thank you, <span className="font-semibold text-[#8B1E28]">{wishData.name}</span>! Your blessing has been recorded and an email notification has been dispatched to Kartik &amp; Karishma (<strong className="text-[#8B1E28] font-mono text-xs">kartik711111@gmail.com</strong> &amp; <strong className="text-[#8B1E28] font-mono text-xs">ikrishmabhatia@gmail.com</strong>).
                </p>
                <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#C4A47C]/30 text-left max-w-md mx-auto text-sm text-[#444] font-serif italic">
                  "{wishData.message}"
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a 
                    href={`mailto:${RECIPIENT_EMAILS_STR}?subject=${encodeURIComponent(`Wedding Wish from ${wishData.name}`)}&body=${encodeURIComponent(
                      `Dear Kartik & Karishma,\n\nHere is my blessing and wish for your wedding:\n\n"${wishData.message}"\n\nWith love,\n${wishData.name}`
                    )}`}
                    className="inline-flex items-center gap-2 bg-[#8B1E28] text-white px-5 py-2.5 rounded-xl text-xs md:text-sm font-sans tracking-wider uppercase font-semibold shadow hover:bg-[#6a151d] transition"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Open in Mail App</span>
                  </a>
                  <a 
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${RECIPIENT_EMAILS_STR}&su=${encodeURIComponent(`Wedding Wish from ${wishData.name}`)}&body=${encodeURIComponent(
                      `Dear Kartik & Karishma,\n\nHere is my blessing and wish for your wedding:\n\n"${wishData.message}"\n\nWith love,\n${wishData.name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-[#8B1E28] border border-[#8B1E28] px-5 py-2.5 rounded-xl text-xs md:text-sm font-sans tracking-wider uppercase font-semibold shadow-sm hover:bg-[#FAF6F0] transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Send via Gmail Web</span>
                  </a>
                </div>
                <button 
                  type="button" 
                  onClick={() => { setWishSubmitted(false); setWishData({ name: '', message: '' }); }}
                  className="text-xs text-[#888] underline hover:text-[#8B1E28] pt-2 cursor-pointer font-sans block mx-auto"
                >
                  Leave another wish
                </button>
              </div>
            ) : (
              <form onSubmit={handleWishSubmit} className="space-y-6 bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-[#EAE0D5]">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#666] mb-2 font-semibold">Your Name</label>
                  <input 
                    type="text" required
                    className="custom-input w-full text-lg py-2"
                    placeholder="Your name"
                    value={wishData.name}
                    onChange={(e) => setWishData({...wishData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#666] mb-2 font-semibold">Your Message</label>
                  <textarea 
                    required rows="3"
                    className="custom-input w-full resize-none text-lg py-2"
                    placeholder="Write your heartfelt blessing or wish..."
                    value={wishData.message}
                    onChange={(e) => setWishData({...wishData, message: e.target.value})}
                  ></textarea>
                  <div className="text-right text-xs text-[#888] mt-1">{wishData.message.length}/200</div>
                </div>
                <button 
                  type="submit" 
                  disabled={isSendingWish}
                  className="w-full bg-[#8B1E28]/95 text-white py-4 rounded-2xl uppercase tracking-[0.2em] text-sm md:text-base hover:bg-[#8B1E28] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer font-semibold"
                >
                  <Send className="w-4 h-4" />
                  <span>Save &amp; Send Your Wish</span> <Heart className="w-4 h-4 ml-1 fill-current" />
                </button>
              </form>
            )}
          </section>

          {/* Section: A Note of Simplicity & Blessings */}
          <section className="py-12 md:py-16 px-6 max-w-4xl mx-auto text-center">
            <div className="bg-[#FAF6F0] p-8 md:p-12 rounded-3xl border border-[#C4A47C]/40 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[#C4A47C]/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-[#8B1E28]/10 to-transparent"></div>

              <p className="tracking-[0.3em] text-xs uppercase text-[#8B1E28] font-semibold mb-3 font-sans">A Gentle Note</p>
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#2B1B17] font-semibold mb-5">Celebrated in Simplicity &amp; Spirit</h3>
              
              <p className="font-serif italic text-base sm:text-lg md:text-xl text-[#555] leading-relaxed max-w-2xl mx-auto mb-6">
                &ldquo;We envision every moment of our wedding to be simple, peaceful, spiritual, and memorable. In honor of this sacred milestone, we warmly request only your loving presence and heartfelt blessings, with no customary gifts or formal exchanges.&rdquo;
              </p>

              <div className="w-20 h-[1px] bg-[#C4A47C]/50 mx-auto mb-3"></div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#C4A47C] font-semibold font-sans">
                Your presence &amp; blessings are our greatest gift
              </p>
            </div>
          </section>

          {/* Section: Thank You Footer */}
          <footer className="bg-[#8B1E28] text-white py-20 md:py-28 px-6 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
             
             <div className="relative z-10 max-w-4xl mx-auto">
                <p className="tracking-[0.3em] text-xs md:text-sm uppercase mb-6 text-[#EAE0D5] font-medium">Thank You</p>
                <h2 className="font-script text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-6 text-shadow-sm">For being a part of our story.</h2>
                <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#EAE0D5] mb-12 max-w-2xl mx-auto">
                  We cannot wait to celebrate this beautiful beginning with you.
                </p>
                
                <p className="tracking-[0.25em] text-xs md:text-sm uppercase mb-3 text-[#C4A47C] font-semibold">With Love</p>
                <p className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-wider">Rana &amp; Bhatia Families</p>
             </div>
          </footer>

        </div>
      </div>
    </div>
  );
}