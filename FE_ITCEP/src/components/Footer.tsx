import { Facebook, Instagram, Youtube, Mail, MessageSquare, AlertCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#2C2419] text-[#F5EDE4] overflow-hidden">
      {/* Subtle Vietnamese Pattern Background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l5 10-5 10-5-10zm0 40l5 10-5 10-5-10zM0 30l10-5 10 5-10 5zm40 0l10-5 10 5-10 5z' fill='%23F0D4B0' fill-opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Main Footer Content */}
      <div className="relative w-full px-8 md:px-16 lg:px-20 py-20 md:py-28">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16">

          {/* Column 1: Brand */}
          <div className="space-y-6 lg:col-span-1">
            <h2 className="text-7xl font-bold text-[#F0D4B0] tracking-wide leading-tight">
              CraftSteps
            </h2>
            <p className="text-2xl text-[#E8C39E] italic leading-relaxed font-medium">
              Trải nghiệm làng nghề Việt Nam qua từng bước chân
            </p>
            <p className="text-xl text-[#F5EDE4]/85 leading-relaxed">
              Game tương tác giúp học và bảo tồn nghề thủ công truyền thống
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-[#F0D4B0] pb-2">
              Khám phá
            </h3>
            <ul className="space-y-4">
              {[
                'Trang chủ',
                'Các Level',
                'Hướng dẫn chơi',
                'Tiến độ của tôi',
                'Về làng nghề'
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-xl text-[#F5EDE4]/90 hover:text-[#F0D4B0] transition-colors duration-300 inline-block hover:translate-x-2 transform"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Project Info */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-[#F0D4B0] pb-2">
              Dự án
            </h3>
            <ul className="space-y-4 text-xl text-[#F5EDE4]/90">
              <li className="flex items-start gap-3">
                <span className="text-[#E8C39E] mt-1 flex-shrink-0">•</span>
                <span>Capstone Project 2026</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#E8C39E] mt-1 flex-shrink-0">•</span>
                <span>International School<br/>Đại học Duy Tân</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#E8C39E] mt-1 flex-shrink-0">•</span>
                <span>Mentor: TS. Nguyễn Đức Mẫn</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#E8C39E] mt-1 flex-shrink-0">•</span>
                <span>Phát triển bởi Team C2SE.02</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-[#F0D4B0] pb-2">
              Liên hệ
            </h3>
            <div className="space-y-5">
              <a
                href="mailto:craftsteps.dt@gmail.com"
                className="flex items-center gap-3 text-xl text-[#F5EDE4]/90 hover:text-[#F0D4B0] transition-colors duration-300 group"
              >
                <Mail className="w-5 h-5 group-hover:scale-125 transition-transform flex-shrink-0" />
                <span className="break-all text-xl">craftsteps.dt@gmail.com</span>
              </a>

              <div className="flex flex-col gap-4 text-xl">
                <a
                  href="#"
                  className="flex items-center gap-2 text-[#F5EDE4]/90 hover:text-[#F0D4B0] transition-colors duration-300"
                >
                  <MessageSquare className="w-5 h-5 flex-shrink-0" />
                  <span>Gửi phản hồi</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-[#F5EDE4]/90 hover:text-[#F0D4B0] transition-colors duration-300"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>Báo lỗi</span>
                </a>
              </div>

              {/* Social Media Icons */}
              <div className="pt-6 border-t border-[#F5EDE4]/10">
                <p className="text-lg text-[#F5EDE4]/60 mb-4 font-medium">Theo dõi chúng tôi</p>
                <div className="flex gap-4">
                  {[
                    { Icon: Facebook, label: 'Facebook' },
                    { Icon: Instagram, label: 'Instagram' },
                    { Icon: () => (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    ), label: 'TikTok' },
                    { Icon: Youtube, label: 'YouTube' }
                  ].map(({ Icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      className="w-11 h-11 rounded-full bg-[#3A2F22] flex items-center justify-center text-[#E8C39E] hover:bg-[#F0D4B0] hover:text-[#2C2419] transition-all duration-300 hover:scale-125 hover:shadow-lg hover:shadow-[#F0D4B0]/30"
                      aria-label={label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative bg-[#1F1A15] border-t-2 border-[#F0D4B0]/20 mt-6 md:mt-8">
        <div className="w-full px-8 md:px-16 lg:px-20 py-8 md:py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-lg md:text-xl text-[#F5EDE4]/70">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-center md:text-left order-2 md:order-1">
              <p className="font-medium">© 2026 CraftSteps. All rights reserved.</p>
              <span className="hidden md:inline text-[#F5EDE4]/30">|</span>
              <div className="flex gap-4 md:gap-6">
                <a href="#" className="hover:text-[#F0D4B0] transition-colors duration-300 font-medium">
                  Chính sách bảo mật
                </a>
                <span className="text-[#F5EDE4]/30">|</span>
                <a href="#" className="hover:text-[#F0D4B0] transition-colors duration-300 font-medium">
                  Điều khoản dịch vụ
                </a>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 order-1 md:order-2">
              <p className="flex items-center gap-2 text-center">
                Made with <span className="text-red-400 text-2xl">❤️</span> vì Di sản Văn hóa Việt Nam
              </p>
              <span className="hidden md:inline text-[#F5EDE4]/30">|</span>
              <div className="flex gap-1 bg-[#2C2419] rounded-lg p-1">
                <button className="px-3 py-1 rounded hover:bg-[#F0D4B0] hover:text-[#2C2419] transition-colors duration-300 text-[#F0D4B0] font-semibold text-sm">
                  VN
                </button>
                <span className="text-[#F5EDE4]/40">/</span>
                <button className="px-3 py-1 rounded hover:bg-[#F0D4B0] hover:text-[#2C2419] transition-colors duration-300 text-[#F5EDE4]/70 font-semibold text-sm">
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
