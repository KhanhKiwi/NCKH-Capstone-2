import React, { useState } from 'react';

export default function FooterReviewForm() {
  const [form, setForm] = useState({ name: '', content: '' });
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim() || rating <= 0) {
      setError('Vui lòng nhập tên, nội dung đánh giá và chọn số sao.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setForm({ name: '', content: '' });
      setRating(0);
      setHoverRating(0);
      setTimeout(() => setSuccess(false), 2000);
    }, 900);
  };

  return (
    <form
      className="w-full max-w-xs mx-auto rounded-2xl shadow-xl border-2 border-[#b48a3c] flex flex-col gap-4 px-6 py-7 bg-[#2c2419]"
      style={{ boxShadow: '0 4px 24px 0 rgba(180,138,60,0.18)' }}
      onSubmit={handleSubmit}
    >
      <h3 className="text-xl font-extrabold text-[#ffe9b0] text-center mb-2 drop-shadow-lg tracking-wide" style={{ fontFamily: 'serif' }}>Đánh giá của bạn</h3>
      <input
        type="text"
        name="name"
        placeholder="Tên của bạn"
        className="px-4 py-2 rounded-lg border-2 border-[#ffe9b0] bg-[#232218] text-[#ffe9b0] focus:border-[#b48a3c] outline-none text-base font-medium shadow-sm transition placeholder:text-[#b48a3c]/60"
        value={form.name}
        onChange={handleChange}
        disabled={submitting}
        maxLength={32}
        required
      />

      <div className="flex flex-col items-center gap-3">
        <div className="sr-only">Chọn số sao</div>
        <div className="flex items-center gap-2 justify-center">
          {[1,2,3,4,5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
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
        maxLength={300}
        required
        style={{ overflow: 'hidden' }}
      />
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
