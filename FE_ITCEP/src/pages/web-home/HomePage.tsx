import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bot, MessageCircle, Send, User, X } from 'lucide-react';
import { authService } from '../../api/services/authService';
import { villagesData } from '../../data/villagesData';
import { villagesService } from '../../api/villages/villagesService';
import Footer from '../../components/Footer/Footer';
import RecentReviewList from '../../components/Reviews/RecentReviewList';
import useRevealOnScroll from '../../hooks/useRevealOnScroll';

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  id: number;
  role: ChatRole;
  content: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const hasSeededGreetingRef = useRef(false);
  const chatApiBase = (import.meta.env.VITE_AI_URL || 'http://26.145.116.212:8000').replace(/\/+$/, '');

  

  useEffect(() => {
    const token = authService.getToken();
    if (!token) return;
    let mounted = true;
    authService
      .getProfile()
      .then((p) => {
        if (!mounted) return;
        const hasProfile = p && (p.name || p.fullName || p.username || p.email || p.id);
        if (hasProfile) {
          setUser(p);
          setIsLoggedIn(true);
        } else {
          try { localStorage.removeItem('access_token'); } catch (e) {}
          setUser(null);
          setIsLoggedIn(false);
        }
      })
      .catch(() => {
        if (!mounted) return;
        setIsLoggedIn(false);
        setUser(null);
      });
    return () => {
      mounted = false;
    };
  }, []);
      // Danh sách ảnh nền
      const bgImages = [
        '/picture/lamchieu.png',
        '/picture/lamgom.png',
        '/picture/lamhuong.png',
        '/picture/lamlua.png',
        '/picture/lamsonmai.png',
        '/picture/lamtranhdongho.png',
      ];
      const [bgIndex, setBgIndex] = useState(0);
      useEffect(() => {
        const interval = setInterval(() => {
          setBgIndex((prev) => (prev + 1) % bgImages.length);
        }, 3000);
        return () => clearInterval(interval);
      }, []);
    // Ref cho slider làng nghề
    const sliderRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (sliderRef.current) {
        sliderRef.current.scrollLeft = 0;
      }
    }, []);
  const [crafts, setCrafts] = useState<any[]>(villagesData);
    const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    villagesService
      .getAll()
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data) && data.length) {
          const normalized = data.map((v: any) => ({
            id: v.id ?? v.village_id ?? v._id ?? v.name,
            name: v.name ?? v.title ?? v.city ?? 'Làng nghề',
            description: v.description ?? v.desc ?? '',
            thumbnail: v.thumbnail ?? v.image ?? v.media?.[0]?.url ?? '/picture/default-village.jpg',
            city: v.city ?? v.location ?? '',
          }));
          setCrafts(normalized);
        }
      })
      .catch((err) => {
        console.warn('Failed to load villages:', err);
      });
    return () => {
      mounted = false;
    };
  }, []);
  const [previewVisible, setPreviewVisible] = useState<boolean>(true);

  function truncateSentences(text: string, maxSentences = 1) {
    if (!text) return '';
    // Split on sentence boundaries: look for .!? followed by space and uppercase/quote/or end of string
    // This avoids breaking on periods inside numbers like "1.000"
    const sentencePattern = /[^.!?]*[.!?]+(?=\s+[A-ZẠ-ỰƠ"']|$)/g;
    const matches = text.match(sentencePattern);
    if (!matches || matches.length === 0) {
      const parts = text.split('\n').map(s => s.trim()).filter(Boolean);
      return parts.length <= maxSentences ? text : parts.slice(0, maxSentences).join(' ') + '...';
    }
    if (matches.length <= maxSentences) return text;
    return matches.slice(0, maxSentences).map(s => s.trim()).join(' ').trim() + '...';
  }

  // Trigger a fade/scale animation on preview whenever activeIndex changes
  useEffect(() => {
    setPreviewVisible(false);
    const t = setTimeout(() => setPreviewVisible(true), 60);
    return () => clearTimeout(t);
  }, [activeIndex]);

  // init reveal-on-scroll behavior
  useRevealOnScroll()

  // Autoplay progress and tilt state
  const AUTOPLAY_MS = 7000;
  const [progress, setProgress] = useState<number>(0);
  const autoplayRef = useRef<number | null>(null);
  const progressRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    // cleanup any previous
    if (autoplayRef.current) window.clearInterval(autoplayRef.current);
    progressRef.current = 0;
    setProgress(0);

    autoplayRef.current = window.setInterval(() => {
      if (pausedRef.current) return;
      progressRef.current += 100 / (AUTOPLAY_MS / 100);
      setProgress(progressRef.current);
      if (progressRef.current >= 100) {
        progressRef.current = 0;
        setProgress(0);
        setActiveIndex((s) => (crafts && crafts.length ? (s + 1) % crafts.length : s));
      }
    }, 100);

    return () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current);
    };
  }, [crafts]);

  // pause autoplay on preview hover
  const handlePreviewEnter = () => { pausedRef.current = true; };
  const handlePreviewLeave = () => { pausedRef.current = false; };

  const handlePreviewMove = (e: React.MouseEvent) => {
    const el = previewRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top; // y position within element
    const rx = ((y - rect.height / 2) / rect.height) * -6; // rotateX
    const ry = ((x - rect.width / 2) / rect.width) * 8; // rotateY
    setTilt({ rx, ry });
  };

  const resetTilt = () => setTilt({ rx: 0, ry: 0 });

    const scrollTo = (id: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

  // Modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showGuestWarn, setShowGuestWarn] = useState(false);

  useEffect(() => {
    if (!isChatOpen || !chatBodyRef.current) return;
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [chatMessages, isChatOpen, chatLoading]);

  const openChat = () => {
    if (!hasSeededGreetingRef.current && chatMessages.length === 0) {
      hasSeededGreetingRef.current = true;
      setChatMessages([
        {
          id: Date.now(),
          role: 'assistant',
          content: 'Xin chào! 😊 Mình sẵn sàng giúp bạn khám phá các làng nghề truyền thống Việt Nam. Bạn muốn tìm hiểu về điều gì?',
        },
      ]);
    }
    setIsChatOpen(true);
  };

  const pushChatMessage = (role: ChatRole, content: string) => {
    setChatMessages((prev) => [...prev, { id: Date.now() + Math.random(), role, content }]);
  };

  const parseAssistantReply = (payload: any) => {
    if (typeof payload === 'string') return payload.trim();
    if (!payload) return '';
    if (typeof payload.reply === 'string') return payload.reply.trim();
    if (typeof payload.message === 'string') return payload.message.trim();
    if (typeof payload.text === 'string') return payload.text.trim();
    if (typeof payload.output === 'string') return payload.output.trim();
    if (payload.output && typeof payload.output.text === 'string') return payload.output.text.trim();
    return '';
  };

  const handleSendChat = async () => {
    const message = chatInput.trim();
    if (!message || chatLoading) return;

    setChatInput('');
    pushChatMessage('user', message);
    setChatLoading(true);

    try {
      const res = await axios.post(
        `${chatApiBase}/chat`,
        { message },
        { headers: { 'Content-Type': 'application/json' }, timeout: 15000 },
      );
      const assistantReply = parseAssistantReply(res.data) || 'Mình chưa có phản hồi rõ ràng, bạn thử hỏi lại nhé.';
      pushChatMessage('assistant', assistantReply);
    } catch (error) {
      console.error('Chat API error:', error);
      pushChatMessage('assistant', 'AI đang bận, bạn thử lại sau một chút nhé.');
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
  };

  return (
    <>
      <div id="top" className="min-h-screen bg-[#f5f0e8] pt-24">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 w-full z-50 shadow-2xl backdrop-blur-xl bg-gradient-to-r from-[#e8dcc8]/90 via-[#d4c4a8]/95 to-[#f5f0e8]/90 border-b-4 border-[#b48a3c] rounded-b-3xl animate-fade-in">
          <div className="max-w-7xl mx-auto px-0 py-2">
              <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-12 mx-auto">
              {[{
                label: 'CRAFTSTEPS',
                href: '#top',
                onClick: scrollTo('top')
              }, {
                label: 'CÁC NGHỀ',
                href: '#crafts',
                onClick: scrollTo('crafts')
              }, {
                label: 'VỀ CHÚNG TÔI',
                href: '#intro',
                onClick: scrollTo('intro')
              }, {
                label: 'LIÊN HỆ',
                href: '#footer',
                onClick: (e: React.MouseEvent) => {
                  e.preventDefault();
                  const el = document.getElementById('footer');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }].map((item, idx, arr) => (
                <React.Fragment key={item.label}>
                  <a
                    href={item.href}
                    onClick={item.onClick}
                    className="flex flex-col items-center group"
                  >
                    <span className="text-[#4a3f2e] group-hover:text-[#b48a3c] transition-colors text-2xl font-extrabold tracking-widest drop-shadow-md uppercase" style={{fontFamily:'serif'}}>{item.label}</span>
                    <span className="block w-0 group-hover:w-10 h-1 bg-gradient-to-r from-[#b48a3c] to-[#8b6f47] rounded-full transition-all duration-300 mt-1"></span>
                  </a>
                  {idx < arr.length - 1 && (
                    <span className="text-[#b48a3c] text-3xl font-black">·</span>
                  )}
                </React.Fragment>
              ))}
              </div>
            </div>
            {/* ...bỏ logo/icon giữa... */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              {!(isLoggedIn && user) ? (
                <button
                  onClick={() => navigate('/login')}
                  aria-label="Đăng nhập"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#f6b96b] via-[#f5a623] to-[#7bc043] text-white px-4 py-2 rounded-full text-lg font-semibold shadow-2xl ring-1 ring-white/20 transform transition-transform hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                  <span className="p-1.5 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </span>
                  <span className="select-none">Đăng nhập</span>
                  <svg className="w-4 h-4 opacity-90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6l6 6-6 6" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/profile')}
                    className="inline-flex items-center bg-white/0 text-amber-700 px-2 py-1 rounded-full text-md font-semibold hover:scale-105 transition-transform"
                  >
                    {user && user.avatar ? (
                      <img src={user.avatar} alt={user.name || 'avatar'} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">{(user && user.name) ? user.name.charAt(0).toUpperCase() : 'A'}</div>
                    )}
                    <span className="ml-2 hidden sm:inline text-amber-800 font-semibold">{user?.name || 'Người dùng'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[600px] overflow-hidden">
          {bgImages.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Nghề truyền thống"
              className={`absolute inset-0 w-full h-full object-cover pointer-events-none select-none transition-opacity duration-1000 ${i === bgIndex ? 'opacity-100' : 'opacity-0'}`}
              style={{ zIndex: 0, transition: 'opacity 1s' }}
            />
          ))}
          {/* Hiệu ứng sóng trang trí */}
          <svg className="absolute top-0 left-0 w-full h-32" viewBox="0 0 1440 320"><path fill="#f5f0e8" fillOpacity="0.18" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none reveal-on-scroll">
            <h1
              className="text-7xl md:text-8xl font-extrabold mb-4 text-white animate-pulse-slow"
              style={{
                fontFamily: 'serif',
                letterSpacing: 2,
                textShadow: '0 4px 24px #ffe9b0, 0 2px 8px #fff',
                WebkitTextStroke: '2px #ffe9b0',
              }}
            >
              Chào mừng đến với
            </h1>
            <h2
              className="text-8xl md:text-9xl font-extrabold mb-6 text-white animate-gradient-x"
              style={{
                fontFamily: 'serif',
                letterSpacing: 4,
                textShadow: '0 6px 32px #ffe9b0, 0 2px 8px #fff',
                WebkitTextStroke: '2px #ffe9b0',
              }}
            >
              CraftSteps
            </h2>
            <p className="text-white text-2xl md:text-3xl mb-10 font-medium animate-fade-in" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              <span className="inline-block align-middle mr-2">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="#ffe9b0"/></svg>
              </span>
              Khám phá quy trình làng nghề truyền thống
              <span className="inline-block align-middle ml-2">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#b48a3c"/><path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </p>
            <div className="flex gap-8 mt-2 animate-float">
              <button
                className="flex items-center gap-3 bg-gradient-to-r from-[#4a7c2f] to-[#7bc043] hover:from-[#3d6827] hover:to-[#5fa32d] text-white px-12 py-5 rounded-full text-2xl font-bold shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-[#fffbe8]"
                onClick={() => {
                  if (authService.getToken()) {
                    navigate('/game');
                  } else {
                    setShowAuthModal(true);
                  }
                }}
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fffbe8"/><path d="M10 8l6 4-6 4V8z" fill="#4a7c2f"/></svg>
                Bắt đầu chơi
              </button>
                    {/* Modal xác thực đăng nhập/chơi khách */}
                    {showAuthModal && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                        <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center border border-yellow-300 shadow-2xl relative">
                          <button
                            aria-label="Đóng"
                            className="absolute right-4 top-4 w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
                            onClick={() => setShowAuthModal(false)}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                          <h3 className="text-2xl font-bold mb-2 text-yellow-700">Đăng nhập để lưu tiến trình</h3>
                          <p className="mb-4 text-gray-700">Bạn cần đăng nhập để lưu lại tiến trình chơi và thành tích của mình.</p>
                          <div className="flex items-center justify-center gap-4 mt-6">
                            <button
                              className="px-6 py-2 bg-yellow-600 text-white rounded-full shadow hover:scale-105 transition-transform"
                              onClick={() => {
                                setShowAuthModal(false);
                                navigate('/login');
                              }}
                            >
                              Đăng nhập
                            </button>
                            <button
                              className="px-5 py-2 bg-white border border-yellow-300 text-yellow-700 rounded-full shadow"
                              onClick={() => {
                                setShowAuthModal(false);
                                setShowGuestWarn(true);
                              }}
                            >
                              Chơi khách
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Modal cảnh báo chơi khách */}
                    {showGuestWarn && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                        <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center border border-red-300 shadow-2xl relative">
                          <button
                            aria-label="Đóng"
                            className="absolute right-4 top-4 w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
                            onClick={() => setShowGuestWarn(false)}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                          <h3 className="text-2xl font-bold mb-2 text-red-700">Tiến trình sẽ không được lưu</h3>
                          <p className="mb-4 text-gray-700">Nếu tiếp tục chơi với tư cách khách, mọi thành tích và tiến trình sẽ bị mất khi thoát game.</p>
                          <div className="flex items-center justify-center gap-4 mt-6">
                            <button
                              className="px-6 py-2 bg-red-600 text-white rounded-full shadow hover:scale-105 transition-transform"
                              onClick={() => {
                                setShowGuestWarn(false);
                                navigate('/game');
                              }}
                            >
                              Tiếp tục
                            </button>
                            <button
                              className="px-5 py-2 bg-white border border-red-300 text-red-700 rounded-full shadow"
                              onClick={() => {
                                setShowGuestWarn(false);
                                navigate('/login');
                              }}
                            >
                              Đăng nhập
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
              <button
                onClick={() => navigate('/about')}
                className="flex items-center gap-3 bg-gradient-to-r from-[#ffe9b0] to-[#d4c4a8] hover:from-[#fffbe8] hover:to-[#b48a3c] text-[#4a3f2e] px-12 py-5 rounded-full text-2xl font-bold shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-[#fffbe8]"
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#b48a3c"/><path d="M12 8v4l3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section - Đẹp và bắt mắt */}
      <section id="intro" className="py-24 px-4 bg-[#f5f0e8] relative overflow-hidden">
        {/* Icon trang trí */}
        <div className="absolute left-8 top-8 opacity-20 rotate-12 select-none pointer-events-none">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="55" stroke="#b48a3c" strokeWidth="8" fill="#fffbe8" /></svg>
        </div>
        <div className="absolute right-8 bottom-8 opacity-20 -rotate-12 select-none pointer-events-none">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none"><rect x="10" y="10" width="80" height="80" rx="20" stroke="#b48a3c" strokeWidth="7" fill="#fffbe8" /></svg>
        </div>
          <div className="max-w-3xl mx-auto text-center relative z-10 animate-fade-in reveal-on-scroll">
          <h2 className="text-5xl md:text-6xl font-extrabold text-[#b48a3c] mb-4 drop-shadow-lg tracking-wide" style={{ fontFamily: 'serif' }}>
            <span className="inline-block align-middle mr-3">
              <svg width="38" height="38" fill="none" viewBox="0 0 24 24"><path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="#ffe9b0"/></svg>
            </span>
            Khám phá CraftSteps
            <span className="inline-block align-middle ml-3">
              <svg width="38" height="38" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#b48a3c"/><path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-[#4a3f2e] mb-8 tracking-wide animate-fade-in" style={{ fontFamily: 'serif' }}>
            Hành trình trải nghiệm làng nghề truyền thống Việt Nam
          </h3>
          <p className="text-[#4a3f2e] text-lg md:text-xl leading-relaxed mb-6 font-medium animate-fade-in">
            <span className="font-bold text-[#b48a3c]">CraftSteps</span> là trò chơi giáo dục độc đáo, nơi bạn sẽ hóa thân thành những nghệ nhân làng nghề truyền thống Việt Nam. Từng bước chân, bạn sẽ được khám phá quy trình tạo ra các sản phẩm thủ công tinh xảo, từ những nguyên liệu thô sơ đến thành phẩm rực rỡ sắc màu.<br/><br/>
            Không chỉ là một trò chơi, CraftSteps còn là cầu nối đưa bạn về với cội nguồn văn hóa dân tộc, giúp bạn hiểu sâu sắc hơn về giá trị lao động, sự sáng tạo và tinh thần bền bỉ của người Việt qua từng thế hệ. Mỗi làng nghề là một câu chuyện, một hành trình đầy cảm hứng đang chờ bạn khám phá!
          </p>
          <div className="flex flex-col items-center gap-2 animate-float">
            <span className="text-[#b48a3c] text-3xl">★ ★ ★</span>
            <span className="italic text-[#8b6f47] text-base md:text-lg">"Hãy cùng CraftSteps gìn giữ và lan tỏa nét đẹp văn hóa Việt Nam!"</span>
          </div>
        </div>
      </section>

      {/* Traditional Crafts Section - Redesigned */}
      <section id="crafts" className="py-20 px-4 bg-gradient-to-b from-[#f5f0e8] to-[#f9f6ef] reveal-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#b48a3c] opacity-60"></div>
            <h3 className="text-5xl md:text-6xl font-extrabold text-[#b48a3c] drop-shadow-lg tracking-wide flex items-center gap-3 px-6" style={{ fontFamily: 'serif' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="#ffe9b0"/></svg>
              Thước phim & Góc ảnh
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#b48a3c"/><path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </h3>
            <div className="flex-1 h-px bg-[#b48a3c] opacity-60"></div>
          </div>
          <div className="text-center mb-6 reveal-on-scroll">
            <p className="text-[#4a3f2e]">Chọn một làng nghề để xem thông tin chi tiết. Ảnh sẽ phóng to khi bạn chọn.</p>
          </div>

          {/* Hide browser scrollbars for the thumbnail list and enable preview animations */}
          <style>{`
            .hide-scrollbar::-webkit-scrollbar{display:none}
            .hide-scrollbar{ -ms-overflow-style: none; scrollbar-width: none; }
            .preview-fade-enter{ opacity:0; transform:scale(0.98); }
            .preview-fade-enter-active{ opacity:1; transform:scale(1); transition: all 600ms cubic-bezier(.2,.9,.2,1); }
            .preview-fade-exit{ opacity:1; transform:scale(1); }
            .preview-fade-exit-active{ opacity:0; transform:scale(0.98); transition: all 280ms ease-in; }

            @keyframes captionSlideUp { from { transform: translateY(12px); opacity:0 } to { transform: translateY(0); opacity:1 } }
            .caption-animate { animation: captionSlideUp 560ms cubic-bezier(.2,.9,.2,1) both; }

            @keyframes fadeUp { from { transform: translateY(10px); opacity:0 } to { transform: translateY(0); opacity:1 } }

            .thumb-hover { transition: transform 280ms cubic-bezier(.2,.9,.2,1), box-shadow 280ms; }
            .thumb-hover:hover{ transform: translateY(-6px) scale(1.02); box-shadow: 0 10px 30px rgba(0,0,0,0.12); }
            .thumb-active { box-shadow: 0 18px 50px rgba(90,67,40,0.18); transform: scale(1.01); }

            .preview-parallax { transform-origin: center; transition: transform 900ms cubic-bezier(.2,.9,.2,1); }
            .preview-parallax:hover{ transform: scale(1.02) translateY(-6px); }

            /* CTA button animations */
            .btn-cta{ display:inline-flex; align-items:center; gap:0.6rem; padding:0.65rem 1.2rem; border-radius:999px; background-size:200% 100%; background-position:0% 50%; transition: transform 260ms cubic-bezier(.2,.9,.2,1), background-position 420ms ease, box-shadow 260ms; }
            .btn-cta:hover{ transform: translateY(-4px) scale(1.02); background-position:100% 50%; box-shadow:0 10px 30px rgba(80,60,30,0.12); }
            .btn-cta .btn-icon{ display:inline-flex; align-items:center; justify-content:center; transition: transform 260ms cubic-bezier(.2,.9,.2,1); }
            .btn-cta:hover .btn-icon{ transform: translateX(6px); }
            .btn-cta:active{ transform: translateY(-1px) scale(0.995); }
            /* reveal-on-scroll helper */
            .reveal-on-scroll{ opacity:0; transform: translateY(12px); transition: all 700ms cubic-bezier(.2,.9,.2,1); will-change: transform, opacity; }
            .reveal-on-scroll.is-revealed{ opacity:1; transform: translateY(0); }
          `}</style>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start reveal-on-scroll">
            <div className="md:col-span-2">
              <div className="rounded-2xl overflow-visible">
                <div className="p-1 rounded-2xl" style={{ background: 'conic-gradient(from 0deg, #f9e9c4, #e6c787, #b48a3c, #f9e9c4)', borderRadius: 18 }}>
                  <div
                    ref={previewRef}
                    onMouseEnter={handlePreviewEnter}
                    onMouseLeave={() => { handlePreviewLeave(); resetTilt(); }}
                    onMouseMove={handlePreviewMove}
                    className="rounded-2xl overflow-hidden bg-white shadow-2xl border border-[#e8dcc8]"
                    style={{ transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`, transition: 'transform 260ms cubic-bezier(.2,.9,.2,1)' }}
                  >
                    <div className="relative h-0" style={{ paddingBottom: '66.66%' }}>
                      <img src={crafts[activeIndex] && crafts[activeIndex].thumbnail} alt={crafts[activeIndex] && crafts[activeIndex].name} className={`absolute inset-0 w-full h-full object-cover preview-parallax transition-all duration-700 ${previewVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/32 to-transparent pointer-events-none"></div>
                      <div className="absolute left-6 bottom-6 text-white max-w-2xl">
                        <div className="backdrop-blur-sm bg-black/45 rounded-2xl p-5 shadow-xl max-w-[66ch] caption-animate">
                          <div className="inline-flex items-center gap-3 bg-white/10 text-[#fffbe8] px-3 py-1 rounded-full font-semibold shadow-sm">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="#ffe9b0"/></svg>
                            <span className="uppercase text-xs tracking-wider">{crafts[activeIndex] && crafts[activeIndex].name}</span>
                          </div>
                          <p className="mt-3 text-lg md:text-xl leading-7 text-white/95" style={{ textShadow: '0 6px 20px rgba(0,0,0,0.55)' }}>
                            {truncateSentences(crafts[activeIndex]?.description ?? 'Chưa có giới thiệu.', 1)}
                          </p>
                          <div className="mt-4">
                            <button onClick={() => navigate(`/village/${crafts[activeIndex] && crafts[activeIndex].id}`)} className="inline-flex items-center gap-3 bg-gradient-to-r from-[#b48a3c] to-[#ffe9b0] text-[#4a3f2e] px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform">
                              <span>Xem chi tiết</span>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="#4a3f2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* progress bar */}
                      <div className="absolute left-0 right-0 bottom-0 h-1 bg-white/30">
                        <div className="h-full bg-gradient-to-r from-[#b48a3c] to-[#ffe9b0] transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    {/* floating login/profile removed here so it's only in the header */}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-col gap-4 max-h-[560px] overflow-y-auto pr-2 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
                {crafts.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveIndex(i)}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${i === activeIndex ? 'bg-[#fff3df] shadow-lg thumb-active' : 'bg-white/80'} thumb-hover`}
                    style={{ animation: `fadeUp 360ms ease forwards`, animationDelay: `${i * 60}ms`, opacity: 0 }}
                  >
                    <img src={c.thumbnail} alt={c.name} className={`w-20 h-20 object-cover rounded-md flex-shrink-0 ${i === activeIndex ? 'scale-105' : ''}`} />
                    <div className="text-left">
                      <div className="text-sm font-bold text-[#5a4328]">{c.name}</div>
                      <div className="text-sm text-[#6b5a46] leading-5 line-clamp-1">{truncateSentences(c.description ?? '', 1)}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button onClick={() => setActiveIndex((s) => Math.max(0, s - 1))} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="#5a4328" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <div className="text-sm text-[#6b5a46]">{activeIndex + 1} / {crafts ? crafts.length : 0}</div>
                <button onClick={() => setActiveIndex((s) => Math.min((crafts ? crafts.length : 1) - 1, s + 1))} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="#5a4328" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="py-12 reveal-on-scroll">
            <RecentReviewList />
          </div>
        </div>
      </section>

      {/* initialize reveal hook for elements on this page */}
      {useRevealOnScroll && useRevealOnScroll()}

      {/* Footer follows immediately after reviews */}
      </div>

      <Footer />

      <div className="fixed left-5 bottom-5 z-[70]">
        {!isChatOpen ? (
          <button
            type="button"
            aria-label="Mở chat AI"
            onClick={openChat}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-[#4a7c2f] to-[#7bc043] text-white shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-[340px] max-w-[88vw] rounded-2xl overflow-hidden bg-white border border-[#e8dcc8] shadow-2xl">
            <div className="px-4 py-3 bg-gradient-to-r from-[#4a7c2f] to-[#7bc043] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span className="font-semibold">Hỗ trợ</span>
              </div>
              <button
                type="button"
                aria-label="Đóng chat"
                onClick={() => setIsChatOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div ref={chatBodyRef} className="h-80 overflow-y-auto px-3 py-3 bg-[#fffdf7] space-y-3">
              {chatMessages.length === 0 ? (
                <div className="text-sm text-[#6b5a46] text-center pt-10">
                  Xin chào! Hãy cho tôi biết thắc mắc của bạn 
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                        msg.role === 'user' ? 'bg-[#4a7c2f] text-white' : 'bg-white border border-[#e8dcc8] text-[#4a3f2e]'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1 opacity-80">
                        {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                        <span className="text-[11px]">{msg.role === 'user' ? 'Bạn' : 'AI'}</span>
                      </div>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}

              {chatLoading && (
                <div className="text-xs text-[#6b5a46] animate-pulse px-1">AI dang tra loi...</div>
              )}
            </div>

            <div className="p-3 border-t border-[#efe2cc] bg-white">
              <div className="flex items-center gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleChatKeyDown}
                  placeholder="Nhập câu hỏi..."
                  className="flex-1 rounded-xl border border-[#d8c6a7] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#b48a3c]/40"
                  disabled={chatLoading}
                />
                <button
                  type="button"
                  onClick={handleSendChat}
                  disabled={chatLoading || !chatInput.trim()}
                  className="w-10 h-10 rounded-xl bg-[#b48a3c] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
