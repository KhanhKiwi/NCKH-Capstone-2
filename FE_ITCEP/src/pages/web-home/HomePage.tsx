import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Link } from 'react-router';

export default function HomePage() {
  const crafts = [
    {
      title: 'Làng Gốm',
      image: 'https://images.unsplash.com/photo-1760894192884-37a7037200ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcG90dGVyeSUyMG1ha2luZyUyMGNyYWZ0c21hbnxlbnwxfHx8fDE3NzA5MDAwMTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      title: 'Làng Nón',
      image: 'https://images.unsplash.com/photo-1767281076397-b8ced2428626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY29uaWNhbCUyMGhhdCUyMG1ha2luZ3xlbnwxfHx8fDE3NzA5MDAwMTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      title: 'Làng Lụa',
      image: 'https://images.unsplash.com/photo-1569909115134-a0426936c879?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHNpbGslMjB0aHJlYWQlMjB3ZWF2aW5nfGVufDF8fHx8MTc3MDkwMDAxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      title: 'Làng Mây Tre',
      image: 'https://images.unsplash.com/photo-1677142707558-b02ac0690ecb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW1ib28lMjBiYXNrZXQlMjB3ZWF2aW5nJTIwY3JhZnR8ZW58MXx8fHwxNzcwOTAwMDE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  return (
    <div id="top" className="min-h-screen bg-[#f5f0e8]">
      {/* Navigation */}
      <nav className="bg-[#d4c4a8] border-b-4 border-[#8b6f47]">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-center gap-12">
            <a href="#top" className="text-[#4a3f2e] hover:text-[#6b5638] transition-colors text-lg">
              Trang Chủ
            </a>
            <span className="text-[#6b5638]">|</span>
            <a href="#crafts" className="text-[#4a3f2e] hover:text-[#6b5638] transition-colors text-lg">
              Các Nghề
            </a>
            <span className="text-[#6b5638]">|</span>
            <a href="#intro" className="text-[#4a3f2e] hover:text-[#6b5638] transition-colors text-lg">
              Về Chúng Tôi
            </a>
            <span className="text-[#6b5638]">|</span>
            <a href="#" className="text-[#4a3f2e] hover:text-[#6b5638] transition-colors text-lg">
              Liên Hệ
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[600px] bg-gradient-to-b from-[#8b6f47] to-[#4a3f2e]">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h1 className="text-white text-6xl mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style={{ fontFamily: 'serif' }}>
              Chào mừng đến với
            </h1>
            <h2 className="text-white text-7xl mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style={{ fontFamily: 'serif' }}>
              CraftSteps
            </h2>
            <p className="text-white text-xl mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Khám phá quy trình làng nghề truyền thống
            </p>
            <div className="flex gap-4">
              <Link to="/game">
                <button className="bg-[#4a7c2f] hover:bg-[#3d6827] text-white px-8 py-4 rounded-full text-lg transition-colors shadow-lg">
                  Bắt đầu chơi
                </button>
              </Link>
              <button className="bg-[#d4c4a8] hover:bg-[#c4b498] text-[#4a3f2e] px-8 py-4 rounded-full text-lg transition-colors shadow-lg">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section id="intro" className="py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px bg-[#8b6f47] flex-1"></div>
            <h2 className="text-4xl text-[#4a3f2e]" style={{ fontFamily: 'serif' }}>
              Giới thiệu về CraftSteps
            </h2>
            <div className="h-px bg-[#8b6f47] flex-1"></div>
          </div>
          <p className="text-[#4a3f2e] text-lg leading-relaxed mb-4">
            CraftSteps là trò chơi giáo dục mô phỏng quy trình làng nghề truyền thống Việt Nam.
          </p>
          <p className="text-[#4a3f2e] text-lg leading-relaxed">
            Trải nghiệm, học hỏi và khám phá nét đẹp văn hóa dân gian qua từng bước chân!
          </p>
          <div className="mt-8 flex justify-center">
            <svg width="60" height="40" viewBox="0 0 60 40" className="fill-[#c4a772]">
              <path d="M30 0 L60 20 L30 40 L0 20 Z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Traditional Crafts Section */}
      <section id="crafts" className="py-16 px-8 bg-gradient-to-b from-[#f5f0e8] to-[#e8dcc8]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px bg-[#8b6f47] flex-1"></div>
            <h2 className="text-4xl text-[#4a3f2e]" style={{ fontFamily: 'serif' }}>
              Nghề truyền thống
            </h2>
            <div className="h-px bg-[#8b6f47] flex-1"></div>
          </div>
          <p className="text-center text-[#4a3f2e] text-lg mb-12">
            Hãy cùng khám phá những làng nghề độc đáo:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {crafts.map((craft, index) => (
              <div
                key={index}
                className="bg-[#f5ebe0] rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300 border-4 border-[#8b6f47]"
              >
                <div className="aspect-square overflow-hidden">
                  <ImageWithFallback
                    src={craft.image}
                    alt={craft.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 bg-[#f5ebe0]">
                  <h3 className="text-2xl text-center text-[#4a3f2e]" style={{ fontFamily: 'serif' }}>
                    {craft.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative Footer Background */}
      <div className="h-32 bg-gradient-to-b from-[#e8dcc8] to-[#d4c4a8]"></div>
    </div>
  );
}
