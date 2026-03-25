import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Link } from 'react-router';
import { villagesData } from '../../data/villagesData';

export default function HomePage() {
  const crafts = villagesData;

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* Navigation */}
      <nav className="bg-[#d4c4a8] border-b-4 border-[#8b6f47]">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-center gap-12">
            <Link to="/" className="text-[#4a3f2e] hover:text-[#6b5638] transition-colors text-lg">
              Trang Chủ
            </Link>
            <span className="text-[#6b5638]">|</span>
            <a href="#" className="text-[#4a3f2e] hover:text-[#6b5638] transition-colors text-lg">
              Các Nghề
            </a>
            <span className="text-[#6b5638]">|</span>
            <a href="#" className="text-[#4a3f2e] hover:text-[#6b5638] transition-colors text-lg">
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
      <section className="py-16 px-8">
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
      <section className="py-16 px-8 bg-gradient-to-b from-[#f5f0e8] to-[#e8dcc8]">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {crafts.map((craft) => (
              <Link to={`/village/${craft.id}`} key={craft.id} className="block group">
                <div
                  className="bg-[#f5ebe0] rounded-lg overflow-hidden shadow-xl transform group-hover:-translate-y-2 transition-all duration-300 border-4 border-[#8b6f47] h-full flex flex-col"
                >
                  <div className="aspect-square overflow-hidden relative">
                    <ImageWithFallback
                      src={craft.thumbnail}
                      alt={craft.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                  </div>
                  <div className="p-6 bg-[#f5ebe0] flex-1 flex flex-col justify-center">
                    <h3 className="text-2xl text-center text-[#4a3f2e]" style={{ fontFamily: 'serif' }}>
                      {craft.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative Footer Background */}
      <div className="h-32 bg-gradient-to-b from-[#e8dcc8] to-[#d4c4a8]"></div>
    </div>
  );
}
