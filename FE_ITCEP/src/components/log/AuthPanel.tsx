import { Mail, Lock, User, ArrowRight } from 'lucide-react';

interface AuthPanelProps {
  activeTab: 'login' | 'register';
  setActiveTab: (tab: 'login' | 'register') => void;
  isForgotPassword?: boolean;
  setIsForgotPassword?: (val: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  username: string;
  setUsername: (username: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  name: string;
  setName: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  error?: string;
  message?: string;
}

export default function AuthPanel({
  activeTab,
  setActiveTab,
  isForgotPassword = false,
  setIsForgotPassword,
  email,
  setEmail,
  username,
  setUsername,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  name,
  setName,
  onSubmit,
  isLoading = false,
  error = '',
  message = '',
}: AuthPanelProps) {
  return (
    <div className="w-[40%] flex items-center justify-center p-8">
      <div className="relative w-full max-w-md">
        {/* Journey Line Decoration */}
        <svg className="absolute -left-16 top-0 w-32 h-full" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 60 0 Q 40 200 60 400 T 60 800"
            stroke="#f59e0b"
            strokeWidth="3"
            fill="none"
            opacity="0.3"
          />
        </svg>

        {/* Auth Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-amber-100">
          {/* Tabs */}
          {!isForgotPassword && (
            <div className="relative flex gap-4 mb-8">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 pb-3 text-lg font-semibold transition-all duration-300 ${
                  activeTab === 'login'
                    ? 'text-amber-700'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Tiếp tục hành trình
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 pb-3 text-lg font-semibold transition-all duration-300 ${
                  activeTab === 'register'
                    ? 'text-amber-700'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Bắt đầu khám phá
              </button>
              {/* Animated underline */}
              <div
                className={`absolute bottom-0 h-1 bg-gradient-to-r from-amber-500 to-green-500 rounded-full transition-all duration-300 ${
                  activeTab === 'login' ? 'left-0 w-[calc(50%-0.5rem)]' : 'left-[calc(50%+0.5rem)] w-[calc(50%-0.5rem)]'
                }`}
              />
            </div>
          )}

          {isForgotPassword && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-amber-800 mb-2">Quên mật khẩu?</h2>
              <p className="text-gray-600 text-sm">Nhập email của bạn để nhận liên kết đặt lại mật khẩu.</p>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {activeTab === 'register' && !isForgotPassword && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600 transition-all group-focus-within:scale-110" />
                <input
                  type="text"
                  placeholder="Tên của bạn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none transition-all duration-300 bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600 transition-all group-focus-within:scale-110" />
              <input
                type={isForgotPassword ? "email" : "text"}
                placeholder={isForgotPassword ? "Email" : "Email hoặc Tên đăng ký"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none transition-all duration-300 bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {activeTab === 'register' && !isForgotPassword && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600 transition-all group-focus-within:scale-110" />
                <input
                  type="text"
                  placeholder="Tên đăng ký"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none transition-all duration-300 bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            )}

            {!isForgotPassword && (
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600 transition-all group-focus-within:scale-110" />
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none transition-all duration-300 bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            )}

            {activeTab === 'register' && !isForgotPassword && (
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600 transition-all group-focus-within:scale-110" />
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none transition-all duration-300 bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            )}

            {activeTab === 'login' && !isForgotPassword && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword?.(true)}
                  className="text-sm text-amber-600 hover:text-amber-700 hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`group w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-green-500 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                isLoading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-xl hover:scale-[1.02]'
              }`}
            >
              <span>
                {isLoading
                  ? isForgotPassword ? 'Đang gửi...' : activeTab === 'login' ? 'Đang đăng nhập...' : 'Đang đăng ký...'
                  : isForgotPassword ? 'Gửi yêu cầu' : activeTab === 'login' ? 'Tiếp tục hành trình' : 'Bắt đầu khám phá'}
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {isForgotPassword && (
              <button
                type="button"
                onClick={() => setIsForgotPassword?.(false)}
                className="w-full text-center text-sm text-gray-500 hover:text-amber-600 transition-colors"
              >
                Quay lại đăng nhập
              </button>
            )}
          </form>

          {/* Divider */}
          {!isForgotPassword && (
            <>
              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-400">hoặc</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Social Login */}
              <div className="space-y-3">
                <a href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/auth/google`} className="w-full py-3 border-2 border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-all duration-300 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium">Tiếp tục với Google</span>
                </a>
              </div>

              {/* Switch Tab Link */}
              <p className="mt-6 text-center text-sm text-gray-600">
                {activeTab === 'login' ? (
                  <>
                    Chưa có tài khoản?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className="text-amber-600 font-semibold hover:text-amber-700 hover:underline"
                    >
                      Bắt đầu khám phá
                    </button>
                  </>
                ) : (
                  <>
                    Đã có tài khoản?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-amber-600 font-semibold hover:text-amber-700 hover:underline"
                    >
                      Tiếp tục hành trình
                    </button>
                  </>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
