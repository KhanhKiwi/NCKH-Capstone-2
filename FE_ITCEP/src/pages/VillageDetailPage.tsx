import { useParams, Link } from 'react-router';
import { villagesData } from '../data/villagesData';
import { ChevronLeft, MapPin, Play, Image as ImageIcon, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function VillageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const village = villagesData.find(v => v.id === id);
  const [activeTab, setActiveTab] = useState<'info' | 'video' | 'gallery'>('info');

  if (!village) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f0e8]">
        <h1 className="text-4xl text-[#4a3f2e] mb-4" style={{ fontFamily: 'serif' }}>Không tìm thấy làng nghề</h1>
        <Link to="/" className="text-[#4a7c2f] hover:underline flex items-center gap-2">
          <ChevronLeft /> Quay lại trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] pb-20">
      {/* Hero Header */}
      <div className="relative h-[60vh] md:h-[70vh] w-full bg-black">
        <img 
          src={village.thumbnail} 
          alt={village.name} 
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#2a241a] via-transparent to-black/30"></div>
        
        {/* Navigation Back */}
        <div className="absolute top-8 left-8 z-10">
          <Link to="/" className="flex items-center gap-2 text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full transition-all">
            <ChevronLeft size={20} />
            <span className="font-medium">Trở về</span>
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 text-[#e4d5b7] mb-3">
              <MapPin size={20} />
              <span className="text-lg font-medium">{village.location}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg" style={{ fontFamily: 'serif' }}>
              {village.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 -mt-10 relative z-10">
        
        {/* Tabs */}
        <div className="flex flex-wrap shadow-xl rounded-2xl bg-white overflow-hidden mb-12">
          <button 
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-5 px-6 font-semibold flex items-center justify-center gap-3 transition-colors ${activeTab === 'info' ? 'bg-[#4a7c2f] text-white' : 'text-[#6b5638] hover:bg-gray-50'}`}
          >
            <BookOpen size={20} /> Giới Thiệu
          </button>
          <button 
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-5 px-6 font-semibold flex items-center justify-center gap-3 transition-colors ${activeTab === 'video' ? 'bg-[#4a7c2f] text-white' : 'text-[#6b5638] hover:bg-gray-50'}`}
          >
            <Play size={20} /> Trải Nghiệm Video
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 py-5 px-6 font-semibold flex items-center justify-center gap-3 transition-colors ${activeTab === 'gallery' ? 'bg-[#4a7c2f] text-white' : 'text-[#6b5638] hover:bg-gray-50'}`}
          >
            <ImageIcon size={20} /> Ảnh Nổi Bật
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#e4d5b7]">
          
          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-10 animate-fade-in">
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-2 h-8 bg-[#4a7c2f] rounded-full"></div>
                  <h2 className="text-3xl text-[#4a3f2e] font-bold" style={{ fontFamily: 'serif' }}>Câu chuyện Làng Nghề</h2>
                </div>
                <p className="text-lg text-[#5a4a35] leading-relaxed">
                  {village.description}
                </p>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-2 h-8 bg-[#8b6f47] rounded-full"></div>
                  <h2 className="text-3xl text-[#4a3f2e] font-bold" style={{ fontFamily: 'serif' }}>Lịch sử hình thành</h2>
                </div>
                <p className="text-lg text-[#5a4a35] leading-relaxed bg-[#fbf9f4] p-6 rounded-2xl border border-[#e4d5b7]">
                  {village.history}
                </p>
              </section>
            </div>
          )}

          {/* Video Tab */}
          {activeTab === 'video' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-2 h-8 bg-[#4a7c2f] rounded-full"></div>
                <h2 className="text-3xl text-[#4a3f2e] font-bold" style={{ fontFamily: 'serif' }}>Quá trình chế tác thủ công</h2>
              </div>
              <p className="text-lg text-[#5a4a35] mb-8">
                Khám phá bàn tay tài hoa của các nghệ nhân qua từng công đoạn tỉ mỉ để tạo ra sản phẩm.
              </p>
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border-4 border-[#e4d5b7]">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={village.videoUrl} 
                  title={`Video ${village.name}`}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-8 bg-[#8b6f47] rounded-full"></div>
                <h2 className="text-3xl text-[#4a3f2e] font-bold" style={{ fontFamily: 'serif' }}>Sắc màu Làng Nghề</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {village.galleryImages.map((img, idx) => (
                  <div key={idx} className="group relative aspect-4/5 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer">
                    <img 
                      src={img} 
                      alt={`${village.name} ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <span className="text-white font-medium">Khám phá</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
