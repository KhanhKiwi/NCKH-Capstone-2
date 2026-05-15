import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Callout from '../components/UI/Callout';
import VillageCard from '../components/AboutPage/VillageCard';
import { useEffect, useState } from 'react';
import { villagesService } from '../api/villages/villagesService';
import Accordion from '../components/AboutPage/Accordion';

export default function AboutPage() {
  const [villages, setVillages] = useState<any[]>([])
  const [loadingVillages, setLoadingVillages] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await villagesService.getAll()
        if (!mounted) return
        // normalize fields
        const list = Array.isArray(data)
          ? data.map((v: any) => ({
              id: v.id ?? v.village_id ?? v._id,
              name: v.name ?? v.title ?? 'Làng nghề',
              province: v.city ?? v.location ?? '',
              tags: v.tags ?? [],
              image: v.image ?? v.thumbnail ?? null,
            }))
          : []
        setVillages(list)
      } catch (err) {
        console.warn('Failed to load villages', err)
      } finally {
        setLoadingVillages(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])
  return (
    <div className="min-h-screen bg-[#f6f1e8] text-[#3f3224]">
      <main className="max-w-5xl mx-auto px-6 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold mb-4">Tìm hiểu thêm về CraftSteps</h1>
          <p className="text-lg text-[#6b5a46] max-w-3xl mx-auto">Trang này mô tả sứ mệnh, cách hoạt động, nguồn dữ liệu, các tính năng chính và hướng dẫn tận dụng CraftSteps để khám phá các làng nghề truyền thống Việt Nam. Dành cho người đọc muốn hiểu sâu hơn và sử dụng trang hiệu quả.</p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link to="/game" className="bg-[#4a7c2f] text-white px-5 py-3 rounded-full font-semibold shadow hover:opacity-95">Bắt đầu chơi</Link>
            <Link to="/villages" className="bg-white border border-[#4a7c2f] text-[#4a7c2f] px-5 py-3 rounded-full font-semibold shadow">Quy trình làm</Link>
          </div>
        </header>

        <section className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-3">Sứ mệnh của chúng tôi</h2>
          <p className="leading-relaxed mb-4">CraftSteps tồn tại để đưa tiếng nói, kỹ nghệ và câu chuyện của các làng nghề truyền thống Việt Nam đến với công chúng rộng rãi — để nhiều người biết, trân trọng và góp phần giúp những làng nghề ấy trường tồn.</p>

          <ul className="list-disc pl-6 space-y-2 text-[#5a4a35]">
            <li>Lan toả nhận thức: giới thiệu lịch sử, nghề nghiệp, và giá trị văn hoá của làng nghề tới đông đảo khán giả trong nước và quốc tế.</li>
            <li>Bảo tồn tri thức sống: ghi chép kỹ thuật, quy trình và câu chuyện của nghệ nhân để truyền lại cho thế hệ sau.</li>
            <li>Hỗ trợ cộng đồng địa phương: kết nối nghệ nhân với người học, khách du lịch và đối tác để nghề được duy trì và phát triển bền vững.</li>
            <li>Khuyến khích trải nghiệm thực tế: cung cấp các tài nguyên, bài học và hoạt động trải nghiệm giúp người dùng hiểu sâu và gắn bó hơn với nghề.</li>
          </ul>
        </section>

        

        <section className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <Callout icon={<span>✨</span>} title="CraftSteps là gì">
            CraftSteps là nền tảng giáo dục và khám phá tương tác tập trung vào các làng nghề truyền thống Việt Nam. Chúng tôi kết hợp tư liệu, hướng dẫn theo bước, nội dung đa phương tiện và các bài tập thực hành để giúp người dùng hiểu quy trình, kỹ năng và câu chuyện đằng sau mỗi nghề.
          </Callout>

          <h3 className="text-xl font-medium mb-2 mt-2">Danh sách làng nghề</h3>
          <p className="leading-relaxed mb-4">Danh sách các làng nghề có thể được duyệt theo tỉnh hoặc theo thể loại nghề (ví dụ: gốm, dệt, mộc, đan, sơn mài). Dưới đây là một ví dụ nhanh:</p>
            <div className="flex flex-wrap justify-center gap-8 mb-6">
              {loadingVillages && (
                <div className="col-span-3 text-sm text-[#6b5a46]">Đang tải làng nghề...</div>
              )}
              {!loadingVillages && villages.length === 0 && (
                <div className="col-span-3 text-sm text-[#6b5a46]">Không tìm thấy làng nghề.</div>
              )}
              {!loadingVillages && villages.map((v) => (
                <div key={v.id} className=""> 
                  <VillageCard name={v.name} province={v.province} tags={v.tags} to={`/village/${v.id}`} image={v.image} />
                </div>
              ))}
            </div>

          {/* Tiến trình học đã được loại bỏ per user request */}

          <h3 className="text-xl font-medium mb-2 mt-4">Giá trị văn hoá</h3>
          <Callout icon={<span>🛖</span>} title="Giá trị văn hoá">
            Các làng nghề lưu giữ tri thức, kỹ thuật và câu chuyện cộng đồng. CraftSteps tôn trọng giá trị này bằng cách ghi nhận nguồn gốc, kể chuyện của nghệ nhân và khuyến khích tương tác có trách nhiệm, góp phần bảo tồn và truyền tiếp các giá trị văn hoá cho thế hệ sau.
          </Callout>

          <h2 className="text-2xl font-semibold mb-3">Những điều bạn có thể làm ở đây</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Khám phá</h4>
              <p className="text-sm text-[#6b5a46]">Duyệt theo danh sách, lọc theo tỉnh/thể loại nghề, xem gallery, và video nổi bật.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Học & Thực hành</h4>
              <p className="text-sm text-[#6b5a46]">Theo dõi các level hướng dẫn, hoàn thành thử thách và nhận huy hiệu ảo (ở chặng này).</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Đóng góp</h4>
              <p className="text-sm text-[#6b5a46]">Gửi nội dung bạn ghi lại, đề xuất chỉnh sửa mô tả, hoặc đề xuất làng mới để bổ sung vào cơ sở dữ liệu.</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-3">Cách dùng CraftSteps</h2>
          <ol className="list-decimal pl-6 space-y-3 text-[#5a4a35]">
            <li><strong>Duyệt làng nghề:</strong> Sử dụng trang chủ hoặc thanh tìm kiếm để chọn làng, đọc mô tả và xem hình ảnh/clip.</li>
            <li><strong>Học kỹ thuật:</strong> Mỗi nghề có các bài học, mức (levels) minh hoạ quy trình. Hoàn thành bài học để mở các thử thách tiếp theo.</li>
            <li><strong>Tham gia tương tác:</strong> Gửi bình luận, đánh giá trải nghiệm.</li>
          </ol>
        </section>

        <section className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-3">FAQ - Những câu hỏi thường gặp</h2>
          <Accordion
            items={[
              {
                title: '📸 Làm sao để gửi nội dung (ảnh/video)?',
                content: 'Bạn có thể dùng form đóng góp trong phần liên hệ hoặc gửi email kèm nguồn và mô tả. Chúng tôi sẽ xác minh trước khi đăng.',
              },
              {
                title: '📚 Có thể sử dụng tài liệu cho mục đích giáo dục?',
                content: 'Hầu hết tài liệu có thể sử dụng cho mục đích học tập phi thương mại; vui lòng trích nguồn và liên hệ nếu cần sử dụng cho mục đích thương mại.',
              },
              {
                title: '🤝 Làm thế nào để doanh nghiệp hợp tác?',
                content: 'Gửi yêu cầu hợp tác thông qua trang Liên hệ. Chúng tôi hợp tác trong các dự án giáo dục, du lịch trải nghiệm và bảo tồn nghề truyền thống.',
              },
            ]}
          />
        </section>

        <section className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-2xl font-semibold mb-3">Đội ngũ và liên hệ</h2>
          <p className="leading-relaxed mb-4">CraftSteps được phát triển bởi một nhóm nhỏ gồm nhà phát triển, nhà thiết kế và cộng tác viên nội dung/nhà nghiên cứu văn hoá. Chúng tôi trân trọng mọi góp ý và cộng tác từ cộng đồng.</p>
          <p className="text-sm text-[#6b5a46]">Email: <a href="mailto:info@craftsteps.example" className="text-[#4a7c2f] underline">info@craftsteps.example</a></p>
          <p className="text-sm text-[#6b5a46] mt-2">Nếu bạn muốn trao đổi sâu hơn hoặc gửi nguồn tư liệu, vui lòng <Link to="/contact" className="text-[#4a7c2f] underline">liên hệ</Link>.</p>
        </section>

        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-3 bg-[#4a7c2f] text-white px-6 py-3 rounded-full font-semibold shadow-lg">Quay lại Trang chủ</Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
