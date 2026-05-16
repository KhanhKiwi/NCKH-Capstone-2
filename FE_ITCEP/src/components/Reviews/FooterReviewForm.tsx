import React, { useState } from 'react';
import { feedbackService } from '../../api/feedback/feedbackService';
import { authService } from '../../api/services/authService';

export default function FooterReviewForm() {
  const [form, setForm] = useState({ name: '', content: '' });
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value
    if (e.target.name === 'content') {
      // enforce 100-character limit
      if (val.length > 100) {
        const truncated = val.slice(0, 100)
        setForm((f) => ({ ...f, content: truncated }))
        setCharCount(100)
      } else {
        setForm((f) => ({ ...f, content: val }))
        setCharCount(val.length)
      }
    } else {
      setForm((f) => ({ ...f, [e.target.name]: val }));
    }
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating <= 0) {
      setError('Vui lòng chọn số sao.');
      return;
    }
    // validate content character count
    const contentLen = (form.content || '').length
    if (contentLen === 0) {
      setError('Vui lòng nhập nội dung đánh giá.');
      setSubmitting(false)
      return
    }
    if (contentLen > 100) {
      setError('Nội dung chỉ cho phép tối đa 100 ký tự.');
      setSubmitting(false)
      return
    }
    setError('');
    setSubmitting(true);

    const isAnonymous = form.name === 'Ẩn danh';
    const payload: any = {
      content: form.content || '',
      rating,
    };

    // try to get profile to use name from DB and include userId
    const token = authService.getToken();
    if (token) {
      try {
        const profile = await authService.getProfile();
        const id = Number(profile?.user_id ?? profile?.id ?? profile?.userId);
        if (id) payload.userId = id;
        // prefer profile name when available
        const profileName = profile?.name || profile?.fullName || profile?.username || profile?.email;
        if (!isAnonymous && profileName) {
          payload.name = profileName;
        }
      } catch (e) {
        // ignore profile errors
      }
    }

    // if anonymous explicitly chosen, override name to 'Ẩn danh'
    if (isAnonymous) payload.name = 'Ẩn danh';

    console.log('Sending feedback payload', payload);
    try {
      await feedbackService.create(payload as any);
      setSuccess(true);
      setForm({ name: '', content: '' });
      setCharCount(0);
      setRating(0);
      setHoverRating(0);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      console.error('Failed to send feedback', err?.response ?? err);
      const serverMsg = err?.response?.data?.message || err?.message;
      setError(serverMsg ? `Gửi phản hồi thất bại: ${serverMsg}` : 'Gửi phản hồi thất bại. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="w-full max-w-xs mx-auto rounded-2xl shadow-xl border-2 border-[#b48a3c] flex flex-col gap-4 px-6 py-7 bg-[#2c2419]"
      style={{ boxShadow: '0 4px 24px 0 rgba(180,138,60,0.18)' }}
      onSubmit={handleSubmit}
    >
      <h3 className="text-xl font-extrabold text-[#ffe9b0] text-center mb-2 drop-shadow-lg tracking-wide" style={{ fontFamily: 'serif' }}>Đánh giá của bạn</h3>
      <button
        type="button"
        onClick={() => {
          setError('');
          setForm((f) => ({ ...f, name: f.name === 'Ẩn danh' ? '' : 'Ẩn danh' }));
        }}
        aria-pressed={form.name === 'Ẩn danh'}
        className={`w-full flex items-center justify-between px-4 py-2 rounded-xl border-2 ${form.name === 'Ẩn danh' ? 'border-[#b48a3c] bg-[#15381f]' : 'border-[#b88f4b] bg-[#232218]'} text-[#ffe9b0] focus:outline-none text-base font-medium shadow-[0_6px_18px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-[1.01]`}
        disabled={submitting}
        title="Nhấn để đăng ẩn danh"
      >
        <span className="select-none text-lg pl-1">Ẩn danh</span>
        <span className="ml-3 flex items-center justify-center">
          {form.name === 'Ẩn danh' ? (
            <span className="w-7 h-7 rounded-full bg-[#0f2b19] border-2 border-[#b48a3c] flex items-center justify-center shadow-inner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          ) : (
            <span className="w-7 h-7 rounded-full border-2 border-[#7a663c] bg-transparent flex items-center justify-center" />
          )}
        </span>
      </button>

      <div className="flex flex-col items-center gap-3">
        <div className="sr-only">Chọn số sao</div>
        <div className="flex items-center gap-2 justify-center">
          {[1,2,3,4,5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { setRating(s); setError(''); }}
              onMouseEnter={() => setHoverRating(s)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1"
              aria-label={`${s} sao`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill={(hoverRating||rating) >= s ? '#ffe9b0' : '#3a2f25'} stroke="#b48a3c"/>
              </svg>
            </button>
          ))}
        </div>
      </div>

      <textarea
        name="content"
        placeholder="Nội dung đánh giá..."
        className="px-4 py-2 rounded-lg border-2 border-[#ffe9b0] bg-[#232218] text-[#ffe9b0] focus:border-[#b48a3c] outline-none text-base font-medium min-h-[80px] h-32 resize-none shadow-sm transition placeholder:text-[#b48a3c]/60 scrollbar-hide"
        value={form.content}
        onChange={handleChange}
        disabled={submitting}
        maxLength={100}
        style={{ overflow: 'hidden' }}
      />
      <div className="text-xs text-[#ffe9b0] text-right">{charCount}/100 ký tự</div>
      {error && <div className="text-red-400 text-sm font-semibold text-center">{error}</div>}
      {success && <div className="text-green-400 text-sm font-semibold text-center">Cảm ơn bạn đã gửi đánh giá!</div>}
      <button
        type="submit"
        className="mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#ffe9b0] to-[#b48a3c] text-[#4a3f2e] font-extrabold text-base shadow-lg hover:from-[#b48a3c] hover:to-[#ffe9b0] transition-all duration-200 disabled:opacity-60"
        disabled={submitting}
        style={{ letterSpacing: '0.01em' }}
      >
        {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
      </button>
    </form>
  );
}
