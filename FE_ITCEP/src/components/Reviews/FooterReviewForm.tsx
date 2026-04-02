import React, { useState } from 'react';

export default function FooterReviewForm() {
  const [form, setForm] = useState({ name: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) {
      setError('Vui lòng nhập tên và nội dung đánh giá.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setForm({ name: '', content: '' });
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
