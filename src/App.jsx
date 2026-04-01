import React, { useState, useEffect } from 'react';
import { 
  Phone, Pill, Heart, AlertCircle, CheckCircle, Smile, Frown, Meh, 
  X, Plus, UserPlus, Settings, Palette, Image as ImageIcon, Send,
  Activity, Home as HomeIcon, Users, Map as MapIcon, 
  HeartPulse, Footprints, Moon, MessageSquare, Newspaper, Edit2, 
  Clock, Tag, ChevronRight, Navigation, Tv, Gamepad2, Play, ExternalLink, Globe, Star, Lightbulb, Utensils, User, Wrench, ShieldCheck, Bell, BookOpen
} from 'lucide-react';

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mood, setMood] = useState(null);
  const [sosActive, setSosActive] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // User Preferences
  const [userName, setUserName] = useState('Arthur');
  const [fontSizeMult, setFontSizeMult] = useState(100);

  // Custom Theme Preferences
  const [customMain, setCustomMain] = useState('#0f172a');
  const [customSec, setCustomSec] = useState('#f8fafc');

  // Modal & Detail States
  const [isAddingPill, setIsAddingPill] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRecipeOpen, setIsRecipeOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [editingPillId, setEditingPillId] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [activeGame, setActiveGame] = useState(null);

  // Short Story State
  const [currentStory, setCurrentStory] = useState(null);
  const [isLoadingStory, setIsLoadingStory] = useState(false);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  // Global Font Size Effect
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSizeMult}%`;
    return () => { document.documentElement.style.fontSize = ''; };
  }, [fontSizeMult]);

  // Global Haptic Feedback
  useEffect(() => {
    const handleInteraction = (e) => {
      const isInteractive = e.target.closest('button') || e.target.closest('a') || e.target.closest('input[type="range"]');
      if (isInteractive && typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        try {
          window.navigator.vibrate(50);
        } catch (err) {
          console.log("Haptics blocked or unsupported by this browser.", err);
        }
      }
    };
    
    document.addEventListener('click', handleInteraction);
    return () => document.removeEventListener('click', handleInteraction);
  }, []);

  // Fetch initial short story
  useEffect(() => {
    fetchNewStory();
  }, []);

  const fetchNewStory = async () => {
    setIsLoadingStory(true);
  
    // 75% API, 25% TXT
    const useApi = Math.random() < 0.75;
  
    const parseStoriesTxt = (txt) => {
      try {
        // split by line and remove empty lines
        const lines = txt.split("\n").map(l => l.trim()).filter(Boolean);
  
        const stories = [];
  
        for (let line of lines) {
          try {
            const obj = JSON.parse(line);
            if (obj.title && obj.story) {
              stories.push(obj);
            }
          } catch (e) {
            console.warn("Skipping invalid story line");
          }
        }
  
        return stories;
      } catch (e) {
        console.error("stories.txt parse error", e);
        return [];
      }
    };
  
    try {
  
      if (useApi) {
  
        // ----- API (75%) -----
        const response = await fetch("https://shortstories-api.onrender.com/");
        if (!response.ok) throw new Error("API failed");
  
        const data = await response.json();
        setCurrentStory(data);
  
      } else {
  
        // ----- TXT (25%) -----
        try {
  
          const txtRes = await fetch("https://raw.githubusercontent.com/AmazingCoder96/InterlakeHackathon2026/refs/heads/main/Stories.txt");
  
          if (!txtRes.ok) throw new Error("stories.txt missing");
  
          const txt = await txtRes.text();
  
          const stories = parseStoriesTxt(txt);
  
          if (stories.length > 0) {
  
            const randomStory =
              stories[Math.floor(Math.random() * stories.length)];
  
            setCurrentStory(randomStory);
  
          } else {
            throw new Error("stories empty");
          }
  
        } catch (txtErr) {
  
          console.warn("TXT failed, using API fallback");
  
          const response = await fetch("https://shortstories-api.onrender.com/");
          const data = await response.json();
          setCurrentStory(data);
  
        }
  
      }
  
    } catch (error) {
  
      console.error("Story load failed", error);
  
      // final fallback
      setCurrentStory({
        title: "The Porcupine and the Snakes",
        author: "Aesop's Fables",
        story: "A Porcupine searched for a home and asked a family of snakes if he could stay in their cave. They agreed, but his sharp quills kept pricking them until they begged him to leave.",
        moral: "Give a finger and lose a hand."
      });
  
    } finally {
      setIsLoadingStory(false);
    }
  };
  // Web Audio Synth for Games
  const playSound = (type) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'flip') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'match') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'star') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (e) {
      console.log('Audio playback failed or unsupported.');
    }
  };

  // Game 1: Memory Match State
  const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊'];
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);

  // Game 2: Tap the Star State
  const [starPos, setStarPos] = useState(null);
  const [score, setScore] = useState(0);

  // Accessibility State
  const [themeMode, setThemeMode] = useState('default');

  // Form States
  const [newPillName, setNewPillName] = useState('');
  const [newPillTime, setNewPillTime] = useState('08:00');
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [chatMessage, setChatMessage] = useState('');

  // Mock Data
  const [medications, setMedications] = useState([
    { id: 1, name: 'Blood Pressure (Lisinopril)', time: '08:00', taken: false, color: 'bg-blue-100 border-blue-400' },
    { id: 2, name: 'Joint Pain (Ibuprofen)', time: '13:00', taken: false, color: 'bg-orange-100 border-orange-400' },
    { id: 3, name: 'Heart (Aspirin)', time: '18:00', taken: false, color: 'bg-red-100 border-red-400' }
  ]);

  const [contacts, setContacts] = useState([
    { id: 1, name: 'Sarah (Daughter)', phone: '5550192', icon: <Phone className="w-8 h-8" aria-hidden="true" /> },
    { id: 2, name: 'Dr. Smith', phone: '5550198', icon: <Phone className="w-8 h-8" aria-hidden="true" /> },
  ]);

  const [notifications] = useState([
    { id: 1, from: 'Sarah (Daughter)', text: 'Don\'t forget our video call at 3 PM today!', time: '1h ago', read: false },
    { id: 2, from: 'Dr. Smith', text: 'Your recent blood test results are completely normal.', time: '3h ago', read: false },
    { id: 3, from: 'Sarah (Daughter)', text: 'Do you need anything from the grocery store? Let me know!', time: '1d ago', read: true },
    { id: 4, from: 'Community Center', text: 'Bingo night starts at 6 PM tomorrow in the main hall.', time: '2d ago', read: true },
    { id: 5, from: 'Dr. Smith', text: 'Reminder: Standard check-up appointment next Tuesday.', time: '5d ago', read: true },
  ]);

  const trustedServices = [
    { id: 1, name: "Mike's Handyman Setup", type: "Handyman", phone: "555-0123", rating: 4.9 },
    { id: 2, name: "Green Wheel Drivers", type: "Transport", phone: "555-0456", rating: 4.6 },
    { id: 3, name: "FreshDrop Groceries", type: "Delivery", phone: "555-0789", rating: 4.9 }
  ];

  // Mock Trend Data
  const hrData = [
    { time: '24h ago', val: 68 }, { time: '20h ago', val: 70 }, { time: '16h ago', val: 75 },
    { time: '12h ago', val: 82 }, { time: '8h ago', val: 74 }, { time: '4h ago', val: 71 }, { time: 'Now', val: 72 }
  ];
  const stepsData = [
    { day: '6d ago', val: 3200 }, { day: '5d ago', val: 4100 }, { day: '4d ago', val: 2800 },
    { day: '3d ago', val: 5000 }, { day: '2d ago', val: 3900 }, { day: 'Yesterday', val: 4500 }, { day: 'Today', val: 4320 }
  ];
  const sleepData = [
    { day: '6d ago', val: 7.0 }, { day: '5d ago', val: 6.5 }, { day: '4d ago', val: 8.0 },
    { day: '3d ago', val: 7.2 }, { day: '2d ago', val: 6.8 }, { day: 'Yesterday', val: 7.5 }, { day: 'Today', val: 7.2 }
  ];

  const elderExercises = [
    { name: 'Chair Marching', detail: 'Sit tall and gently lift one knee at a time for 1 to 2 minutes.' },
    { name: 'Wall Push-Ups', detail: 'Stand arm-length from a wall and do 8 to 12 slow push-ups.' },
    { name: 'Ankle Circles', detail: 'Lift one foot slightly and make 10 circles in each direction, then switch.' },
    { name: 'Seated Side Stretch', detail: 'Raise one arm overhead and lean gently to each side for 15 seconds.' },
    { name: 'Heel-to-Toe Balance', detail: 'Hold a chair and place one foot in front of the other for 20 seconds.' }
  ];
  
  const [selectedExercise, setSelectedExercise] = useState(
    () => elderExercises[Math.floor(Math.random() * elderExercises.length)]
  );
  
  const newsArticles = [
    { 
      id: 1, 
      title: "Farmer's Market Opens Tomorrow", 
      img: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80",
      content: "The annual spring market returns to the town square tomorrow at 8:00 AM. Expect local honey, fresh bread, and seasonal vegetables from over 20 local vendors."
    },
    { 
      id: 2, 
      title: "City Library Renovation Done", 
      img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80",
      content: "After six months of work, the West Side branch has reopened with new comfortable seating, improved lighting, and a larger large-print book section."
    }
  ];

  const neighborPosts = [
    { id: 1, user: 'Sarah Jenkins', time: '2h ago', type: 'Question', text: 'Does anyone know what time the parade starts on Saturday?' },
    { id: 2, user: 'Mark D.', time: '5h ago', type: 'Alert', text: 'Lost orange tabby cat near 4th street. Please keep an eye out!' },
    { id: 3, user: 'Elena R.', time: '1 day ago', type: 'Social', text: 'Free gardening soil available at my curb if anyone wants it!' }
  ];

  const entertainmentVideos = [
    { id: 1, title: "Funny Cats Compilation", thumb: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80", url: "https://www.youtube.com/watch?v=y0sF5xhGreA" },
    { id: 2, title: "Relaxing Nature Sounds", thumb: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=600&q=80", url: "https://www.youtube.com/watch?v=eKFTSSKCzWA" }
  ];

  const worldNews = [
    { id: 1, title: "New James Webb Space Telescope Images Released", img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Global Health Initiative Shows Promising Results", img: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Record Numbers at International Flower Show", img: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80" }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getNextPill = () => {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;

    let upcomingPills = medications.filter(m => !m.taken).map(m => {
      const [h, min] = m.time.split(':').map(Number);
      const pillTotalMinutes = h * 60 + min;
      return { ...m, pillTotalMinutes };
    });

    upcomingPills.sort((a, b) => a.pillTotalMinutes - b.pillTotalMinutes);
    let nextPill = upcomingPills.find(m => m.pillTotalMinutes > currentTotalMinutes);

    if (nextPill) {
      const diffMinutes = nextPill.pillTotalMinutes - currentTotalMinutes;
      const h = Math.floor(diffMinutes / 60);
      const m = diffMinutes % 60;
      return { pill: nextPill, timeStr: `${h > 0 ? `${h}h ` : ''}${m}m`, isTomorrow: false };
    } else if (upcomingPills.length > 0) {
      const firstTomorrow = upcomingPills[0];
      const diffMinutes = (24 * 60 - currentTotalMinutes) + firstTomorrow.pillTotalMinutes;
      const h = Math.floor(diffMinutes / 60);
      const m = diffMinutes % 60;
      return { pill: firstTomorrow, timeStr: `${h > 0 ? `${h}h ` : ''}${m}m`, isTomorrow: true };
    }
    return null;
  };

  const nextPillInfo = getNextPill();

  const initMemoryGame = () => {
    const deck = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    setCards(deck);
    setMatchedCards([]);
    setFlippedCards([]);
    setActiveGame('memory');
  };

  const initStarGame = () => {
    setScore(0);
    setActiveGame('star');
    moveStar();
  };

  const moveStar = () => {
    setStarPos(Math.floor(Math.random() * 9));
  };

  const handleCardClick = (index) => {
    if (flippedCards.length === 2 || matchedCards.includes(index) || flippedCards.includes(index)) return;
    
    playSound('flip');
    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);
    
    if (newFlipped.length === 2) {
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatchedCards([...matchedCards, ...newFlipped]);
        setFlippedCards([]);
        setTimeout(() => playSound('match'), 100);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const toggleMedication = (id) => {
    setMedications(meds => meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const updateMedicationTime = (id, newTime) => {
    setMedications(meds => meds.map(m => m.id === id ? { ...m, time: newTime } : m));
    setEditingPillId(null);
  };

  const handleAddPill = () => {
    if (newPillName.trim()) {
      setMedications([...medications, { 
        id: Date.now(), 
        name: newPillName, 
        time: newPillTime, 
        taken: false, 
        color: 'bg-purple-100 border-purple-400' 
      }]);
      setNewPillName('');
      setNewPillTime('08:00');
      setIsAddingPill(false);
    }
  };

  const handleAddContact = () => {
    if (newContactName.trim()) {
      const formattedPhone = newContactPhone.replace(/-/g, '');
      setContacts([...contacts, { 
        id: Date.now(), 
        name: newContactName, 
        phone: formattedPhone, 
        icon: <Phone className="w-8 h-8" aria-hidden="true" /> 
      }]);
      setNewContactName('');
      setNewContactPhone('');
      setIsAddingContact(false);
    }
  };

  const formatTimeStr = (time24) => {
    if (!time24) return "";
    let clean = time24.replace(':', '');
    if (clean.length !== 4) clean = clean.padStart(4, '0');
    const h = clean.substring(0, 2);
    const m = clean.substring(2, 4);
    const hNum = parseInt(h, 10);
    const ampm = hNum >= 12 ? 'PM' : 'AM';
    const h12 = hNum % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: 'Good Morning' };
    if (hour < 18) return { text: 'Good Afternoon' };
    return { text: 'Good Evening' };
  };

  const timeString = currentTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const dateString = currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  const getThemeStyles = () => {
    switch (themeMode) {
      case 'contrast':
        return { 
          bg: 'bg-black', text: 'text-white', headerBg: 'bg-black border-white border-b-8', 
          card: 'bg-black border-4 border-white text-white', accent: '#ffffff', btnText: 'text-black',
          pillText: 'text-white', modalBg: 'bg-black border-4 border-white text-white',
          inputBg: 'bg-black border-2 border-white text-white', iconContainer: 'bg-black border-2 border-white text-white',
          saveBtn: 'bg-white text-black', cancelBtn: 'text-white underline',
          moodColors: { good: 'text-white', okay: 'text-white', bad: 'text-white' },
          navContainer: 'bg-black border-4 border-white', navActive: 'bg-white text-black', navInactive: 'text-white opacity-50',
          sosBtn: 'bg-white text-black border-4 border-black',
          tag: 'border-2 border-white bg-black text-white',
          mapFilter: 'grayscale invert contrast-150',
          chatInput: 'bg-black border-2 border-white text-white'
        };
      case 'protanopia':
        return { 
          bg: 'bg-[#002B5B]', text: 'text-[#F9F54B]', headerBg: 'bg-[#002B5B] border-[#F9F54B] border-b-8', 
          card: 'bg-[#002B5B] border-4 border-[#F9F54B] text-[#F9F54B]', accent: '#F9F54B', btnText: 'text-black',
          pillText: 'text-[#F9F54B]', modalBg: 'bg-[#002B5B] border-4 border-[#F9F54B] text-[#F9F54B]',
          inputBg: 'bg-[#002B5B] border-2 border-[#F9F54B] text-[#F9F54B]', iconContainer: 'bg-[#002B5B] border-2 border-[#F9F54B] text-[#F9F54B]',
          saveBtn: 'bg-[#F9F54B] text-black', cancelBtn: 'text-[#F9F54B] underline',
          moodColors: { good: 'text-[#F9F54B]', okay: 'text-[#F9F54B]', bad: 'text-[#F9F54B]' },
          navContainer: 'bg-[#002B5B] border-4 border-[#F9F54B]', navActive: 'bg-[#F9F54B] text-black', navInactive: 'text-[#F9F54B] opacity-50',
          sosBtn: 'bg-[#F9F54B] text-black border-4 border-[#002B5B]',
          tag: 'border-2 border-[#F9F54B] bg-[#002B5B] text-[#F9F54B]',
          mapFilter: 'hue-rotate-180 saturate-200',
          chatInput: 'bg-[#002B5B] border-2 border-[#F9F54B] text-[#F9F54B]'
        };
      case 'tritanopia':
        return { 
          bg: 'bg-[#004242]', text: 'text-[#FFB6B6]', headerBg: 'bg-[#004242] border-[#FFB6B6] border-b-8', 
          card: 'bg-[#004242] border-4 border-[#FFB6B6] text-[#FFB6B6]', accent: '#FFB6B6', btnText: 'text-black',
          pillText: 'text-[#FFB6B6]', modalBg: 'bg-[#004242] border-4 border-[#FFB6B6] text-[#FFB6B6]',
          inputBg: 'bg-[#004242] border-2 border-[#FFB6B6] text-[#FFB6B6]', iconContainer: 'bg-[#004242] border-2 border-[#FFB6B6] text-[#FFB6B6]',
          saveBtn: 'bg-[#FFB6B6] text-black', cancelBtn: 'text-[#FFB6B6] underline',
          moodColors: { good: 'text-[#FFB6B6]', okay: 'text-[#FFB6B6]', bad: 'text-[#FFB6B6]' },
          navContainer: 'bg-[#004242] border-4 border-[#FFB6B6]', navActive: 'bg-[#FFB6B6] text-black', navInactive: 'text-[#FFB6B6] opacity-50',
          sosBtn: 'bg-[#FFB6B6] text-black border-4 border-[#004242]',
          tag: 'border-2 border-[#FFB6B6] bg-[#004242] text-[#FFB6B6]',
          mapFilter: 'hue-rotate-90 saturate-150',
          chatInput: 'bg-[#004242] border-2 border-[#FFB6B6] text-[#FFB6B6]'
        };
      case 'custom':
        return {
          bg: 'theme-custom-bg theme-custom-text', text: 'theme-custom-text', headerBg: 'theme-custom-bg theme-custom-border border-b-8',
          card: 'theme-custom-card', accent: customSec, btnText: 'theme-custom-bg',
          pillText: 'theme-custom-text', modalBg: 'theme-custom-card',
          inputBg: 'theme-custom-bg theme-custom-border theme-custom-text border-2', iconContainer: 'theme-custom-bg theme-custom-border theme-custom-text border-2',
          saveBtn: 'theme-custom-btn', cancelBtn: 'theme-custom-text underline',
          moodColors: { good: 'theme-custom-text', okay: 'theme-custom-text', bad: 'theme-custom-text' },
          navContainer: 'theme-custom-bg theme-custom-border border-4', navActive: 'theme-custom-btn', navInactive: 'theme-custom-text opacity-50',
          sosBtn: 'theme-custom-btn border-4 theme-custom-border',
          tag: 'border-2 theme-custom-border theme-custom-bg theme-custom-text',
          mapFilter: '',
          chatInput: 'theme-custom-bg theme-custom-border theme-custom-text border-2'
        };
      default:
        return { 
          bg: 'bg-slate-50', text: 'text-slate-900', headerBg: 'bg-white border-slate-200 border-b-4 shadow-sm', 
          card: 'bg-white border-2 border-slate-100 shadow-xl', accent: '#3b82f6', btnText: 'text-white',
          pillText: 'text-slate-900', modalBg: 'bg-white text-slate-900 shadow-2xl',
          inputBg: 'bg-white border-4 border-slate-100 text-slate-900', iconContainer: 'bg-white border-2 border-slate-100 text-slate-900 shadow-sm',
          saveBtn: 'bg-blue-600 text-white', cancelBtn: 'text-slate-400 underline',
          moodColors: { good: 'text-green-600', okay: 'text-yellow-600', bad: 'text-slate-600' },
          navContainer: 'bg-white border-2 border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]', navActive: 'bg-blue-600 text-white shadow-md', navInactive: 'text-slate-400 hover:text-slate-900',
          sosBtn: 'bg-red-600 text-white border-4 border-white',
          tag: 'bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded-lg',
          mapFilter: '',
          chatInput: 'bg-slate-50 border-2 border-slate-200 text-slate-900'
        };
    }
  };

  const styles = getThemeStyles();
  const greeting = getGreeting();

  const navItems = [
    { id: 'entertainment', icon: <Tv className="w-8 h-8" aria-hidden="true" />, label: 'Fun' },
    { id: 'health', icon: <Activity className="w-8 h-8" aria-hidden="true" />, label: 'Health' },
    { id: 'home', icon: <HomeIcon className="w-8 h-8" aria-hidden="true" />, label: 'Home' },
    { id: 'contacts', icon: <Users className="w-8 h-8" aria-hidden="true" />, label: 'Contacts' },
    { id: 'community', icon: <MapIcon className="w-8 h-8" aria-hidden="true" />, label: 'Local' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${styles.bg} ${styles.text}`}>
      {/* Inject custom theme styles if custom mode is selected */}
      {themeMode === 'custom' && (
        <style>{`
          body, .min-h-screen { background-color: ${customMain} !important; color: ${customSec} !important; }
          .theme-custom-bg { background-color: ${customMain} !important; }
          .theme-custom-text { color: ${customSec} !important; }
          .theme-custom-border { border-color: ${customSec} !important; }
          .theme-custom-card { background-color: ${customMain} !important; border-color: ${customSec} !important; color: ${customSec} !important; border-width: 4px; border-style: solid; }
          .theme-custom-btn { background-color: ${customSec} !important; color: ${customMain} !important; border-color: ${customMain} !important; }
        `}</style>
      )}

      <div className="max-w-md mx-auto min-h-screen flex flex-col relative pb-64">
        
        {/* HEADER */}
        <header className={`${styles.headerBg} px-6 py-8 rounded-b-[3rem] relative transition-all`} aria-label="App Header">
          <div className="flex flex-col items-center text-center">
            <h1 className={`text-6xl font-black tracking-tighter mb-1 leading-none ${styles.text}`} aria-live="polite">{timeString}</h1>
            <p className={`text-2xl font-bold opacity-70 uppercase tracking-wide mb-5 ${styles.text}`}>{dateString}</p>
            
            <button 
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Open Settings"
              className={`flex items-center justify-center gap-3 w-48 py-3 rounded-full border-2 active:scale-95 transition-all shadow-sm ${themeMode !== 'default' ? 'border-current' : 'border-slate-300 bg-slate-100 text-slate-700'}`}
            >
              <Settings className="w-6 h-6" aria-hidden="true" />
              <span className="text-xl font-bold">Settings</span>
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="px-4 py-6 space-y-6 flex-1" aria-label="Main Content">
          
          {/* TAB: HOME */}
          {activeTab === 'home' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6" aria-label="Home Tab">
              
              {/* Welcome Screen */}
              <section className={`${styles.card} rounded-[2.5rem] p-8 transition-all overflow-hidden relative`} aria-label="Welcome section">
                <div className="flex flex-col">
                  <h2 className="text-4xl font-black">Welcome, {userName}</h2>
                  <p className="text-xl font-bold opacity-70 mb-4">{greeting.text}</p>
                  <p className="text-lg font-bold opacity-80" aria-live="polite">
                    {currentTime.getHours() < 12 
                      ? "Have a coffee and check your morning pills." 
                      : currentTime.getHours() < 18 
                      ? "The sun is out! Maybe a short walk later?" 
                      : "Time to wind down and relax for the night."}
                  </p>
                </div>
              </section>

              {/* Pill Reminder Module directly below welcome section */}
              {nextPillInfo && (
                <div 
                  className={`p-5 rounded-[2.5rem] border-4 flex items-center gap-5 transition-all ${themeMode !== 'default' && themeMode !== 'custom' ? 'border-current bg-transparent' : themeMode === 'custom' ? 'theme-custom-border' : 'bg-blue-50 border-blue-200 text-slate-900'}`} 
                  aria-label={`Next pill reminder: ${nextPillInfo.pill.name} in ${nextPillInfo.timeStr}`}
                  role="region"
                >
                   <div className={`p-4 rounded-full flex items-center justify-center ${themeMode === 'default' ? 'bg-blue-200 text-blue-700' : styles.iconContainer}`}>
                     <Pill className="w-8 h-8" aria-hidden="true" />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black leading-tight mb-1">{nextPillInfo.pill.name}</h3>
                      <p className="text-lg font-bold opacity-80" aria-live="polite">
                        Due in: <span className="font-black text-xl">{nextPillInfo.timeStr}</span> {nextPillInfo.isTomorrow && '(Tomorrow)'}
                      </p>
                   </div>
                </div>
              )}

              {!mood ? (
                <section className={`${styles.card} rounded-[2.5rem] p-8 transition-all`} aria-label="Mood tracker">
                  <h2 className="text-3xl font-black text-center mb-8 flex items-center justify-center gap-3">
                    <Heart className="w-10 h-10 fill-current" aria-hidden="true" /> 
                    How are you?
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {['good', 'okay', 'bad'].map(m => (
                      <button 
                        key={m} 
                        onClick={() => setMood(m)} 
                        aria-label={`I feel ${m}`}
                        className={`flex items-center gap-6 p-6 rounded-3xl border-4 active:scale-95 transition-all ${themeMode !== 'default' ? 'border-current bg-transparent' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                      >
                        <div className={`p-3 rounded-full flex items-center justify-center ${styles.iconContainer}`}>
                          {m === 'good' && <Smile className={`w-12 h-12 ${styles.moodColors.good}`} aria-hidden="true" />}
                          {m === 'okay' && <Meh className={`w-12 h-12 ${styles.moodColors.okay}`} aria-hidden="true" />}
                          {m === 'bad' && <Frown className={`w-12 h-12 ${styles.moodColors.bad}`} aria-hidden="true" />}
                        </div>
                        <span className="text-3xl font-black capitalize">I feel {m}</span>
                      </button>
                    ))}
                  </div>
                </section>
              ) : (
                <div className={`${styles.card} rounded-[2.5rem] p-8 text-center animate-in zoom-in transition-all relative overflow-hidden`} aria-live="polite">
                  <div className={`absolute top-0 left-0 w-2 h-full ${mood === 'good' ? 'bg-green-500' : mood === 'okay' ? 'bg-yellow-500' : 'bg-red-500'}`} aria-hidden="true"></div>
                  <h2 className="text-4xl font-black mb-4 leading-tight">
                    {mood === 'good' ? 'Wonderful!' : mood === 'okay' ? 'Take it easy' : 'We all have tough days'}
                  </h2>
                  <p className="text-xl font-bold opacity-80 mb-6">
                    {mood === 'good' ? "That's wonderful! It's a great time to do a puzzle, tend to a hobby, or maybe call a friend to share your good mood." : 
                     mood === 'okay' ? "That's perfectly fine. Maybe listen to some relaxing music, read a good book, or enjoy a warm cup of tea." : 
                     "I'm sorry you're feeling down. Try resting in a comfortable chair, watching your favorite show, or simply taking some deep breaths."}
                  </p>
                  <button onClick={() => setMood(null)} className="text-2xl font-bold underline opacity-60 mt-4 p-2" aria-label="Change your current mood">Change mood</button>
                </div>
              )}
            </div>
          )}

          {/* TAB: HEALTH */}
          {activeTab === 'health' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" aria-label="Health Tab">
              <div className="grid grid-cols-3 gap-3">
                <div className={`${styles.card} rounded-[2rem] p-4 text-center flex flex-col items-center justify-center`} aria-label="Heart Rate: 72 BPM">
                  <HeartPulse className="w-8 h-8 mb-2 opacity-80" aria-hidden="true" />
                  <span className="text-xl font-black">72</span>
                  <span className="text-sm font-bold opacity-60">BPM</span>
                </div>
                <div className={`${styles.card} rounded-[2rem] p-4 text-center flex flex-col items-center justify-center`} aria-label="Steps: 4,320">
                  <Footprints className="w-8 h-8 mb-2 opacity-80" aria-hidden="true" />
                  <span className="text-xl font-black">4,320</span>
                  <span className="text-sm font-bold opacity-60">Steps</span>
                </div>
                <div className={`${styles.card} rounded-[2rem] p-4 text-center flex flex-col items-center justify-center`} aria-label="Sleep: 7 hours 12 minutes">
                  <Moon className="w-8 h-8 mb-2 opacity-80" aria-hidden="true" />
                  <span className="text-xl font-black">7h 12m</span>
                  <span className="text-sm font-bold opacity-60">Sleep</span>
                </div>
            </div>

            <section className={`${styles.card} rounded-[2.5rem] p-6 transition-all`} aria-label="Daily easy exercise recommendation">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h2 className="text-2xl font-black flex items-center gap-2">
                    <Lightbulb className="w-6 h-6" aria-hidden="true" />
                    Easy Exercise
                  </h2>
                  <button
                    onClick={() => setSelectedExercise(elderExercises[Math.floor(Math.random() * elderExercises.length)])}
                    aria-label="Show another easy exercise"
                    className={`px-4 py-2 rounded-2xl border-2 font-bold active:scale-95 transition-all ${themeMode !== 'default' ? 'border-current bg-transparent' : 'border-slate-200 bg-slate-100 text-slate-800'}`}
                  >
                    New one
                  </button>
                </div>
                <div className={`p-5 rounded-[2rem] border-4 ${themeMode !== 'default' ? 'border-current bg-transparent' : 'border-emerald-200 bg-emerald-50 text-slate-900'}`}>
                  <h3 className="text-2xl font-black mb-2">{selectedExercise.name}</h3>
                  <p className="text-lg font-bold opacity-80 leading-relaxed">{selectedExercise.detail}</p>
                </div>
            </section>

              
              {/* Health Trends */}
              <section className={`${styles.card} rounded-[2.5rem] p-6 transition-all`} aria-label="Health Trends Graphs">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><Activity className="w-6 h-6" aria-hidden="true" /> Health Trends</h2>
                <div className="space-y-8">
                  
                  {/* Heart Rate Line Graph */}
                  <div aria-label="Heart Rate graph over past 24 hours">
                    <h3 className="text-xl font-bold mb-3 opacity-90">Heart Rate (Past 24h)</h3>
                    <div className={`p-4 rounded-2xl ${themeMode !== 'default' ? 'border-2 border-current bg-transparent' : 'bg-slate-50 border-2 border-slate-100'}`} aria-hidden="true">
                      <svg viewBox="0 0 300 100" className="w-full h-32 overflow-visible">
                        <polyline 
                          points={hrData.map((d, i) => `${i * 50},${90 - (d.val / 150) * 70}`).join(' ')} 
                          fill="none" 
                          stroke={themeMode !== 'default' ? 'currentColor' : '#f43f5e'} 
                          strokeWidth="4" 
                          strokeLinejoin="round" 
                          strokeLinecap="round" 
                        />
                        {hrData.map((d, i) => (
                          <g key={d.time}>
                            <circle cx={i * 50} cy={90 - (d.val / 150) * 70} r="5" fill={themeMode !== 'default' ? 'currentColor' : '#f43f5e'} />
                            <text x={i * 50} y={90 - (d.val / 150) * 70 - 12} fontSize="12" fill="currentColor" textAnchor="middle" fontWeight="bold">{d.val}</text>
                          </g>
                        ))}
                      </svg>
                      <div className="flex justify-between mt-4">
                        {hrData.map(d => <span key={d.time} className="text-[10px] font-bold opacity-70 w-8 text-center leading-tight">{d.time}</span>)}
                      </div>
                    </div>
                  </div>

                  {/* Steps Line Graph */}
                  <div aria-label="Steps graph over past week">
                    <h3 className="text-xl font-bold mb-3 opacity-90">Steps (Past Week)</h3>
                    <div className={`p-4 rounded-2xl ${themeMode !== 'default' ? 'border-2 border-current bg-transparent' : 'bg-slate-50 border-2 border-slate-100'}`} aria-hidden="true">
                      <svg viewBox="0 0 300 100" className="w-full h-32 overflow-visible">
                        <polyline 
                          points={stepsData.map((d, i) => `${i * 50},${90 - (d.val / 6000) * 70}`).join(' ')} 
                          fill="none" 
                          stroke={themeMode !== 'default' ? 'currentColor' : '#6366f1'} 
                          strokeWidth="4" 
                          strokeLinejoin="round" 
                          strokeLinecap="round" 
                        />
                        {stepsData.map((d, i) => (
                          <g key={d.day}>
                            <circle cx={i * 50} cy={90 - (d.val / 6000) * 70} r="5" fill={themeMode !== 'default' ? 'currentColor' : '#6366f1'} />
                            <text x={i * 50} y={90 - (d.val / 6000) * 70 - 12} fontSize="12" fill="currentColor" textAnchor="middle" fontWeight="bold">{d.val}</text>
                          </g>
                        ))}
                      </svg>
                      <div className="flex justify-between mt-4">
                        {stepsData.map(d => <span key={d.day} className="text-[10px] font-bold opacity-70 w-8 text-center leading-tight">{d.day}</span>)}
                      </div>
                    </div>
                  </div>

                  {/* Sleep Line Graph */}
                  <div aria-label="Sleep graph over past week">
                    <h3 className="text-xl font-bold mb-3 opacity-90">Sleep (Past Week)</h3>
                    <div className={`p-4 rounded-2xl ${themeMode !== 'default' ? 'border-2 border-current bg-transparent' : 'bg-slate-50 border-2 border-slate-100'}`} aria-hidden="true">
                      <svg viewBox="0 0 300 100" className="w-full h-32 overflow-visible">
                        <polyline 
                          points={sleepData.map((d, i) => `${i * 50},${90 - (d.val / 10) * 70}`).join(' ')} 
                          fill="none" 
                          stroke={themeMode !== 'default' ? 'currentColor' : '#3b82f6'} 
                          strokeWidth="4" 
                          strokeLinejoin="round" 
                          strokeLinecap="round" 
                        />
                        {sleepData.map((d, i) => (
                          <g key={d.day}>
                            <circle cx={i * 50} cy={90 - (d.val / 10) * 70} r="5" fill={themeMode !== 'default' ? 'currentColor' : '#3b82f6'} />
                            <text x={i * 50} y={90 - (d.val / 10) * 70 - 12} fontSize="12" fill="currentColor" textAnchor="middle" fontWeight="bold">{d.val}</text>
                          </g>
                        ))}
                      </svg>
                      <div className="flex justify-between mt-4">
                        {sleepData.map(d => <span key={d.day} className="text-[10px] font-bold opacity-70 w-8 text-center leading-tight">{d.day}</span>)}
                      </div>
                    </div>
                  </div>

                </div>
              </section>

              {/* Food of the Day */}
              <section className={`${styles.card} rounded-[2.5rem] p-6 transition-all`} aria-label="Food of the Day recommendation">
                <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><Utensils className="w-6 h-6" aria-hidden="true" /> Food of the Day</h2>
                <div className={`p-4 rounded-[2rem] border-4 ${themeMode !== 'default' ? 'border-current bg-transparent' : 'border-slate-100 bg-slate-50'}`}>
                  <img src="https://static.vecteezy.com/system/resources/thumbnails/072/926/777/small/a-healthy-and-delicious-breakfast-bowl-of-oatmeal-porridge-topped-with-fresh-berries-banana-and-walnuts-photo.jpg" alt="A healthy breakfast bowl of oatmeal porridge topped with fresh berries, banana and walnuts" className="w-full h-48 object-cover rounded-[1.5rem] mb-4 shadow-sm" />
                  <h3 className="text-2xl font-black mb-2">Berry Oatmeal Bowl</h3>
                  <p className="text-lg font-bold opacity-80 mb-5 leading-relaxed">
                    A heart-healthy, high-fiber breakfast that is incredibly easy to prepare and great for digestion.
                  </p>
                  <button 
                    onClick={() => setIsRecipeOpen(true)} 
                    aria-label="Read full recipe for Berry Oatmeal Bowl"
                    className={`w-full py-4 rounded-2xl font-black text-xl active:scale-95 transition-all shadow-md ${styles.saveBtn}`}
                  >
                    Read Recipe
                  </button>
                </div>
              </section>

              <section className={`${styles.card} rounded-[2.5rem] p-8 transition-all`} aria-label="Medication list">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black flex items-center gap-3">
                    <Pill className="w-8 h-8" aria-hidden="true" /> My Pills
                  </h2>
                  <button 
                    onClick={() => setIsAddingPill(true)} 
                    aria-label="Add new pill medication"
                    className={`${styles.btnText} p-4 rounded-2xl shadow-lg active:scale-90`} 
                    style={{ backgroundColor: styles.accent }}
                  >
                    <Plus className="w-8 h-8" aria-hidden="true" />
                  </button>
                </div>
                <div className="space-y-4">
                  {medications.map((med) => (
                    <div key={med.id} className={`w-full text-left p-6 rounded-[2rem] border-4 flex items-center justify-between transition-all ${med.taken ? 'opacity-40 grayscale' : themeMode !== 'default' && themeMode !== 'custom' ? 'bg-transparent border-current' : themeMode === 'custom' ? 'theme-custom-border' : med.color}`}>
                      <div className={med.taken ? 'opacity-50' : styles.pillText}>
                        <h3 className={`text-2xl font-black leading-tight ${med.taken ? 'line-through' : ''}`} aria-label={`Medication: ${med.name}`}>{med.name}</h3>
                        {editingPillId === med.id ? (
                          <div className="flex items-center gap-2 mt-2">
                            <input 
                              type="time" 
                              value={med.time} 
                              onChange={(e) => updateMedicationTime(med.id, e.target.value)} 
                              aria-label={`Set new time for ${med.name}`}
                              className={`p-2 rounded-lg text-lg font-bold border-2 ${styles.inputBg}`} 
                              autoFocus 
                              onBlur={() => setEditingPillId(null)} 
                            />
                            <button onClick={() => setEditingPillId(null)} aria-label="Save time" className="p-2 bg-slate-800 text-white rounded-lg text-sm font-bold">Done</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xl font-bold opacity-80" aria-label={`Scheduled for ${formatTimeStr(med.time)}`}>Take at {formatTimeStr(med.time)}</p>
                            {!med.taken && <button onClick={() => setEditingPillId(med.id)} aria-label={`Edit schedule time for ${med.name}`} className="p-2 opacity-60 hover:opacity-100"><Edit2 className="w-5 h-5" aria-hidden="true" /></button>}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => toggleMedication(med.id)} 
                        aria-label={med.taken ? `Mark ${med.name} as not taken` : `Mark ${med.name} as taken`}
                        className="p-2 active:scale-90 transition-transform"
                      >
                        {med.taken ? <CheckCircle className="w-12 h-12" aria-hidden="true" /> : <div className="w-10 h-10 rounded-full border-4 border-current opacity-50" aria-hidden="true"></div>}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* TAB: CONTACTS */}
          {activeTab === 'contacts' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" aria-label="Contacts Tab">
              
              {/* Notifications Box */}
              <section className={`${styles.card} rounded-[2.5rem] p-8 transition-all`} aria-label="Notifications section">
                <h2 className="text-3xl font-black mb-6 flex items-center gap-3"><Bell className="w-8 h-8" aria-hidden="true" /> Notifications</h2>
                <div className="overflow-y-auto max-h-64 pr-2 space-y-3" aria-live="polite">
                  {notifications.map(notif => (
                    <div key={notif.id} className={`p-5 border-4 rounded-2xl ${notif.read ? 'opacity-60' : 'border-blue-400 bg-blue-50'} ${themeMode !== 'default' && themeMode !== 'custom' ? 'border-current bg-transparent' : themeMode === 'custom' ? 'theme-custom-border' : 'border-slate-200'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-black text-xl">{notif.from}</span>
                        <span className="text-sm font-bold opacity-60">{notif.time}</span>
                      </div>
                      <p className="text-lg font-bold leading-snug">{notif.text}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className={`${styles.card} rounded-[2.5rem] p-8 transition-all`} aria-label="Saved Contacts">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black flex items-center gap-3"><Phone className="w-8 h-8" aria-hidden="true" /> Contacts</h2>
                  <button 
                    onClick={() => setIsAddingContact(true)} 
                    aria-label="Add new contact"
                    className={`${styles.btnText} p-4 rounded-2xl shadow-lg active:scale-90`} 
                    style={{ backgroundColor: styles.accent }}
                  >
                    <UserPlus className="w-8 h-8" aria-hidden="true" />
                  </button>
                </div>
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <button 
                      key={contact.id} 
                      onClick={() => alert(`Calling ${contact.name}...`)} 
                      aria-label={`Call ${contact.name} at ${contact.phone}`}
                      className={`w-full flex items-center p-5 rounded-[2rem] border-4 active:scale-95 transition-all ${themeMode !== 'default' && themeMode !== 'custom' ? 'bg-transparent border-current' : themeMode === 'custom' ? 'theme-custom-border' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    >
                      <div className={`p-4 rounded-2xl mr-5 flex items-center justify-center ${styles.iconContainer}`} aria-hidden="true">{contact.icon}</div>
                      <div className="text-left flex-1">
                        <h3 className="text-2xl font-black mb-1">{contact.name}</h3>
                        <p className="text-xl font-bold opacity-70 tracking-widest">{contact.phone}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

            </div>
          )}

          {/* TAB: COMMUNITY */}
          {activeTab === 'community' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-12" aria-label="Community Tab">
              
              <section className={`${styles.card} rounded-[2.5rem] p-6 transition-all overflow-hidden`} aria-label="Local Area Map">
                <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><MapIcon className="w-6 h-6" aria-hidden="true" /> Local Map</h2>
                <div className={`w-full h-64 rounded-[2rem] border-4 overflow-hidden relative ${themeMode !== 'default' && themeMode !== 'custom' ? 'border-current' : themeMode === 'custom' ? 'theme-custom-border' : 'border-slate-200 shadow-inner'}`}>
                  <iframe 
                    title="Interactive Community Map of Bellevue Area"
                    aria-label="Interactive map showing local points of interest"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2688.0772274472854!2d-122.14376372333796!3d47.64415497119293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54906d4e51147e85%3A0x1d3f2ec4841fb00c!2sInterlake%20High%20School!5e0!3m2!1sen!2sus!4v1715638200000!5m2!1sen!2sus" 
                    width="100%" height="100%" className={`border-0 transition-all ${styles.mapFilter}`} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </section>

              <section className={`${styles.card} rounded-[2.5rem] p-6 transition-all`} aria-label="Local News">
                <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><Newspaper className="w-6 h-6" aria-hidden="true" /> Local News</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                  {newsArticles.map((article) => (
                    <button 
                      key={article.id} 
                      onClick={() => setSelectedNews(article)} 
                      aria-label={`Read more about ${article.title}`}
                      className={`min-w-[240px] border-4 rounded-[2rem] p-4 snap-start text-left active:scale-95 transition-all ${themeMode !== 'default' && themeMode !== 'custom' ? 'border-current' : themeMode === 'custom' ? 'theme-custom-border' : 'border-slate-100 bg-slate-50 shadow-sm'}`}
                    >
                      <img src={article.img} alt={`Thumbnail for ${article.title}`} className="w-full h-28 object-cover rounded-xl mb-3" />
                      <h3 className="font-black text-lg leading-tight mb-2">{article.title}</h3>
                      <div className="flex items-center justify-between opacity-60 font-bold text-sm" aria-hidden="true">
                        <span>Read More</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className={`${styles.card} rounded-[2.5rem] p-6 transition-all`} aria-label="Neighbor Chat Group">
                <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><MessageSquare className="w-6 h-6" aria-hidden="true" /> Neighbor Chat</h2>
                <div className={`mb-6 p-4 rounded-[2rem] border-4 ${themeMode !== 'default' && themeMode !== 'custom' ? 'border-current' : themeMode === 'custom' ? 'theme-custom-border' : 'border-slate-200'}`}>
                  <textarea 
                    value={chatMessage} 
                    onChange={(e) => setChatMessage(e.target.value)} 
                    aria-label="Type a message to your neighbors"
                    placeholder="Type a message to neighbors..." 
                    className={`w-full min-h-[100px] p-4 rounded-xl text-xl font-bold resize-none mb-4 outline-none transition-all ${styles.chatInput}`} 
                  />
                  <button 
                    onClick={() => { if(chatMessage) { alert("Message sent!"); setChatMessage(""); } }} 
                    aria-label="Post message to neighbor chat"
                    className={`w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-black text-lg active:scale-95 transition-all shadow-lg ${styles.saveBtn}`}
                  >
                    <Send className="w-6 h-6" aria-hidden="true" /> Post
                  </button>
                </div>
                <div className="space-y-4" aria-live="polite">
                  {neighborPosts.map((post) => (
                    <div key={post.id} className={`p-5 border-4 rounded-[2rem] ${themeMode !== 'default' && themeMode !== 'custom' ? 'border-current' : themeMode === 'custom' ? 'theme-custom-border' : 'border-slate-100 bg-slate-50'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col">
                          <span className="font-black text-xl leading-none">{post.user}</span>
                          <div className="flex items-center gap-2 mt-1 opacity-60 text-sm font-bold" aria-label={`Posted ${post.time}`}>
                            <Clock className="w-4 h-4" aria-hidden="true" />
                            <span>{post.time}</span>
                          </div>
                        </div>
                        <span className={`text-xs font-black uppercase tracking-wider py-1 px-3 rounded-full border-2 ${themeMode !== 'default' ? 'border-current' : styles.tag}`} aria-label={`Post tag: ${post.type}`}>
                          {post.type}
                        </span>
                      </div>
                      <p className="text-lg font-bold leading-relaxed">{post.text}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Trusted Services List */}
              <section className={`${styles.card} rounded-[2.5rem] p-6 transition-all`} aria-label="Trusted Services List">
                <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><ShieldCheck className="w-6 h-6" aria-hidden="true" /> Trusted Services</h2>
                <p className="text-sm font-bold opacity-70 mb-4">Highly rated local helpers recommended by neighbors.</p>
                <div className="space-y-4">
                  {trustedServices.map(service => (
                     <div key={service.id} className={`p-5 border-4 rounded-[2rem] flex justify-between items-center ${themeMode !== 'default' && themeMode !== 'custom' ? 'border-current' : themeMode === 'custom' ? 'theme-custom-border' : 'border-slate-100 bg-slate-50'}`}>
                        <div>
                          <h3 className="font-black text-xl mb-1">{service.name}</h3>
                          <div className="font-bold opacity-70 text-sm flex items-center gap-3">
                             <span className="flex items-center gap-1" aria-label={`Service type: ${service.type}`}><Wrench className="w-4 h-4" aria-hidden="true" /> {service.type}</span>
                             <span className="flex items-center gap-1" aria-label={`Rating: ${service.rating} stars`}><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" aria-hidden="true" /> {service.rating}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => alert(`Calling ${service.name}...`)} 
                          aria-label={`Call ${service.name}`}
                          className={`p-4 rounded-full active:scale-95 shadow-md ${styles.saveBtn}`}
                        >
                          <Phone className="w-6 h-6" aria-hidden="true" />
                        </button>
                     </div>
                  ))}
                </div>
              </section>

            </div>
          )}

          {/* TAB: ENTERTAINMENT */}
          {activeTab === 'entertainment' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-12" aria-label="Entertainment Tab">
               
               {/* Short Story Component */}
               <section className={`${styles.card} rounded-[2.5rem] p-6 transition-all`} aria-label="Random Short Story">
                 <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><BookOpen className="w-6 h-6" aria-hidden="true" /> Short Story</h2>
                 <div className={`p-5 rounded-[2rem] border-4 ${themeMode !== 'default' && themeMode !== 'custom' ? 'border-current' : themeMode === 'custom' ? 'theme-custom-border' : 'border-slate-200 bg-slate-50'}`}>
                   {isLoadingStory && !currentStory ? (
                     <p className="font-bold opacity-70 text-lg" aria-live="polite">Finding a story for you...</p>
                   ) : currentStory ? (
                     <>
                       <h3 className="text-2xl font-black mb-1">{currentStory.title}</h3>
                       <p className="opacity-70 font-bold mb-5 text-lg">by {currentStory.author}</p>
                       <div className="flex flex-col gap-3">
                         <button 
                           onClick={() => setIsStoryModalOpen(true)} 
                           aria-label={`Read story: ${currentStory.title}`} 
                           className={`w-full py-4 rounded-2xl font-black text-xl active:scale-95 transition-all shadow-md ${styles.saveBtn}`}
                         >
                           Read
                         </button>
                         <button 
                           onClick={fetchNewStory} 
                           aria-label="Fetch a new random story" 
                           className={`w-full py-4 rounded-2xl font-black text-xl active:scale-95 transition-all border-4 ${themeMode !== 'default' && themeMode !== 'custom' ? 'border-current' : themeMode === 'custom' ? 'theme-custom-border theme-custom-text' : 'border-slate-300 bg-white text-slate-800'}`}
                         >
                           {isLoadingStory ? 'Loading...' : 'New Story'}
                         </button>
                       </div>
                     </>
                   ) : (
                     <p className="font-bold opacity-70 text-lg">Failed to load story. Please try again.</p>
                   )}
                 </div>
               </section>

               {/* Fact of the Day */}
               <section className={`${styles.card} rounded-[2.5rem] p-6 transition-all`} aria-label="Fact of the Day">
                 <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><Lightbulb className="w-6 h-6" aria-hidden="true" /> Fact of the Day</h2>
                 <div className={`p-6 rounded-[2rem] border-4 ${themeMode !== 'default' ? 'border-current bg-transparent' : 'border-slate-100 bg-slate-50'}`}>
                    <p className="text-xl font-bold leading-relaxed">
                      Did you know? Honey never spoils! Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.
                    </p>
                 </div>
               </section>

               <section className={`${styles.card} rounded-[2.5rem] p-6 transition-all`} aria-label="Simple Games Collection">
                 <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><Gamepad2 className="w-6 h-6" aria-hidden="true" /> Simple Games</h2>
                 <div className="space-y-4">
                    <div className={`p-5 rounded-[2rem] border-4 flex justify-between items-center ${themeMode !== 'default' && themeMode !== 'custom' ? 'border-current' : themeMode === 'custom' ? 'theme-custom-border' : 'border-slate-200 bg-slate-50'}`}>
                        <div>
                           <h3 className="text-2xl font-black">Memory Match</h3>
                           <p className="opacity-70 font-bold mt-1 text-lg">Find the pairs</p>
                        </div>
                        <button onClick={initMemoryGame} aria-label="Play Memory Match Game" className={`px-6 py-4 rounded-2xl font-black text-xl active:scale-95 transition-all shadow-md ${styles.saveBtn}`}>Play</button>
                    </div>
                    <div className={`p-5 rounded-[2rem] border-4 flex justify-between items-center ${themeMode !== 'default' && themeMode !== 'custom' ? 'border-current' : themeMode === 'custom' ? 'theme-custom-border' : 'border-slate-200 bg-slate-50'}`}>
                        <div>
                           <h3 className="text-2xl font-black">Tap the Star</h3>
                           <p className="opacity-70 font-bold mt-1 text-lg">Fun and quick</p>
                        </div>
                        <button onClick={initStarGame} aria-label="Play Tap the Star Game" className={`px-6 py-4 rounded-2xl font-black text-xl active:scale-95 transition-all shadow-md ${styles.saveBtn}`}>Play</button>
                    </div>
                 </div>
               </section>

               <section className={`${styles.card} rounded-[2.5rem] p-6 transition-all`} aria-label="Popular Entertainment Videos">
                 <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><Tv className="w-6 h-6" aria-hidden="true" /> Popular Videos</h2>
                 <div className="space-y-5">
                    {entertainmentVideos.map(video => (
                       <a 
                         key={video.id} 
                         href={video.url} 
                         target="_blank" 
                         rel="noreferrer" 
                         aria-label={`Watch video: ${video.title} (Opens in new tab)`}
                         className={`block p-4 rounded-[2rem] border-4 active:scale-95 transition-all ${themeMode !== 'default' && themeMode !== 'custom' ? 'border-current' : themeMode === 'custom' ? 'theme-custom-border' : 'border-slate-200 bg-slate-50'}`}
                       >
                           <div className="relative h-40 mb-3 rounded-xl overflow-hidden" aria-hidden="true">
                              <img src={video.thumb} alt={`Thumbnail for ${video.title}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Play className="w-14 h-14 text-white opacity-90" fill="currentColor" /></div>
                           </div>
                           <h3 className="text-xl font-black flex justify-between items-center leading-tight">{video.title}<ExternalLink className="w-6 h-6 opacity-50 ml-2 shrink-0" aria-hidden="true" /></h3>
                       </a>
                    ))}
                 </div>
               </section>

               <section className={`${styles.card} rounded-[2.5rem] p-6 transition-all`} aria-label="World News">
                 <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><Globe className="w-6 h-6" aria-hidden="true" /> World News</h2>
                 <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                   {worldNews.map(news => (
                     <div key={news.id} className={`min-w-[240px] border-4 rounded-[2rem] p-4 snap-start text-left ${themeMode !== 'default' && themeMode !== 'custom' ? 'border-current' : themeMode === 'custom' ? 'theme-custom-border' : 'border-slate-100 bg-slate-50 shadow-sm'}`}>
                       <img src={news.img} alt={`Image for news: ${news.title}`} className="w-full h-32 object-cover rounded-xl mb-3" />
                       <h3 className="font-black text-lg leading-tight mb-2">{news.title}</h3>
                     </div>
                   ))}
                 </div>
               </section>
            </div>
          )}

        </main>

        {/* SOS BUTTON */}
        <div className="fixed bottom-32 left-0 right-0 px-6 max-w-md mx-auto z-40">
          <button 
            onClick={() => setSosActive(true)} 
            aria-label="Activate Emergency SOS"
            className={`w-full shadow-2xl flex items-center justify-center active:scale-95 transition-all ${styles.sosBtn}`}
            style={{ padding: '24px', borderRadius: '40px', gap: '16px' }}
          >
            <AlertCircle style={{ width: '48px', height: '48px' }} aria-hidden="true" />
            <span style={{ fontSize: '36px', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1 }}>Emergency SOS</span>
          </button>
        </div>

        {/* NAVIGATION */}
        <nav 
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md rounded-[2.5rem] p-3 flex justify-between items-center z-40 transition-all ${styles.navContainer}`}
          aria-label="Main Navigation Bottom Bar"
        >
          {navItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              aria-label={`Maps to ${item.label} tab`}
              aria-current={activeTab === item.id ? "page" : undefined}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all ${activeTab === item.id ? `${styles.navActive} scale-110` : `${styles.navInactive} hover:scale-105 hover:opacity-100`}`}
            >
              {item.icon}
              <span className="text-[10px] font-black mt-1 tracking-wider uppercase" aria-hidden="true">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* STORY MODAL */}
        {isStoryModalOpen && currentStory && (
          <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[90] flex items-center justify-center p-4" aria-modal="true" role="dialog" aria-label={`Reading story: ${currentStory.title}`}>
            <div className={`${styles.modalBg} w-full max-w-md rounded-[3rem] p-8 overflow-y-auto max-h-[90vh]`}>
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-3xl font-black leading-tight flex-1 mr-4">{currentStory.title}</h2>
                <button onClick={() => setIsStoryModalOpen(false)} aria-label="Close story" className={`p-3 rounded-full flex-shrink-0 ${styles.iconContainer}`}><X className="w-8 h-8" aria-hidden="true" /></button>
              </div>
              <p className="opacity-70 font-bold mb-8 text-xl">by {currentStory.author}</p>

              <div className="space-y-6">
                <p className="text-xl font-bold opacity-90 leading-relaxed whitespace-pre-wrap">
                  {currentStory.story}
                </p>

                {currentStory.moral && (
                  <div className={`p-5 mt-8 rounded-2xl border-4 ${themeMode !== 'default' && themeMode !== 'custom' ? 'border-current bg-transparent' : themeMode === 'custom' ? 'theme-custom-border theme-custom-bg' : 'border-blue-200 bg-blue-50 text-slate-900'}`}>
                    <h4 className="font-black text-xl mb-2 uppercase tracking-wide">Moral</h4>
                    <p className="text-xl font-bold leading-snug">{currentStory.moral}</p>
                  </div>
                )}
              </div>

              <button onClick={() => setIsStoryModalOpen(false)} aria-label="Done reading story" className={`w-full text-2xl font-black py-5 rounded-[2rem] mt-8 shadow-md ${styles.saveBtn}`}>Done</button>
            </div>
          </div>
        )}

        {/* GAME MODAL: MEMORY MATCH */}
        {activeGame === 'memory' && (
          <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" aria-label="Memory Match Game Modal">
            <div className={`${styles.modalBg} flex flex-col items-center`} style={{ width: '100%', maxWidth: '448px', padding: '32px', borderRadius: '48px' }}>
              <div className="w-full flex items-center justify-between" style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '36px', fontWeight: 900 }}>Memory Match</h2>
                <button onClick={() => setActiveGame(null)} aria-label="Close Game" className={`rounded-full ${styles.iconContainer}`} style={{ padding: '12px' }}>
                  <X style={{ width: '40px', height: '40px' }} aria-hidden="true" />
                </button>
              </div>
              <div className="grid grid-cols-3 w-full" style={{ gap: '12px', marginBottom: '32px' }}>
                {cards.map((emoji, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleCardClick(i)} 
                    aria-label={`Memory card ${i + 1}, ${flippedCards.includes(i) || matchedCards.includes(i) ? `revealing ${emoji}` : 'hidden'}`}
                    className={`border-4 flex items-center justify-center transition-all ${themeMode !== 'default' && themeMode !== 'custom' ? 'border-current bg-transparent' : themeMode === 'custom' ? 'theme-custom-border' : matchedCards.includes(i) ? 'bg-green-100 border-green-500' : flippedCards.includes(i) ? 'bg-white border-blue-500' : 'bg-slate-200 border-slate-300'}`} 
                    style={{ height: '96px', borderRadius: '16px', fontSize: '48px' }}
                  >
                    {(flippedCards.includes(i) || matchedCards.includes(i)) ? emoji : '?'}
                  </button>
                ))}
              </div>
              {matchedCards.length === cards.length && <p style={{ fontSize: '30px', fontWeight: 900, marginBottom: '16px' }} aria-live="polite">Well Done!</p>}
              <button onClick={initMemoryGame} aria-label="Restart Memory Match Game" className={`w-full ${styles.saveBtn}`} style={{ fontSize: '30px', fontWeight: 900, padding: '24px 0', borderRadius: '32px' }}>Restart</button>
            </div>
          </div>
        )}

        {/* GAME MODAL: TAP THE STAR */}
        {activeGame === 'star' && (
          <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" aria-label="Tap The Star Game Modal">
            <div className={`${styles.modalBg} flex flex-col items-center`} style={{ width: '100%', maxWidth: '448px', padding: '32px', borderRadius: '48px' }}>
              <div className="w-full flex items-center justify-between" style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '36px', fontWeight: 900 }}>Tap the Star</h2>
                <button onClick={() => setActiveGame(null)} aria-label="Close Game" className={`rounded-full ${styles.iconContainer}`} style={{ padding: '12px' }}>
                  <X style={{ width: '40px', height: '40px' }} aria-hidden="true" />
                </button>
              </div>
              <p style={{ fontSize: '30px', fontWeight: 900, marginBottom: '24px' }} aria-live="polite">Score: {score}</p>
              <div className="grid grid-cols-3 w-full" style={{ gap: '12px', marginBottom: '32px' }}>
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={`border-4 flex items-center justify-center ${themeMode !== 'default' && themeMode !== 'custom' ? 'border-current' : themeMode === 'custom' ? 'theme-custom-border' : 'border-slate-200 bg-slate-100'}`} style={{ height: '96px', borderRadius: '16px' }}>
                    {starPos === i && (
                      <button onClick={() => { playSound('star'); setScore(s => s + 1); moveStar(); }} className="animate-bounce" aria-label="Tap the star to score!">
                        <Star style={{ width: '64px', height: '64px' }} className="text-yellow-500 fill-yellow-500" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={initStarGame} aria-label="Restart Tap the Star Game" className={`w-full ${styles.saveBtn}`} style={{ fontSize: '30px', fontWeight: 900, padding: '24px 0', borderRadius: '32px' }}>Restart</button>
            </div>
          </div>
        )}

        {/* MODAL: FOOD RECIPE */}
        {isRecipeOpen && (
          <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" aria-label="Food Recipe Modal">
            <div className={`${styles.modalBg} w-full max-w-md rounded-[3rem] p-8 overflow-y-auto max-h-[90vh]`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-4xl font-black">Recipe</h2>
                <button onClick={() => setIsRecipeOpen(false)} aria-label="Close Recipe" className={`p-3 rounded-full ${styles.iconContainer}`}><X className="w-10 h-10" aria-hidden="true" /></button>
              </div>
              
              <img src="https://static.vecteezy.com/system/resources/thumbnails/072/926/777/small/a-healthy-and-delicious-breakfast-bowl-of-oatmeal-porridge-topped-with-fresh-berries-banana-and-walnuts-photo.jpg" alt="A healthy breakfast bowl of oatmeal porridge topped with fresh berries, banana and walnuts" className="w-full h-48 object-cover rounded-[1.5rem] mb-6" />
              
              <h3 className="text-3xl font-black mb-4">Berry Oatmeal Bowl</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-black mb-2 flex items-center gap-2"><Utensils className="w-5 h-5" aria-hidden="true" /> Ingredients</h4>
                  <ul className="list-disc list-inside text-lg font-bold opacity-80 space-y-2 ml-2">
                    <li>1/2 cup rolled oats</li>
                    <li>1 cup water or milk</li>
                    <li>1/2 cup fresh berries (blueberries, strawberries)</li>
                    <li>1 tsp honey or maple syrup</li>
                    <li>Pinch of cinnamon</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-xl font-black mb-2 flex items-center gap-2"><Clock className="w-5 h-5" aria-hidden="true" /> Instructions</h4>
                  <ol className="list-decimal list-inside text-lg font-bold opacity-80 space-y-3 ml-2">
                    <li>Bring water or milk to a gentle boil in a small pot.</li>
                    <li>Stir in the oats and reduce the heat to low.</li>
                    <li>Simmer uncovered for 5 minutes, stirring occasionally.</li>
                    <li>Remove from heat, pour into a bowl, and top with fresh berries, cinnamon, and a drizzle of honey.</li>
                  </ol>
                </div>
              </div>
              
              <button onClick={() => setIsRecipeOpen(false)} aria-label="Close recipe details" className={`w-full text-2xl font-black py-5 rounded-[2rem] mt-8 shadow-md ${styles.saveBtn}`}>Close Recipe</button>
            </div>
          </div>
        )}

        {/* SETTINGS MODAL */}
        {isSettingsOpen && (
          <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" aria-label="Application Settings Modal">
            <div className={`${styles.modalBg} w-full max-w-md rounded-[3rem] p-8 overflow-y-auto max-h-[90vh]`}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-black">Settings</h2>
                <button onClick={() => setIsSettingsOpen(false)} aria-label="Close settings" className={`p-3 rounded-full ${styles.iconContainer}`}><X className="w-10 h-10" aria-hidden="true" /></button>
              </div>
              <div className="space-y-10">
                
                <div>
                  <label htmlFor="settings-name-input" className="flex items-center gap-3 text-2xl font-black mb-4"><User className="w-8 h-8 opacity-80" aria-hidden="true" /> My Name</label>
                  <input 
                    id="settings-name-input"
                    type="text" 
                    value={userName} 
                    onChange={e => setUserName(e.target.value)} 
                    aria-label="Enter your preferred name"
                    className={`w-full p-4 rounded-2xl text-xl font-bold outline-none border-4 transition-all ${themeMode !== 'default' && themeMode !== 'custom' ? 'border-current bg-transparent' : themeMode === 'custom' ? 'theme-custom-border theme-custom-bg' : 'border-slate-300 bg-slate-100'}`} 
                  />
                </div>

                <div>
                  <label htmlFor="settings-fontsize-slider" className="flex items-center justify-between gap-3 text-2xl font-black mb-4">
                    Text Size <span aria-live="polite">{fontSizeMult}%</span>
                  </label>
                  <input 
                    id="settings-fontsize-slider"
                    type="range" 
                    min="50" max="150" step="10"
                    value={fontSizeMult} 
                    onChange={e => setFontSizeMult(Number(e.target.value))} 
                    aria-label="Adjust global text size slider"
                    className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer mb-2"
                  />
                  <p className="text-sm font-bold opacity-60">Move the slider to increase or decrease the text size globally.</p>
                </div>

                <div>
                  <label className="flex items-center gap-3 text-2xl font-black mb-4"><Palette className="w-8 h-8 opacity-80" aria-hidden="true" /> Theme</label>
                  <div className="grid grid-cols-1 gap-3">
                    {['default', 'contrast', 'protanopia', 'tritanopia', 'custom'].map((mode) => (
                      <div key={mode} className="flex flex-col gap-3">
                        <button 
                          onClick={() => setThemeMode(mode)} 
                          aria-label={`Select ${mode.replace('default', 'Light Mode')} theme`}
                          className={`p-5 rounded-2xl border-4 text-xl font-black text-left capitalize transition-all ${themeMode === mode ? 'border-current opacity-100' : 'border-current opacity-40 hover:opacity-80'}`}
                        >
                          {mode.replace('default', 'Light Mode').replace('contrast', 'High Contrast')}
                        </button>
                        
                        {/* Custom Theme Color Picker UI */}
                        {mode === 'custom' && themeMode === 'custom' && (
                          <div className="flex gap-4 p-2 animate-in fade-in slide-in-from-top-2" aria-live="polite">
                            <label className="flex-1 flex flex-col items-center gap-2">
                              <span className="font-bold text-lg opacity-80 text-center">Main Color</span>
                              <div 
                                className="w-full h-24 rounded-2xl border-4 flex items-center justify-center relative overflow-hidden shadow-lg"
                                style={{ backgroundColor: customMain, borderColor: customSec }}
                                aria-label="Main color picker button"
                              >
                                <input 
                                  type="color" 
                                  value={customMain} 
                                  onChange={(e) => setCustomMain(e.target.value)} 
                                  className="absolute inset-0 w-[200%] h-[200%] -top-4 -left-4 cursor-pointer opacity-0"
                                  aria-label="Pick Main Color"
                                />
                                <span className="bg-black/60 text-white px-4 py-2 rounded-xl text-sm font-black pointer-events-none shadow-md">Pick</span>
                              </div>
                            </label>
                            <label className="flex-1 flex flex-col items-center gap-2">
                              <span className="font-bold text-lg opacity-80 text-center">Secondary</span>
                              <div 
                                className="w-full h-24 rounded-2xl border-4 flex items-center justify-center relative overflow-hidden shadow-lg"
                                style={{ backgroundColor: customSec, borderColor: customMain }}
                                aria-label="Secondary color picker button"
                              >
                                <input 
                                  type="color" 
                                  value={customSec} 
                                  onChange={(e) => setCustomSec(e.target.value)} 
                                  className="absolute inset-0 w-[200%] h-[200%] -top-4 -left-4 cursor-pointer opacity-0"
                                  aria-label="Pick Secondary Color"
                                />
                                <span className="bg-black/60 text-white px-4 py-2 rounded-xl text-sm font-black pointer-events-none shadow-md">Pick</span>
                              </div>
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <button onClick={() => setIsSettingsOpen(false)} aria-label="Save and close settings" className={`w-full text-3xl font-black py-6 rounded-[2rem] mt-4 shadow-md ${styles.saveBtn}`}>Done</button>
              </div>
            </div>
          </div>
        )}

        {/* SOS MODAL */}
        {sosActive && (
          <div className="fixed inset-0 bg-red-600 z-[60] flex items-center justify-center p-4" aria-modal="true" role="dialog" aria-label="Emergency Call Confirmation Modal">
            <div className="bg-white w-full max-w-md shadow-2xl" style={{ padding: '40px', borderRadius: '48px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '48px', fontWeight: 900, color: '#0f172a', marginBottom: '24px' }}>Call 911?</h2>
              <button 
                onClick={() => { alert('Calling 911...'); setSosActive(false)}} 
                aria-label="Yes, confirm call to 911 emergency services"
                className="w-full bg-red-600 text-white"
                style={{ fontSize: '30px', fontWeight: 900, padding: '32px 0', borderRadius: '32px', marginBottom: '16px', border: '4px solid white' }}
              >
                YES, CALL NOW
              </button>
              <button 
                onClick={() => setSosActive(false)} 
                aria-label="Cancel emergency call"
                className="bg-slate-200 text-slate-800"
                style={{ fontSize: '24px', fontWeight: 900, padding: '24px 0', borderRadius: '32px', width: '100%' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ADD PILL MODAL */}
        {isAddingPill && (
          <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[80] flex items-center justify-center p-4" aria-modal="true" role="dialog" aria-label="Add New Medication Modal">
            <div className={`${styles.modalBg} w-full max-w-md rounded-[3rem] p-8`}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-black">Add Pill</h2>
                <button onClick={() => setIsAddingPill(false)} aria-label="Cancel adding pill" className={`p-3 rounded-full ${styles.iconContainer}`}><X className="w-8 h-8" aria-hidden="true" /></button>
              </div>
              <div className="space-y-6">
                <input 
                  type="text" 
                  value={newPillName} 
                  onChange={e => setNewPillName(e.target.value)} 
                  aria-label="Enter medication name"
                  className={`w-full p-4 rounded-2xl text-xl font-bold outline-none ${styles.inputBg}`} 
                  placeholder="Medication Name" 
                />
                <input 
                  type="time" 
                  value={newPillTime} 
                  onChange={e => setNewPillTime(e.target.value)} 
                  aria-label="Enter time to take medication"
                  className={`w-full p-4 rounded-2xl text-xl font-bold outline-none ${styles.inputBg}`} 
                />
                <button onClick={handleAddPill} aria-label="Save this new pill schedule" className={`w-full text-2xl font-black py-5 rounded-[2rem] shadow-lg ${styles.saveBtn}`}>Save Pill</button>
              </div>
            </div>
          </div>
        )}

        {/* ADD CONTACT MODAL */}
        {isAddingContact && (
          <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[80] flex items-center justify-center p-4" aria-modal="true" role="dialog" aria-label="Add New Contact Modal">
            <div className={`${styles.modalBg} w-full max-w-md rounded-[3rem] p-8`}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-black">Add Contact</h2>
                <button onClick={() => setIsAddingContact(false)} aria-label="Cancel adding contact" className={`p-3 rounded-full ${styles.iconContainer}`}><X className="w-8 h-8" aria-hidden="true" /></button>
              </div>
              <div className="space-y-6">
                <input 
                  type="text" 
                  value={newContactName} 
                  onChange={e => setNewContactName(e.target.value)} 
                  aria-label="Enter contact's name"
                  className={`w-full p-4 rounded-2xl text-xl font-bold outline-none ${styles.inputBg}`} 
                  placeholder="Contact Name" 
                />
                <input 
                  type="tel" 
                  value={newContactPhone} 
                  onChange={e => setNewContactPhone(e.target.value)} 
                  aria-label="Enter contact's phone number"
                  className={`w-full p-4 rounded-2xl text-xl font-bold outline-none ${styles.inputBg}`} 
                  placeholder="Phone Number" 
                />
                <button onClick={handleAddContact} aria-label="Save this new contact" className={`w-full text-2xl font-black py-5 rounded-[2rem] shadow-lg ${styles.saveBtn}`}>Save Contact</button>
              </div>
            </div>
          </div>
        )}

        {/* NEWS DETAIL MODAL */}
        {selectedNews && (
          <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[70] flex items-center justify-center p-4" aria-modal="true" role="dialog" aria-label={`Reading news article: ${selectedNews.title}`}>
            <div className={`${styles.modalBg} w-full max-w-md rounded-[3rem] overflow-hidden`}>
              <img src={selectedNews.img} className="w-full h-56 object-cover" alt={`Cover image for ${selectedNews.title}`} />
              <div className="p-8">
                <h2 className="text-3xl font-black mb-4 leading-tight">{selectedNews.title}</h2>
                <p className="text-xl font-bold opacity-80 leading-relaxed mb-8">{selectedNews.content}</p>
                <button onClick={() => setSelectedNews(null)} aria-label="Close news article" className={`w-full text-2xl font-black py-5 rounded-[2rem] ${styles.saveBtn}`}>Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
