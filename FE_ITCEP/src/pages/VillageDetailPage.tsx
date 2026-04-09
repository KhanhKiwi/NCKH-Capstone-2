import { useParams, Link } from 'react-router';
import { villagesData } from '../data/villagesData';
import { ChevronLeft, MapPin, Play, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { villagesService } from '../api/villages/villagesService';
import { mediaService } from '../api/media/mediaService';

export default function VillageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [village, setVillage] = useState(() => villagesData.find(v => v.id === id) ?? null as any);
  const [activeTab, setActiveTab] = useState<'video' | 'gallery'>('video');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (village) return;
    if (!id) return;
    // if id is numeric, try backend API
    if (/^\d+$/.test(id)) {
      setLoading(true);
      villagesService
        .getOne(Number(id))
        .then((data) => {
          if (!data) {
            setError('Không tìm thấy làng nghề.');
            return;
          }
          const normalized = {
            id: data.id ?? data.village_id ?? String(data.village_id ?? data.id),
            name: data.name ?? data.title,
            location: data.city ?? data.location ?? '',
            thumbnail: data.thumbnail ?? data.image ?? data.media?.[0]?.url ?? '/picture/default-village.jpg',
            description: data.description ?? '',
            videoUrl: data.videoUrl ?? data.video_url ?? '',
            galleryImages: data.galleryImages ?? data.gallery_images ?? data.media?.map((m: any) => m.url) ?? [],
          };
          setVillage(normalized as any);
        })
        .catch((err) => {
          console.error('Village detail fetch error', err);
          setError('Lỗi khi tải dữ liệu.');
        })
        .finally(() => setLoading(false));
    }
  }, [id, village]);

  // Load media images for this village from backend media table
  useEffect(() => {
    let mounted = true;
    if (!village) return;

    async function loadMedia() {
      try {
        console.log('VillageDetail: loading media for village:', village)
        // If village.id looks numeric, use it directly
        if (/^\d+$/.test(String(village.id))) {
          const items = await mediaService.getByVillage(Number(village.id));
          console.log('VillageDetail: mediaService.getByVillage result (numeric id):', items)
          if (!mounted) return;
          const urls = items.map((m: any) => m.url).filter(Boolean);
          if (urls.length) setVillage((s: any) => ({ ...s, galleryImages: urls }));
          return;
        }

        // Otherwise try to resolve numeric village id by matching existing backend villages
        const all = await villagesService.getAll();
        console.log('VillageDetail: villagesService.getAll:', all)
        // normalize helper: remove diacritics and non-alphanumerics
        const normalize = (s: any) => {
          if (!s) return ''
          try {
            const str = String(s)
              .normalize('NFD')
              .replace(/\p{Diacritic}/gu, '')
            return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          } catch (e) {
            return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-')
          }
        }
        const targetSlug = normalize(String(village.id))

        const match = (all || []).find((bv: any) => {
          if (!bv) return false;
          if (bv.id != null && String(bv.id) === String(village.id)) return true;
          if (bv.village_id != null && String(bv.village_id) === String(village.id)) return true;
          const nameNorm = normalize(bv.name)
          // consider contains so short slugs like 'bat-trang' match 'lang-gom-bat-trang'
          if (nameNorm === targetSlug || nameNorm.includes(targetSlug) || targetSlug.includes(nameNorm)) return true;
          if (bv.name && village.name && normalize(bv.name) === normalize(village.name)) return true;
          return false;
        });

        console.log('VillageDetail: matched backend village:', match)
        if (match) {
          const vid = match.village_id ?? match.id;
          const items = await mediaService.getByVillage(vid);
          console.log('VillageDetail: mediaService.getByVillage result (matched):', items)
          if (!mounted) return;
          const urls = items.map((m: any) => m.url).filter(Boolean);
          if (urls.length) setVillage((s: any) => ({ ...s, galleryImages: urls }));
        }
      } catch (err) {
        console.warn('loadMedia error', err);
      }
    }

    loadMedia();
    return () => { mounted = false; };
  }, [village]);

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
      {/* Loading / Error indicators (uses hooks to avoid TS unused errors) */}
      {loading && (
        <div className="w-full text-center py-2 bg-yellow-50 text-yellow-800">Đang tải dữ liệu...</div>
      )}
      {error && (
        <div className="w-full text-center py-2 bg-red-50 text-red-800">{error}</div>
      )}
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
          {/* 'Giới Thiệu' removed per request */}
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
          
          {/* Info tab removed */}

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
                {village.galleryImages.map((img: string, idx: number) => (
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
