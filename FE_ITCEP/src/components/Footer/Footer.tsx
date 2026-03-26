import { Facebook, Instagram, Youtube, Mail, MessageSquare, AlertCircle } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Subtle Vietnamese Pattern Background */}
      <div className={styles.patternBackground} />

      {/* Main Footer Content */}
      <div className={styles.mainContent}>
        <div className={styles.gridContainer}>

          {/* Column 1: Brand */}
          <div className={`${styles.column} ${styles.brandColumn}`}>
            <h2 className={styles.brandTitle}>
              CraftSteps
            </h2>
            <p className={styles.brandDescription}>
              Trải nghiệm làng nghề Việt Nam qua từng bước chân
            </p>
            <p className={styles.brandSubText}>
              Game tương tác giúp học và bảo tồn nghề thủ công truyền thống
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className={styles.column}>
            <h3 className={styles.sectionHeading}>
              Khám phá
            </h3>
            <ul className={styles.linkList}>
              {[
                'Trang chủ',
                'Các Level',
                'Hướng dẫn chơi',
                'Tiến độ của tôi',
                'Về làng nghề'
              ].map((item) => (
                <li key={item} className={styles.linkItem}>
                  <a
                    href="#"
                    className={styles.link}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Project Info */}
          <div className={styles.column}>
            <h3 className={styles.sectionHeading}>
              Dự án
            </h3>
            <ul className={styles.projectList}>
              <li className={styles.projectItem}>
                <span className={styles.projectBullet}>•</span>
                <span>Capstone Project 2026</span>
              </li>
              <li className={styles.projectItem}>
                <span className={styles.projectBullet}>•</span>
                <span>International School<br/>Đại học Duy Tân</span>
              </li>
              <li className={styles.projectItem}>
                <span className={styles.projectBullet}>•</span>
                <span>Mentor: TS. Nguyễn Đức Mẫn</span>
              </li>
              <li className={styles.projectItem}>
                <span className={styles.projectBullet}>•</span>
                <span>Phát triển bởi Team C2SE.02</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className={styles.column}>
            <h3 className={styles.sectionHeading}>
              Liên hệ
            </h3>
            <div className={styles.contactSection}>
              <a
                href="mailto:craftsteps.dt@gmail.com"
                className={styles.contactLink}
              >
                <Mail className={styles.contactIcon} />
                <span className="break-all">craftsteps.dt@gmail.com</span>
              </a>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a
                  href="#"
                  className={styles.contactLink}
                >
                  <MessageSquare className={styles.contactIcon} />
                  <span>Gửi phản hồi</span>
                </a>
                <a
                  href="#"
                  className={styles.contactLink}
                >
                  <AlertCircle className={styles.contactIcon} />
                  <span>Báo lỗi</span>
                </a>
              </div>

              {/* Social Media Icons */}
              <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(245, 237, 228, 0.1)' }}>
                <p className={styles.socialLabel}>Theo dõi chúng tôi</p>
                <div className={styles.socialIcons}>
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
                      className={styles.socialIcon}
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
      <div className={styles.bottomBar}>
        <div className={styles.bottomContent}>
          <div className={styles.bottomGrid}>
            <div className={`${styles.copyrightSection}`}>
              <p className={styles.copyrightText}>© 2026 CraftSteps. All rights reserved.</p>
              <span className={`${styles.separator} hidden md:inline`}>|</span>
              <div className={styles.copyrightLinks}>
                <a href="#" className={styles.copyrightLink}>
                  Chính sách bảo mật
                </a>
                <span className={styles.separator}>|</span>
                <a href="#" className={styles.copyrightLink}>
                  Điều khoản dịch vụ
                </a>
              </div>
            </div>

            <div className={styles.creditsSection}>
              <p className={styles.creditsText}>
                Made with <span className={styles.heart}>❤️</span> vì Di sản Văn hóa Việt Nam
              </p>
              <span className={`${styles.separator} hidden md:inline`}>|</span>
              <div className={styles.languageToggle}>
                <button className={`${styles.languageBtn} ${styles.languageBtnActive}`}>
                  VN
                </button>
                <span className={styles.separator}>/</span>
                <button className={styles.languageBtn}>
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
