import React, { useState, useRef, useEffect } from 'react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useNavigate, Link } from 'react-router-dom';
import { villagesData } from '../../data/villagesData';
import Footer from '../../components/Footer/Footer';
import RecentReviewList from '../../components/Reviews/RecentReviewList';

export default function HomePage() {
  const navigate = useNavigate();
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
  const crafts = villagesData;

    const scrollTo = (id: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

  // Modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showGuestWarn, setShowGuestWarn] = useState(false);

  return (
    <>
      <div id="top" className="min-h-screen bg-[#f5f0e8] pt-24">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 w-full z-50 shadow-2xl backdrop-blur-xl bg-gradient-to-r from-[#e8dcc8]/90 via-[#d4c4a8]/95 to-[#f5f0e8]/90 border-b-4 border-[#b48a3c] rounded-b-3xl animate-fade-in">
          <div className="max-w-7xl mx-auto px-0 py-2">
            <div className="flex items-center justify-center w-full">
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
            {/* Đã xóa nút Đăng nhập bên phải */}
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
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
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
                onClick={() => setShowAuthModal(true)}
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fffbe8"/><path d="M10 8l6 4-6 4V8z" fill="#4a7c2f"/></svg>
                Bắt đầu chơi
              </button>
                    {/* Modal xác thực đăng nhập/chơi khách */}
                    {showAuthModal && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                        <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center border border-yellow-300 shadow-2xl">
                          <h3 className="text-2xl font-bold mb-2 text-yellow-700">Đăng nhập để lưu tiến trình</h3>
                          <p className="mb-4 text-gray-700">Bạn cần đăng nhập để lưu lại tiến trình chơi và thành tích của mình.</p>
                          <div className="flex items-center justify-center gap-4 mt-6">
                            <button
                              className="px-6 py-2 bg-yellow-600 text-white rounded-full shadow hover:scale-105 transition-transform"
                              onClick={() => {
                                setShowAuthModal(false);
                                // TODO: Chuyển hướng sang trang đăng nhập thực tế
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
                        <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center border border-red-300 shadow-2xl">
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
                              onClick={() => setShowGuestWarn(false)}
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
              <button className="flex items-center gap-3 bg-gradient-to-r from-[#ffe9b0] to-[#d4c4a8] hover:from-[#fffbe8] hover:to-[#b48a3c] text-[#4a3f2e] px-12 py-5 rounded-full text-2xl font-bold shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-[#fffbe8]">
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
        <div className="max-w-3xl mx-auto text-center relative z-10 animate-fade-in">
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

      {/* Traditional Crafts Section */}
      <section id="crafts" className="py-20 px-4 bg-gradient-to-b from-[#f5f0e8] to-[#e8dcc8]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px bg-[#b48a3c] flex-1"></div>
            <h2 className="text-5xl font-extrabold text-[#b48a3c] drop-shadow-lg tracking-wide flex items-center gap-3" style={{ fontFamily: 'serif' }}>
              <svg width="38" height="38" fill="none" viewBox="0 0 24 24"><path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="#ffe9b0"/></svg>
              Nghề truyền thống
              <svg width="38" height="38" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#b48a3c"/><path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </h2>
            <div className="h-px bg-[#b48a3c] flex-1"></div>
          </div>
          <p className="text-center text-[#4a3f2e] text-xl mb-14 max-w-3xl mx-auto font-medium">
            Hãy cùng khám phá những làng nghề truyền thống đặc sắc của Việt Nam, nơi lưu giữ tinh hoa văn hóa và bàn tay tài hoa của người Việt qua bao thế hệ!
          </p>
          <div className="relative">
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#fffbe8] border border-[#b48a3c] rounded-full shadow px-3 py-2 hover:bg-[#ffe9b0] transition"
              onClick={() => {
                sliderRef.current?.scrollBy({ left: -350, behavior: 'smooth' });
              }}
              aria-label="Trượt sang trái"
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#b48a3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div
              ref={sliderRef}
              className="flex gap-10 overflow-x-auto scroll-smooth pb-2 hide-scrollbar"
              style={{ scrollbarWidth: 'none' }}
            >
              {crafts.map((craft) => (
                <Link to={`/village/${craft.id}`} key={craft.id} className="block group focus:outline-none min-w-[340px] max-w-[340px]">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#b48a3c] bg-[#fffbe8] hover:scale-[1.03] hover:shadow-[0_8px_40px_rgba(180,138,60,0.18)] transition-all duration-500 flex flex-col h-full">
                    <div className="aspect-[4/3] md:aspect-square relative overflow-hidden">
                      <ImageWithFallback
                        src={craft.thumbnail}
                        alt={craft.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#b48a3c]/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-all duration-500"></div>
                      <div className="absolute top-3 left-3 bg-[#fffbe8]/80 px-4 py-1 rounded-full text-[#b48a3c] font-bold text-lg shadow-md border border-[#b48a3c]">
                        <svg className="inline-block mr-1 -mt-1" width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="#b48a3c"/></svg>
                        {craft.name}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between p-6 bg-[#fffbe8]">
                      <p className="text-[#4a3f2e] text-base md:text-lg mb-4 line-clamp-3 min-h-[60px]">
                        {craft.description || 'Khám phá quy trình, lịch sử và nét đẹp độc đáo của làng nghề truyền thống này!'}
                      </p>
                      <div className="flex justify-end">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#b48a3c] to-[#ffe9b0] text-[#4a3f2e] font-bold shadow hover:from-[#ffe9b0] hover:to-[#b48a3c] transition-all duration-300">
                          Xem chi tiết
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="#4a3f2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#ffe9b0] transition-all duration-500 pointer-events-none"></div>
                  </div>
                </Link>
              ))}
            </div>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#fffbe8] border border-[#b48a3c] rounded-full shadow px-3 py-2 hover:bg-[#ffe9b0] transition"
              onClick={() => {
                sliderRef.current?.scrollBy({ left: 350, behavior: 'smooth' });
              }}
              aria-label="Trượt sang phải"
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="#b48a3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
        
        {/* Recent reviews inserted to keep background continuous */}
        <div className="py-16">
          <RecentReviewList />
        </div>
      </section>

      {/* Footer follows immediately after reviews */}
      </div>

      <Footer />
    </>
  );
}
