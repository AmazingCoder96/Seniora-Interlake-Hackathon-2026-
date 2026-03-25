import React, { useState, useEffect } from 'react';
import { 
  Phone, Pill, Heart, AlertCircle, CheckCircle, Smile, Frown, Meh, 
  X, Plus, UserPlus, Settings, Palette, Image as ImageIcon, Send,
  LayoutGrid, Activity, Home as HomeIcon, Users, Map as MapIcon, HeartPulse, Footprints, Moon, MessageSquare, Newspaper, Edit2, Clock, Tag, ChevronRight, Navigation, Sun, Sunrise, Sunset
} from 'lucide-react';

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mood, setMood] = useState(null);
  const [sosActive, setSosActive] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Modal & Detail States
  const [isAddingPill, setIsAddingPill] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingPillId, setEditingPillId] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);

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
    { id: 1, name: 'Sarah (Daughter)', type: 'Mobile', phone: '555-0192', icon: <Phone className="w-8 h-8" /> },
    { id: 2, name: 'Dr. Smith', type: 'Voice Call', phone: '555-0198', icon: <Phone className="w-8 h-8" /> },
  ]);

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
    { id: 1, user: "Sarah Jenkins", time: "2h ago", type: "Question", text: "Does anyone know what time the parade starts on Saturday?" },
    { id: 2, user: "Mark D.", time: "5h ago", type: "Alert", text: "Lost orange tabby cat near 4th street. Please keep an eye out!" },
    { id: 3, user: "Elena R.", time: "Yesterday", type: "Social", text: "Free gardening soil available at my curb if anyone wants it!" }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleMedication = (id) => {
    setMedications(meds => meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const updateMedicationTime = (id, newTime) => {
    setMedications(meds => meds.map(m => m.id === id ? { ...m, time: newTime } : m));
    setEditingPillId(null);
  };

  const formatTimeStr = (time24) => {
    const [h, m] = time24.split(':');
    const hNum = parseInt(h, 10);
    const ampm = hNum >= 12 ? 'PM' : 'AM';
    const h12 = hNum % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: "Good Morning", icon: <Sunrise className="w-10 h-10 text-orange-400" /> };
    if (hour < 18) return { text: "Good Afternoon", icon: <Sun className="w-10 h-10 text-yellow-400" /> };
    return { text: "Good Evening", icon: <Sunset className="w-10 h-10 text-indigo-400" /> };
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
    { id: 'placeholder', icon: <LayoutGrid className="w-8 h-8" />, label: 'More' },
    { id: 'health', icon: <Activity className="w-8 h-8" />, label: 'Health' },
    { id: 'home', icon: <HomeIcon className="w-8 h-8" />, label: 'Home' },
    { id: 'contacts', icon: <Users className="w-8 h-8" />, label: 'Contacts' },
    { id: 'community', icon: <MapIcon className="w-8 h-8" />, label: 'Local' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${styles.bg} ${styles.text}`}>
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative pb-64">
        
        {/* HEADER */}
        <header className={`${styles.headerBg} px-6 py-8 rounded-b-[3rem] relative transition-all`}>
          <div className="flex flex-col items-center text-center">
            <h1 className={`text-6xl font-black tracking-tighter mb-1 leading-none ${styles.text}`}>{timeString}</h1>
            <p className={`text-2xl font-bold opacity-70 uppercase tracking-wide ${styles.text}`}>{dateString}</p>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="absolute top-6 right-6 p-4 rounded-2xl bg-slate-100/10 text-current hover:bg-slate-100/20 active:scale-90 border-2 border-current"
          >
            <Settings className="w-8 h-8" />
          </button>
        </header>

        {/* CONTENT */}
        <main className="px-4 py-6 space-y-6 flex-1">
          
          {/* TAB: HOME */}
          {activeTab === 'home' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
              
              {/* Welcome Screen */}
              <section className={`${styles.card} rounded-[2.5rem] p-8 transition-all overflow-hidden relative`}>
                <div className="flex items-center gap-4 mb-2">
                  <div className={`p-4 rounded-2xl ${styles.iconContainer}`}>
                    {greeting.icon}
                  </div>
                  <div>
                    <h2 className="text-4xl font-black">Welcome, Arthur</h2>
                    <p className="text-xl font-bold opacity-70">{greeting.text}</p>
                  </div>
                </div>
                <div className="mt-6 p-4 rounded-2xl border-2 border-dashed border-current opacity-60">
                  <p className="text-lg font-bold">
                    {currentTime.getHours() < 12 
                      ? "Have a coffee and check your morning pills." 
                      : currentTime.getHours() < 18 
                      ? "The sun is out! Maybe a short walk later?" 
                      : "Time to wind down and relax for the night."}
                  </p>
                </div>
              </section>

              {!mood ? (
                <section className={`${styles.card} rounded-[2.5rem] p-8 transition-all`}>
                  <h2 className="text-3xl font-black text-center mb-8 flex items-center justify-center gap-3">
                    <Heart className="w-10 h-10" fill="currentColor" /> 
                    How are you?
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {['good', 'okay', 'bad'].map(m => (
                      <button key={m} onClick={() => setMood(m)} className={`flex items-center gap-6 p-6 rounded-3xl border-4 active:scale-95 transition-all ${themeMode !== 'default' ? 'border-current bg-transparent' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                        <div className={`p-3 rounded-full flex items-center justify-center ${styles.iconContainer}`}>
                          {m === 'good' && <Smile className={`w-12 h-12 ${styles.moodColors.good}`} />}
                          {m === 'okay' && <Meh className={`w-12 h-12 ${styles.moodColors.okay}`} />}
                          {m === 'bad' && <Frown className={`w-12 h-12 ${styles.moodColors.bad}`} />}
                        </div>
                        <span className="text-3xl font-black capitalize">I feel {m}</span>
                      </button>
                    ))}
                  </div>
                </section>
              ) : (
                <div className={`${styles.card} rounded-[2.5rem] p-8 text-center animate-in zoom-in transition-all relative overflow-hidden`}>
                  {/* Visual feedback depending on mood */}
                  <div className={`absolute top-0 left-0 w-2 h-full ${mood === 'good' ? 'bg-green-500' : mood === 'okay' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  
                  <h2 className="text-4xl font-black mb-4 leading-tight">
                    {mood === 'good' ? 'Wonderful!' : mood === 'okay' ? 'Hang in there!' : 'We are here to help'}
                  </h2>
                  
                  <p className="text-xl font-bold opacity-80 mb-6">
                    {mood === 'good' ? "That's great to hear, Arthur! Keep that energy going." : 
                     mood === 'okay' ? "Every day has its ups and downs. Take it easy." : 
                     "I've notified your primary contact that you're feeling a bit low today."}
                  </p>

                  <button onClick={() => setMood(null)} className="text-2xl font-bold underline opacity-60 mt-4 p-2">Change mood</button>
                </div>
              )}
            </div>
          )}

          {/* TAB: HEALTH */}
          {activeTab === 'health' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-3 gap-3">
                <div className={`${styles.card} rounded-[2rem] p-4 text-center flex flex-col items-center justify-center`}>
                  <HeartPulse className="w-8 h-8 mb-2 opacity-80" />
                  <span className="text-xl font-black">72</span>
                  <span className="text-sm font-bold opacity-60">BPM</span>
                </div>
                <div className={`${styles.card} rounded-[2rem] p-4 text-center flex flex-col items-center justify-center`}>
                  <Footprints className="w-8 h-8 mb-2 opacity-80" />
                  <span className="text-xl font-black">4,320</span>
                  <span className="text-sm font-bold opacity-60">Steps</span>
                </div>
                <div className={`${styles.card} rounded-[2rem] p-4 text-center flex flex-col items-center justify-center`}>
                  <Moon className="w-8 h-8 mb-2 opacity-80" />
                  <span className="text-xl font-black">7h 12m</span>
                  <span className="text-sm font-bold opacity-60">Sleep</span>
                </div>
              </div>

              <section className={`${styles.card} rounded-[2.5rem] p-8 transition-all`}>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black flex items-center gap-3">
                    <Pill className="w-8 h-8" /> My Pills
                  </h2>
                  <button onClick={() => setIsAddingPill(true)} className={`${styles.btnText} p-4 rounded-2xl shadow-lg active:scale-90`} style={{ backgroundColor: styles.accent }}>
                    <Plus className="w-8 h-8" />
                  </button>
                </div>
                <div className="space-y-4">
                  {medications.map((med) => (
                    <div key={med.id} className={`w-full text-left p-6 rounded-[2rem] border-4 flex items-center justify-between transition-all ${med.taken ? 'opacity-40 grayscale' : themeMode !== 'default' ? 'bg-transparent border-current' : med.color}`}>
                      <div className={med.taken ? 'opacity-50' : styles.pillText}>
                        <h3 className={`text-2xl font-black leading-tight ${med.taken ? 'line-through' : ''}`}>{med.name}</h3>
                        {editingPillId === med.id ? (
                          <div className="flex items-center gap-2 mt-2">
                            <input type="time" value={med.time} onChange={(e) => updateMedicationTime(med.id, e.target.value)} className={`p-2 rounded-lg text-lg font-bold border-2 ${styles.inputBg}`} autoFocus onBlur={() => setEditingPillId(null)} />
                            <button onClick={() => setEditingPillId(null)} className="p-2 bg-slate-800 text-white rounded-lg text-sm font-bold">Done</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xl font-bold opacity-80">Take at {formatTimeStr(med.time)}</p>
                            {!med.taken && <button onClick={() => setEditingPillId(med.id)} className="p-2 opacity-60 hover:opacity-100"><Edit2 className="w-5 h-5" /></button>}
                          </div>
                        )}
                      </div>
                      <button onClick={() => toggleMedication(med.id)} className="p-2 active:scale-90 transition-transform">
                        {med.taken ? <CheckCircle className="w-12 h-12" /> : <div className="w-10 h-10 rounded-full border-4 border-current opacity-50"></div>}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* TAB: CONTACTS */}
          {activeTab === 'contacts' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <section className={`${styles.card} rounded-[2.5rem] p-8 transition-all`}>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black flex items-center gap-3"><Phone className="w-8 h-8" /> Contacts</h2>
                  <button onClick={() => setIsAddingContact(true)} className={`${styles.btnText} p-4 rounded-2xl shadow-lg active:scale-90`} style={{ backgroundColor: styles.accent }}>
                    <UserPlus className="w-8 h-8" />
                  </button>
                </div>
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <button key={contact.id} onClick={() => alert(`Calling ${contact.name}...`)} className={`w-full flex items-center p-5 rounded-[2rem] border-4 active:scale-95 transition-all ${themeMode !== 'default' ? 'bg-transparent border-current' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                      <div className={`p-4 rounded-2xl mr-5 flex items-center justify-center ${styles.iconContainer}`}>{contact.icon}</div>
                      <div className="text-left flex-1">
                        <h3 className="text-2xl font-black mb-1">{contact.name}</h3>
                        <p className="text-xl font-bold opacity-70">{contact.type} {contact.phone ? `• ${contact.phone}` : ''}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* TAB: COMMUNITY */}
          {activeTab === 'community' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-12">
              {/* Map */}
              <section className={`${styles.card} rounded-[2.5rem] p-6 transition-all overflow-hidden`}>
                <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><MapIcon className="w-6 h-6"/> Local Map</h2>
                <div className={`w-full h-64 rounded-[2rem] border-4 overflow-hidden relative ${themeMode !== 'default' ? 'border-current' : 'border-slate-200 shadow-inner'}`}>
                  <iframe 
                    title="Community Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11534.621213768297!2d-79.39054366601445!3d43.717757989341495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b33230559489f%3A0xe6108154e0c464c!2sSunnybrook%20Health%20Sciences%20Centre!5e0!3m2!1sen!2sca!4v1715638200000!5m2!1sen!2sca" 
                    width="100%" 
                    height="100%" 
                    className={`border-0 transition-all ${styles.mapFilter}`}
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                  <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    <button className={`p-3 rounded-2xl border-2 flex items-center justify-center ${styles.modalBg}`} onClick={() => alert("Finding directions to hospital...")}>
                      <Navigation className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </section>

              {/* News */}
              <section className={`${styles.card} rounded-[2.5rem] p-6 transition-all`}>
                <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><Newspaper className="w-6 h-6"/> Local News</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                  {newsArticles.map((article) => (
                    <button 
                      key={article.id} 
                      onClick={() => setSelectedNews(article)}
                      className={`min-w-[240px] border-4 rounded-[2rem] p-4 snap-start text-left active:scale-95 transition-all ${themeMode !== 'default' ? 'border-current' : 'border-slate-100 bg-slate-50 shadow-sm'}`}
                    >
                      <img src={article.img} alt="" className="w-full h-28 object-cover rounded-xl mb-3" />
                      <h3 className="font-black text-lg leading-tight mb-2">{article.title}</h3>
                      <div className="flex items-center justify-between opacity-60 font-bold text-sm">
                        <span>Read More</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Neighbor Chat */}
              <section className={`${styles.card} rounded-[2.5rem] p-6 transition-all`}>
                <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><MessageSquare className="w-6 h-6"/> Neighbor Chat</h2>
                
                {/* NEW: Input Area */}
                <div className={`mb-6 p-4 rounded-[2rem] border-4 ${themeMode !== 'default' ? 'border-current' : 'border-slate-200'}`}>
                  <textarea 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message to neighbors..."
                    className={`w-full min-h-[100px] p-4 rounded-xl text-xl font-bold resize-none mb-4 outline-none transition-all ${styles.chatInput}`}
                  />
                  <div className="flex gap-3">
                    <button 
                      onClick={() => alert("Photo library access is not available in preview.")}
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 font-black text-lg active:scale-95 transition-all ${themeMode !== 'default' ? 'border-current' : 'bg-slate-100 border-slate-300'}`}
                    >
                      <ImageIcon className="w-6 h-6" />
                      Add Photo
                    </button>
                    <button 
                      onClick={() => { if(chatMessage) { alert("Message sent to neighbors!"); setChatMessage(""); } }}
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl font-black text-lg active:scale-95 transition-all shadow-lg ${styles.saveBtn}`}
                    >
                      <Send className="w-6 h-6" />
                      Post
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {neighborPosts.map((post) => (
                    <div key={post.id} className={`p-5 border-4 rounded-[2rem] ${themeMode !== 'default' ? 'border-current' : 'border-slate-100 bg-slate-50'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col">
                          <span className="font-black text-xl leading-none">{post.user}</span>
                          <div className="flex items-center gap-2 mt-1 opacity-60 text-sm font-bold">
                            <Clock className="w-4 h-4" />
                            <span>{post.time}</span>
                          </div>
                        </div>
                        <span className={`text-xs font-black uppercase tracking-wider py-1 px-3 rounded-full border-2 ${themeMode !== 'default' ? 'border-current' : styles.tag}`}>
                          {post.type}
                        </span>
                      </div>
                      <p className="text-lg font-bold leading-relaxed">{post.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* TAB: PLACEHOLDER */}
          {activeTab === 'placeholder' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 h-full flex items-center justify-center min-h-[50vh]">
               <div className={`${styles.card} rounded-[2.5rem] p-10 text-center transition-all w-full`}>
                 <LayoutGrid className="w-16 h-16 mx-auto mb-4 opacity-50" />
                 <h2 className="text-3xl font-black mb-2">More Features</h2>
                 <p className="text-xl font-bold opacity-70">Coming soon to this section.</p>
               </div>
            </div>
          )}
        </main>

        {/* SOS BUTTON */}
        <div className="fixed bottom-32 left-0 right-0 px-6 max-w-md mx-auto z-40">
          <button onClick={() => setSosActive(true)} className={`w-full p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all ${styles.sosBtn}`}>
            <AlertCircle className="w-12 h-12" />
            <span className="text-4xl font-black uppercase">Emergency SOS</span>
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md rounded-[2.5rem] p-3 flex justify-between items-center z-40 transition-all ${styles.navContainer}`}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all ${activeTab === item.id ? `${styles.navActive} scale-110` : `${styles.navInactive} hover:scale-105 hover:opacity-100`}`}>
              {item.icon}
              <span className="text-[10px] font-black mt-1 tracking-wider uppercase">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* MODAL: SETTINGS */}
        {isSettingsOpen && (
          <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <div className={`${styles.modalBg} w-full max-w-md rounded-[3rem] p-8 overflow-y-auto max-h-[90vh]`}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-black">Settings</h2>
                <button onClick={() => setIsSettingsOpen(false)} className={`p-3 rounded-full ${styles.iconContainer}`}><X className="w-10 h-10" /></button>
              </div>
              <div className="space-y-10">
                <div>
                  <label className="flex items-center gap-3 text-2xl font-black mb-4"><Palette className="w-8 h-8 opacity-80" /> Theme</label>
                  <div className="grid grid-cols-1 gap-3">
                    {['default', 'contrast', 'protanopia', 'tritanopia'].map((mode) => (
                      <button key={mode} onClick={() => setThemeMode(mode)} className={`p-5 rounded-2xl border-4 text-xl font-black text-left capitalize transition-all ${themeMode === mode ? 'border-current opacity-100' : 'border-current opacity-40 hover:opacity-80'}`}>
                        {mode.replace('default', 'Light Mode').replace('contrast', 'High Contrast')}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setIsSettingsOpen(false)} className={`w-full text-3xl font-black py-6 rounded-[2rem] mt-4 ${styles.saveBtn}`}>Done</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: NEWS DETAIL */}
        {selectedNews && (
          <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[70] flex items-center justify-center p-4">
            <div className={`${styles.modalBg} w-full max-w-md rounded-[3rem] overflow-hidden`}>
              <div className="relative h-56">
                <img src={selectedNews.img} className="w-full h-full object-cover" alt="" />
                <button 
                  onClick={() => setSelectedNews(null)} 
                  className="absolute top-4 right-4 p-3 bg-black/50 text-white rounded-full backdrop-blur-md"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>
              <div className="p-8">
                <h2 className="text-3xl font-black mb-4 leading-tight">{selectedNews.title}</h2>
                <p className="text-xl font-bold opacity-80 leading-relaxed mb-8">
                  {selectedNews.content}
                </p>
                <button 
                  onClick={() => setSelectedNews(null)} 
                  className={`w-full text-2xl font-black py-5 rounded-[2rem] ${styles.saveBtn}`}
                >
                  Back to Community
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SOS MODAL */}
        {sosActive && (
          <div className="fixed inset-0 bg-red-600 z-[60] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[3rem] p-10 text-center text-slate-900 shadow-2xl">
              <h2 className="text-5xl font-black mb-6">Call 911?</h2>
              <button onClick={() => { alert("Calling 911..."); setSosActive(false)}} className="w-full bg-red-600 text-white text-3xl font-black py-8 rounded-[2rem] mb-4 border-4 border-white">YES, CALL NOW</button>
              <button onClick={() => setSosActive(false)} className="initial bg-slate-200 text-slate-800 text-2xl font-black py-6 rounded-[2rem] border-4 border-transparent w-full">Cancel</button>
            </div>
          </div>
        )}

        {/* ADD MODALS */}
        {(isAddingPill || isAddingContact) && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className={`${styles.modalBg} w-full max-w-md rounded-[3rem] p-8`}>
              <h2 className="text-4xl font-black mb-8">{isAddingPill ? 'New Pill' : 'New Contact'}</h2>
              <input type="text" value={isAddingPill ? newPillName : newContactName} onChange={(e) => isAddingPill ? setNewPillName(e.target.value) : setNewContactName(e.target.value)} placeholder="Name..." className={`w-full text-3xl p-6 rounded-[1.5rem] outline-none mb-4 ${styles.inputBg}`} />
              {isAddingPill && (
                <div className="mb-4">
                  <label className="text-xl font-bold mb-2 block opacity-80">Time to take:</label>
                  <input type="time" value={newPillTime} onChange={(e) => setNewPillTime(e.target.value)} className={`w-full text-3xl p-6 rounded-[1.5rem] outline-none ${styles.inputBg}`} />
                </div>
              )}
              {isAddingContact && <input type="tel" value={newContactPhone} onChange={(e) => setNewContactPhone(e.target.value)} placeholder="Phone Number..." className={`w-full text-3xl p-6 rounded-[1.5rem] outline-none mb-4 ${styles.inputBg}`} />}
              <button onClick={() => {
                if(isAddingPill) {
                  setMedications([...medications, { id: Date.now(), name: newPillName, time: newPillTime, taken: false, color: 'bg-white border-blue-400' }]);
                  setIsAddingPill(false); setNewPillName(''); setNewPillTime('08:00');
                } else {
                  setContacts([...contacts, { id: Date.now(), name: newContactName, type: 'Mobile', phone: newContactPhone, icon: <Phone className="w-8 h-8" /> }]);
                  setIsAddingContact(false); setNewContactName(''); setNewContactPhone('');
                }
              }} className={`w-full text-3xl font-black py-6 rounded-[2rem] mt-2 ${styles.saveBtn}`}>Save</button>
              <button onClick={() => { setIsAddingPill(false); setIsAddingContact(false); setNewContactPhone(''); }} className={`w-full mt-6 text-xl font-bold ${styles.cancelBtn}`}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
