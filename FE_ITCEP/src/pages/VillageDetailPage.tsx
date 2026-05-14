import { useParams, Link } from 'react-router';
import { MapPin, Image as ImageIcon, Clapperboard, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { villagesService } from '../api/villages/villagesService';
import { mediaService } from '../api/media/mediaService';
function normalizeVideoUrl(url: string): string {
  if (!url) return '';

  // Convert common YouTube formats to embeddable URL.
  if (url.includes('youtube.com/watch')) {
    try {
      const parsed = new URL(url);
      const id = parsed.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
    } catch {
      return url;
    }
  }

  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    if (id) return `https://www.youtube.com/embed/${id}`;
  }

  return url;
}

function isLikelyVideoUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return lower.includes('youtube.com')
    || lower.includes('youtu.be')
    || lower.includes('vimeo.com')
    || lower.endsWith('.mp4')
    || lower.endsWith('.webm')
    || lower.endsWith('.mov');
}

function isEmbedVideoUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('vimeo.com');
}

export default function VillageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [village, setVillage] = useState<any>(null);
  const [lightbox, setLightbox] = useState<{ open: boolean; src?: string }>({ open: false });
  const [activeMediaTab, setActiveMediaTab] = useState<'image' | 'video'>('image');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        // Prefer numeric id lookup, fallback to searching all villages
        if (/^\d+$/.test(id)) {
          const data = await villagesService.getOne(Number(id));
          if (mounted) setVillage(data ?? null);
        } else {
          const all = await villagesService.getAll();
          const found = (all || []).find((v: any) => String(v.id) === id || String(v.village_id) === id || (v.slug && v.slug === id));
          if (mounted) setVillage(found ?? null);
        }

        // try loading media images when we have a numeric village id
        const vid = Number(id);
        if (!Number.isNaN(vid)) {
          try {
            const media = await mediaService.getByVillage(vid);
            if (mounted && media && media.length) {
              const urls = media.map((m: any) => m.url).filter(Boolean);
              const galleryImages = urls.filter((u: string) => !isLikelyVideoUrl(u));
              const galleryVideos = urls.filter((u: string) => isLikelyVideoUrl(u)).map((u: string) => normalizeVideoUrl(u));
              setVillage((prev: any) => ({ ...(prev || {}), galleryImages, galleryVideos }));
            }
          } catch {
            // ignore
          }
        }
      } catch (e) {
        console.error(e);
        if (mounted) setError('Lỗi khi tải dữ liệu.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [id]);

  const imageUrls: string[] = Array.isArray(village?.galleryImages) ? village.galleryImages : [];
  const rawVideoCandidates = [
    ...(Array.isArray(village?.galleryVideos) ? village.galleryVideos : []),
    village?.videoUrl,
    village?.video_url,
    village?.video,
    village?.video_link,
  ].filter(Boolean) as string[];

  // Add user-provided embed videos only for pottery villages
  const EXTRA_VIDEOS = [
    'https://www.youtube.com/embed/KFyk7IMz4Lo?si=1tINfYfHQXH8ngUQ',
    'https://www.youtube.com/embed/SFD520DRknc?si=Z9f74TYaA-HlGxZ4',
  ];
  const isPotteryVillage = (() => {
    if (!village) return false;
    const name = String(village.name || '').toLowerCase();
    if (/gốm|gom|ceramic|ceramics/.test(name)) return true;
    const vid = String(village.id ?? village.village_id ?? '');
    if (vid === '1') return true; // fallback for seeded Bát Tràng id=1
    return false;
  })();

  if (isPotteryVillage) {
    for (const extra of EXTRA_VIDEOS) {
      const idPart = extra.split('/embed/')[1]?.split('?')[0] ?? extra;
      if (!rawVideoCandidates.some((u) => (u || '').includes(idPart))) {
        rawVideoCandidates.push(extra);
      }
    }
  }

  // Add specific weaving village videos for làng dệt (village_id=3)
  const WEAVING_VIDEOS = [
    'https://www.youtube.com/embed/vNqxiGkEj6E?si=bT7siT1QQ4HDCrGc',
    'https://www.youtube.com/embed/Hozm4jnVMKA?si=KVMnmhpaT71xGWpk',
  ];
  const isWeavingVillage = (() => {
    if (!village) return false;
    const name = String(village.name || '').toLowerCase();
    if (/dệt|det|weave|weaving/.test(name)) return true;
    const vid = String(village.id ?? village.village_id ?? '');
    if (vid === '3') return true; // Dệt Đinh Yên seeded as id=3
    return false;
  })();

  if (isWeavingVillage) {
    for (const extra of WEAVING_VIDEOS) {
      const idPart = extra.split('/embed/')[1]?.split('?')[0] ?? extra;
      if (!rawVideoCandidates.some((u) => (u || '').includes(idPart))) {
        rawVideoCandidates.push(extra);
      }
    }
  }

  // Add specific Nam Ô (mắm) village videos for làng mắm Nam Ô (village_id=2)
  const NAM_O_VIDEOS = [
    'https://www.youtube.com/embed/8RUi3EkHu4s?si=xdGdezmA0lxVPNPo',
    'https://www.youtube.com/embed/4Nd7qZisUGs?si=wThGhxTJZTLKMJNn',
  ];
  const isNamOVillage = (() => {
    if (!village) return false;
    const name = String(village.name || '').toLowerCase();
    if (/mắm|mam|nam ô|nam o|nam_o/.test(name)) return true;
    const vid = String(village.id ?? village.village_id ?? '');
    if (vid === '2') return true; // Làng Mắm Nam Ô seeded as id=2
    return false;
  })();

  if (isNamOVillage) {
    for (const extra of NAM_O_VIDEOS) {
      const idPart = extra.split('/embed/')[1]?.split('?')[0] ?? extra;
      if (!rawVideoCandidates.some((u) => (u || '').includes(idPart))) {
        rawVideoCandidates.push(extra);
      }
    }
  }

  // Add specific Tranh Đông Hồ village video (village_id=4)
  const DONG_HO_VIDEO = 'https://www.youtube.com/embed/jSGZjatBYwg?si=zCisyK9rYt487peJ';
  const isDongHoVillage = (() => {
    if (!village) return false;
    const name = String(village.name || '').toLowerCase();
    if (/tranh|đông hồ|dong ho/.test(name)) return true;
    const vid = String(village.id ?? village.village_id ?? '');
    if (vid === '4') return true; // Tranh Đông Hồ seeded as id=4
    return false;
  })();

  if (isDongHoVillage) {
    const idPart = DONG_HO_VIDEO.split('/embed/')[1]?.split('?')[0] ?? DONG_HO_VIDEO;
    if (!rawVideoCandidates.some((u) => (u || '').includes(idPart))) {
      rawVideoCandidates.push(DONG_HO_VIDEO);
    }
  }

  // Add specific Lụa Vạn Phúc village video (village_id=5)
  const SILK_VIDEO = 'https://www.youtube.com/embed/EsKRFrninyU?si=Wx6IPjFtBkz_5CAr';
  const isSilkVillage = (() => {
    if (!village) return false;
    const name = String(village.name || '').toLowerCase();
    if (/lụa|lua|silk|vạn phúc|van phuc/.test(name)) return true;
    const vid = String(village.id ?? village.village_id ?? '');
    if (vid === '5') return true; // Lụa Vạn Phúc seeded as id=5
    return false;
  })();

  if (isSilkVillage) {
    const idPart = SILK_VIDEO.split('/embed/')[1]?.split('?')[0] ?? SILK_VIDEO;
    if (!rawVideoCandidates.some((u) => (u || '').includes(idPart))) {
      rawVideoCandidates.push(SILK_VIDEO);
    }
  }

  const videoUrls = Array.from(new Set(rawVideoCandidates.map((u) => normalizeVideoUrl(u))));

  useEffect(() => {
    if (!lightbox.open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightbox({ open: false });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightbox.open]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  if (!village) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f0e8]">
      <h1 className="text-3xl text-[#4a3f2e]">Không tìm thấy làng nghề</h1>
      <Link to="/" className="mt-4 text-[#4a7c2f]">Quay lại</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f0e8] pb-20">

      <main className="max-w-6xl mx-auto px-6 md:px-12 -mt-10 relative z-10">
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-[#efe7dd]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <section className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-4xl md:text-5xl font-serif text-[#3f3224] tracking-tight leading-tight">Giới thiệu</h2>
                <div className="text-sm text-[#8b6f47]">{activeMediaTab === 'image' ? `${imageUrls.length} ảnh` : `${videoUrls.length} video`}</div>
              </div>

              <p
                className="text-[#5a4a35] text-lg md:text-xl leading-relaxed tracking-normal text-justify max-w-[65ch]"
                style={{ fontFamily: 'Arial, Roboto, "Helvetica Neue", Helvetica, system-ui, -apple-system, "Segoe UI", sans-serif', lineHeight: 1.9, letterSpacing: '0.2px' }}
              >
                {village.description ?? 'Chưa có giới thiệu.'}
              </p>

              <div className="mt-8">
                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-[#4a3f2e] tracking-wide">
                  {activeMediaTab === 'image' ? 'Hình ảnh nổi bật' : 'Video nổi bật'}
                </h3>
                {activeMediaTab === 'image' ? (
                  imageUrls.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {imageUrls.map((src: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => setLightbox({ open: true, src })}
                          className="group rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300"
                          aria-label={`Mở ảnh ${i + 1}`}
                        >
                          <img src={src} alt={`${village.name} ${i + 1}`} className="w-full h-44 md:h-48 object-cover group-hover:scale-110 transition-transform duration-700" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-600"><ImageIcon /> Không có ảnh</div>
                  )
                ) : (
                  videoUrls.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {videoUrls.map((src, index) => (
                        <div key={`${src}-${index}`} className="rounded-xl overflow-hidden shadow-lg bg-black">
                          {isEmbedVideoUrl(src) ? (
                            <iframe
                              className="w-full aspect-video"
                              src={src}
                              title={`Video ${index + 1} - ${village.name}`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          ) : (
                            <video className="w-full aspect-video" controls>
                              <source src={src} />
                              Trình duyệt không hỗ trợ phát video.
                            </video>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-600">Không có video</div>
                  )
                )}
              </div>
            </section>

            <aside className="space-y-5">
              <div className="p-4 rounded-xl bg-white shadow-lg border border-[#f0e6db] flex items-center gap-4">
                <div className="flex-shrink-0 bg-gradient-to-br from-[#e9f6e8] to-[#f0faf2] p-3 rounded-lg">
                  <MapPin className="text-[#4a7c2f]" />
                </div>
                <div>
                  <div className="text-xs uppercase text-[#9b8161] tracking-wide">Vị trí</div>
                  <div className="mt-1 text-lg font-semibold text-[#3f3224]">{village.location ?? village.city ?? 'Không rõ'}</div>
                  <div className="mt-2 text-sm text-[#7a6a55]">Khám phá văn hoá địa phương và điểm tham quan</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white shadow-lg border border-[#f0e6db]">
                <div className="text-xs uppercase text-[#9b8161] tracking-wide mb-3">Nội dung</div>
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#f7efe3] p-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('image')}
                    className={`inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${activeMediaTab === 'image'
                      ? 'bg-[#4a7c2f] text-white shadow-[0_8px_18px_rgba(74,124,47,0.35)]'
                      : 'bg-transparent text-[#5a4a35] hover:bg-white/70'}`}
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>Ảnh</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('video')}
                    className={`inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${activeMediaTab === 'video'
                      ? 'bg-[#4a7c2f] text-white shadow-[0_8px_18px_rgba(74,124,47,0.35)]'
                      : 'bg-transparent text-[#5a4a35] hover:bg-white/70'}`}
                  >
                    <Clapperboard className="h-4 w-4" />
                    <span>Video</span>
                  </button>
                </div>
              </div>

              {/* ID card removed as requested */}

              <div className="p-4 bg-[#faf6f0] rounded-xl text-center">
                <div className="text-sm text-[#6b5638]">Khám phá thêm</div>
                <Link to="/" className="mt-3 inline-block text-sm text-white bg-[#4a7c2f] px-4 py-2 rounded-full">Trang chủ</Link>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Lightbox modal */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setLightbox({ open: false })}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setLightbox({ open: false })}
              className="absolute -top-12 right-0 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 px-3 py-1.5 text-white hover:bg-white/25 transition"
            >
              <span className="text-sm font-medium">Đóng</span>
              <X className="h-4 w-4" />
            </button>
            <div className="bg-black rounded-lg overflow-hidden p-3 md:p-4">
              <img src={lightbox.src} alt="Preview" className="block mx-auto w-auto max-w-full max-h-[82vh] object-contain bg-black" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
