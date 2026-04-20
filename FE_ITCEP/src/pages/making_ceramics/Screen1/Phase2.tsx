import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from 'react-router'
import confetti from 'canvas-confetti'
import GuideDialog from '../../../util/shared/GuideDialog'

type Phase2Props = {
	onComplete?: (result?: { smoothness?: number; stars?: number }) => void;
};

// Redesigned Phase2: cleaner UI, clear states, start/pause/reset, result modal.
export default function Phase2({ onComplete }: Phase2Props) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const rafRef = useRef<number | null>(null);
	const [state, setState] = useState<'idle'|'playing'|'paused'|'won'|'lost'>('idle');
	const [progress, setProgress] = useState(0); // 0..1
	const INITIAL_TIME = 45; // increased from 35 to give more play time
	const INITIAL_REQUIRED = 800; // increased from 420 so progress requires more effort
	const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
	const [summaryOpen, setSummaryOpen] = useState(false);
	const [starCount, setStarCount] = useState(3);
	const navigate = useNavigate()
	const required = useRef(INITIAL_REQUIRED);
	const knead = useRef(0);
	const particles = useRef<{x:number;y:number;vx:number;vy:number;life:number}[]>([]);
	const lastPos = useRef<{x:number,y:number}|null>(null);
	const [btnHover, setBtnHover] = useState(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const c = canvas as HTMLCanvasElement;
		const ctx = c.getContext('2d')!;

		// create a small noise texture once for subtle clay grain
		const noiseSize = 200;
		const noiseCanvas = document.createElement('canvas');
		noiseCanvas.width = noiseSize; noiseCanvas.height = noiseSize;
		const nctx = noiseCanvas.getContext('2d')!;
		const nimg = nctx.createImageData(noiseSize, noiseSize);
		for (let i=0;i<nimg.data.length;i+=4){
			const v = 180 + Math.floor(Math.random()*60) - 30; // subtle variation
			nimg.data[i] = v; nimg.data[i+1] = v; nimg.data[i+2] = v; nimg.data[i+3] = 12; // low alpha
		}
		nctx.putImageData(nimg,0,0);
		const noisePattern = ctx.createPattern(noiseCanvas, 'repeat');

		function resize() {
			c.width = c.clientWidth;
			c.height = c.clientHeight;
		}
		resize();
		window.addEventListener('resize', resize);

		let t = 0;
		function frame() {
			t += 0.016;
			const w = c.width, h = c.height;
			ctx.clearRect(0,0,w,h);

			// soft background
			const g = ctx.createLinearGradient(0,0,0,h);
			g.addColorStop(0,'#fffaf0'); g.addColorStop(1,'#f6efe6');
			ctx.fillStyle = g; ctx.fillRect(0,0,w,h);

			// blob
			const cx = w/2, cy = h/2;
			// idle animation: soft pulsing and bob when not playing
			const idlePulse = state === 'idle' ? (1 + Math.sin(t * 1.6) * 0.06) : 1;
			const idleBob = state === 'idle' ? Math.sin(t * 1.2) * 8 : 0;
			const baseR = Math.min(w,h) * 0.16 * idlePulse;
			const jitter = state === 'idle' ? 6 : (1-progress)*12;
			ctx.save();
			ctx.beginPath();
			const steps = 36;
			for (let i=0;i<steps;i++){
				const a = (i/steps)*Math.PI*2;
				// add a small deterministic wobble plus a bit of random for organic look
				const wobble = Math.sin(t*2.2 + i*0.3) * (jitter*0.01);
				const r = baseR + Math.sin(t*3 + i) * (0.6 + jitter*0.02) * 0.6 + wobble;
				const x = cx + Math.cos(a)*r;
				const y = cy + Math.sin(a)*r + idleBob;
				if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
			}
			ctx.closePath();
			// create a richer clay radial gradient (specular + mid + rim)
			const grad = ctx.createRadialGradient(cx - baseR*0.25, cy - baseR*0.35 + idleBob, baseR*0.08, cx, cy + idleBob, baseR*1.8);
			// core warm tone
			grad.addColorStop(0, state === 'idle' ? '#f6d8bb' : '#f3d1b0');
			grad.addColorStop(0.45, '#e0ae7e');
			grad.addColorStop(0.72, '#c98754');
			grad.addColorStop(1, '#9b5b33');

			// fill main blob
			ctx.fillStyle = grad;
			// soft outer shadow for depth (kept subtle to keep rim crisp)
			ctx.shadowColor = 'rgba(0,0,0,0.18)'; ctx.shadowBlur = state === 'idle' ? 20 : 30;
			ctx.fill();
			ctx.shadowBlur = 0;

			// overlay subtle clay grain using pattern with low alpha
			if (noisePattern) {
				ctx.globalAlpha = 0.06;
				ctx.fillStyle = noisePattern;
				ctx.fill();
				ctx.globalAlpha = 1;
			}

			// crisp rim: inner light stroke and outer darker thin stroke for definition
			ctx.lineWidth = 3;
			ctx.strokeStyle = 'rgba(255,255,255,0.08)';
			ctx.stroke();
			ctx.lineWidth = 4;
			ctx.strokeStyle = 'rgba(40,20,10,0.12)';
			ctx.stroke();

			// specular highlight (small bright spot)
			ctx.beginPath();
			const sx = cx - baseR*0.35, sy = cy - baseR*0.45 + idleBob;
			const sgrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, baseR*0.6);
			sgrad.addColorStop(0, 'rgba(255,255,255,0.9)');
			sgrad.addColorStop(0.25, 'rgba(255,255,255,0.6)');
			sgrad.addColorStop(1, 'rgba(255,255,255,0)');
			ctx.fillStyle = sgrad;
			ctx.arc(sx, sy, baseR*0.45, 0, Math.PI*2);
			ctx.fill();

			ctx.restore();

			// particles
			for (let i=particles.current.length-1;i>=0;i--){
				const p = particles.current[i];
				p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.life -= 0.02;
				if (p.life<=0) particles.current.splice(i,1);
				else { ctx.beginPath(); ctx.fillStyle = `rgba(220,150,100,${p.life})`; ctx.arc(p.x,p.y,3+4*p.life,0,Math.PI*2); ctx.fill(); }
			}

			// slow knead decay so player must keep working
			knead.current = Math.max(0, knead.current - 0.02);

			rafRef.current = requestAnimationFrame(frame);
		}
		rafRef.current = requestAnimationFrame(frame);

		return () => { window.removeEventListener('resize', resize); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
	}, [progress, state]);

	// timer
	useEffect(() => {
		if (state !== 'playing') return;
		const id = setInterval(()=>{
			setTimeLeft(t => {
				if (t<=1){ clearInterval(id); setState('lost'); return 0; }
				return t-1;
			});
		},1000);
		return ()=>clearInterval(id);
	},[state]);

	// confetti on win
	useEffect(()=>{
		if (state === 'won') {
			try { confetti({ particleCount: 120, spread: 70, origin: { y: 0.4 } }) } catch(e){}
		}
	},[state]);

	// compute star rating (1..3) when the player wins
	useEffect(()=>{
		if (state === 'won'){
			// Star calculation based purely on time left (seconds)
			// 3 stars: timeLeft >= 35 (covers 35-40 and above)
			// 2 stars: 20 <= timeLeft < 35
			// 1 star: timeLeft < 20
			let s = 1;
			if (timeLeft >= 35) s = 3;
			else if (timeLeft >= 20) s = 2;
			else s = 1;
			setStarCount(s);
		}
	},[state, timeLeft]);

	// keep `timeLeft` referenced (timer is hidden from UI but used for scoring)
	useEffect(() => {
		// intentionally empty: referencing timeLeft to avoid linter unused-var warnings
	}, [timeLeft]);

	// confetti on win


	const spawn = useCallback((x:number,y:number,n=6)=>{
		for (let i=0;i<n;i++){ const a=Math.random()*Math.PI*2,s=1+Math.random()*2; particles.current.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1.2,life:0.8+Math.random()*0.6}); }
	},[]);

	// pointer events
	useEffect(()=>{
		const c0 = canvasRef.current; if (!c0) return; const c = c0 as HTMLCanvasElement;
		function toLocal(e:PointerEvent){ const r=c.getBoundingClientRect(); return {x:e.clientX-r.left, y:e.clientY-r.top}; }
		const down = (e:PointerEvent)=>{
			if (state!=='playing') return; c.setPointerCapture(e.pointerId); const p=toLocal(e); lastPos.current=p; spawn(p.x,p.y,10);
		};
		const move = (e:PointerEvent)=>{
			if (state!=='playing') return; if (e.buttons===0) return; const p=toLocal(e);
			if (lastPos.current){ const dx=p.x-lastPos.current.x, dy=p.y-lastPos.current.y; const dist=Math.hypot(dx,dy);
				// harder: reduce per-move contribution and require more total effort
				knead.current += Math.min(2.2, dist*0.07);
				spawn(p.x,p.y,2);
				lastPos.current=p; const pr = Math.min(1, knead.current/required.current); setProgress(pr);
				if (pr>=1){ setState('won'); setTimeout(()=>onComplete&&onComplete({smoothness:1}),650); }
			}
		};
		const up = (e:PointerEvent)=>{ try{ if (typeof c.releasePointerCapture === 'function') c.releasePointerCapture(e.pointerId);}catch(err){ console.warn('releasePointerCapture failed', err); } lastPos.current=null; };
		c.addEventListener('pointerdown', down); c.addEventListener('pointermove', move); c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
		return ()=>{ c.removeEventListener('pointerdown', down); c.removeEventListener('pointermove', move); c.removeEventListener('pointerup', up); c.removeEventListener('pointercancel', up); };
	},[state,spawn,onComplete]);

	const start = () => { knead.current=0; setProgress(0); setTimeLeft(INITIAL_TIME); required.current=INITIAL_REQUIRED; setState('playing'); };
	// pause handler removed; primary button now toggles play/pause
	const reset = () => { knead.current=0; setProgress(0); setTimeLeft(INITIAL_TIME); required.current=INITIAL_REQUIRED; setState('idle'); }

	return (
		<div style={{width:'100%',height:'100%',position:'relative',fontFamily:'Inter,system-ui,Arial'}}>
			{/* small inline keyframes for shake */}
			<style>{`@keyframes shake { 0% { transform: translateX(0) } 20% { transform: translateX(-6px) } 40% { transform: translateX(6px) } 60% { transform: translateX(-4px) } 80% { transform: translateX(4px) } 100% { transform: translateX(0) } }`}</style>
			<div style={{position:'absolute',inset:0,overflow:'hidden'}}>
				<img src="/assets/making_mats/level5/tải xuống.jpg" alt="bg" style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.28,filter:'blur(4px)'}}/>
				<div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,transparent,#F0E0C0)'}}/>
			</div>

			{/* Header card (top center) */}
			<div style={{position:'absolute',left:'50%',top:28,transform:'translateX(-50%)',width:'min(920px,92%)',zIndex:40}}>
				<div style={{background:'linear-gradient(90deg,#fffaf0,#fff7ed)',borderRadius:18,padding:'18px 20px',boxShadow:'0 18px 48px rgba(0,0,0,0.12)',border:'1px solid rgba(201,166,107,0.12)',display:'flex',gap:16,alignItems:'center'}} className="fade-in-up">
					<div style={{width:56,height:56,borderRadius:12,background:'linear-gradient(135deg,#f59e0b,#d97706)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,boxShadow:'0 8px 22px rgba(213,125,42,0.18)'}}>
						<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
							<path d="M12 2c2.5 0 4 1.5 4 3.5S14.5 9 12 9s-4-2-4-3.5S9.5 2 12 2z" fill="rgba(255,255,255,0.95)" />
							<path d="M4 12c0 4 3 8 8 8s8-4 8-8c0-1.2-.9-2-2-2H6c-1.1 0-2 .8-2 2z" fill="rgba(255,255,255,0.85)" />
						</svg>
					</div>
					<div style={{flex:1}}>
						<div style={{fontSize:22,fontWeight:800,color:'#7a2f00',lineHeight:1.05}}>Level 1 — Màn 2: Nhào và làm mịn</div>
						<div style={{marginTop:6,color:'#8a6b4e'}}>Thực hành nhào và làm mịn đất — dùng tay để tạo bề mặt mịn và đồng đều.</div>
					</div>
					<div style={{marginLeft:12}}>
						<span style={{display:'inline-block',background:'#fff3cd',color:'#92400e',padding:'8px 12px',borderRadius:999,fontWeight:700}}>Thực hành • Tương tác</span>
					</div>
				</div>
				<style>{`.fade-in-up { animation: fadeInUp 520ms cubic-bezier(.2,.9,.2,1) both } @keyframes fadeInUp { from { transform: translateY(8px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }`}</style>
			</div>

			<div style={{position:'absolute',left:'50%',top:120,transform:'translateX(-50%)',width:900,maxWidth:'92%',height:600,borderRadius:20,background:'linear-gradient(135deg,#fffaf0,#fff7ed)',border:'10px solid #C9A66B',boxShadow:'0 30px 80px rgba(0,0,0,0.25)',zIndex:20}}>
				<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
					<canvas ref={canvasRef} style={{width:'100%',height:'100%',display:'block',borderRadius:12}}/>
				</div>

				{/* time pill (visible) */}
				<div style={{position:'absolute',left:20,top:20,display:'flex',gap:12}}>
					{/* timer pill with warning style when <= 10s */}
					<div style={{padding:'10px 14px',borderRadius:14,background: timeLeft <= 10 ? '#ef4444' : '#fff',boxShadow: timeLeft <= 10 ? '0 10px 30px rgba(239,68,68,0.18)' : '0 8px 24px rgba(0,0,0,0.06)', transition: 'all 220ms ease'}}>
						<div style={{fontSize:11,color: timeLeft <= 10 ? '#fff' : '#8a6b4e',fontWeight:700}}>Thời gian</div>
						<div style={{fontSize:15,fontWeight:800,color: timeLeft <= 10 ? '#fff' : '#000', animation: timeLeft <= 10 ? 'shake 700ms ease-in-out infinite' : undefined}}>{timeLeft}s</div>
					</div>
				</div>

				<div style={{position:'absolute',right:20,top:20}}>
					<div style={{display:'flex',gap:8,background:'rgba(255,255,255,0.96)',padding:8,borderRadius:14,boxShadow:'0 10px 30px rgba(0,0,0,0.05)'}}>
						<button
							onClick={() => {
								if (state === 'idle') start();
								else if (state === 'playing') setState('paused');
								else if (state === 'paused') setState('playing');
							}}
							onMouseEnter={() => setBtnHover(true)}
							onMouseLeave={() => setBtnHover(false)}
							style={{padding:'10px 16px',background: '#f59e0b',color: 'white',borderRadius:12,fontWeight:800,border: 'none',transform: btnHover ? 'translateY(-3px) scale(1.02)' : 'none',transition: 'transform 160ms ease, box-shadow 160ms ease',boxShadow: btnHover ? '0 14px 36px rgba(245,158,11,0.18)' : '0 6px 18px rgba(245,158,11,0.12)'}}
						>
							{state === 'idle' ? 'Bắt đầu' : state === 'playing' ? 'Tạm dừng' : 'Tiếp tục'}
						</button>
						<button onClick={reset} style={{padding:'8px 12px',borderRadius:10,border:'1px solid rgba(0,0,0,0.06)',background:'white'}}>Reset</button>
					</div>
				</div>

				{/* bottom hazy progress bar (no numeric percent) */}
				<div style={{position:'absolute',left:24,right:24,bottom:18,height:16,borderRadius:12,background:'rgba(255,255,255,0.56)',backdropFilter:'blur(6px)',boxShadow:'0 10px 24px rgba(0,0,0,0.06)'}}>
					<div style={{height:'100%',borderRadius:12,background:'linear-gradient(90deg, rgba(211,122,58,0.56), rgba(163,87,35,0.48))',width:`${Math.round(progress*100)}%`,transition:'width 260ms ease'}} />
				</div>



				{state==='won' && (
					<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:80}}>
						<style>{`
						@keyframes popIn { from { transform: scale(.92); opacity: 0 } to { transform: scale(1); opacity: 1 } }
						@keyframes floatUp { 0%{ transform: translateY(8px)} 50%{transform:translateY(0)} 100%{transform:translateY(6px)} }
						`}</style>
						<div style={{width:360,background:'linear-gradient(180deg,#ffffff,#f8fff7)',padding:22,borderRadius:16,boxShadow:'0 30px 90px rgba(20,30,10,0.22)',textAlign:'center',animation:'popIn 320ms cubic-bezier(.2,.9,.2,1) both',border:'1px solid rgba(0,0,0,0.06)'}}>
							<div style={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12}}>
								<div style={{width:72,height:72,borderRadius:999,display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(180deg,#fff7f0,#fffbf6)',boxShadow:'0 10px 30px rgba(245,158,11,0.12)',marginRight:12}}>
									<span style={{fontSize:34}}>🏅</span>
								</div>
								<div style={{textAlign:'left'}}>
									<h2 style={{margin:'0 0 6px',fontSize:22,color:'#6b3f1a'}}>Hoàn thành!</h2>
									<div style={{color:'#7a5236'}}>Bạn đã làm mịn đất rất tốt.</div>
								</div>
							</div>
							<div style={{display:'flex',gap:12,justifyContent:'center',marginTop:16}}>
								<button onClick={() => setSummaryOpen(true)} style={{padding:'10px 18px',background:'linear-gradient(90deg,#10b981,#06a86b)',color:'white',borderRadius:12,border:'none',fontWeight:800,boxShadow:'0 10px 30px rgba(16,185,129,0.18)'}}>Tổng kết</button>
								<button onClick={reset} style={{padding:'10px 18px',background:'white',borderRadius:12,border:'1px solid rgba(0,0,0,0.06)',fontWeight:700}}>Chơi lại</button>
							</div>
							</div>
						</div>
						) }

					{/* Summary modal (1-3 stars) */}
					{summaryOpen && (
						<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:120}}>
							<div style={{width:440,background:'linear-gradient(180deg,#fffef8,#fff7f0)',padding:28,borderRadius:16,boxShadow:'0 40px 120px rgba(10,20,10,0.28)',textAlign:'center',animation:'popIn 320ms cubic-bezier(.2,.9,.2,1) both',border:'1px solid rgba(0,0,0,0.06)'}}>
								<h2 style={{margin:'0 0 8px',fontSize:22,color:'#6b3f1a'}}>Tổng kết</h2>
								<div style={{color:'#7a5236',marginBottom:14}}>chúc mừng bạn đã hoàn thành level 1</div>
								<div style={{display:'flex',justifyContent:'center',gap:12,marginBottom:14}}>
										{[1,2,3].map(i=> (
											<span key={i} style={{fontSize:46, transform: i<=starCount ? 'scale(1.06)' : 'scale(.92)', transition:'transform 260ms cubic-bezier(.2,.9,.2,1)', color: i<=starCount ? '#6b3f1a' : '#e9dfd4'}} aria-hidden>
												{i<=starCount ? '★' : '☆'}
											</span>
										))}
								</div>
								<div style={{color:'#5b3a26',marginBottom:10}}>Độ mịn: <strong>{Math.round(progress*100)}%</strong></div>
								<div style={{color:'#5b3a26',marginBottom:18}}>Thời gian còn lại: <strong>{timeLeft}s</strong></div>
								<div style={{display:'flex',gap:12,justifyContent:'center'}}>
									<button onClick={()=>{
										try{ localStorage.setItem('phase2_stars', String(starCount)); localStorage.setItem('phase2_result','won') }catch{}
										if (onComplete) onComplete({ smoothness: progress, stars: starCount });
										setSummaryOpen(false);
										navigate('/craft-selection?openName=B%C3%A1t%20Tr%C3%A0ng');
									}} style={{padding:'10px 18px',background:'linear-gradient(90deg,#10b981,#06a86b)',color:'white',borderRadius:12,border:'none',fontWeight:800}}>Hoàn tất</button>
									<button onClick={()=>{ setSummaryOpen(false); reset(); navigate('/bat-trang/level-1'); }} style={{padding:'10px 18px',background:'white',borderRadius:12,border:'1px solid rgba(0,0,0,0.06)',fontWeight:700}}>Chơi lại</button>
								</div>
							</div>
						</div>
					)}
				{state==='lost' && (
					<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:80}}>
						<style>{`@keyframes shakeX { 0%{ transform: translateX(0) } 25%{ transform: translateX(-6px) } 50%{ transform:translateX(6px)} 75%{transform:translateX(-4px)} 100%{transform:translateX(0)} }`}</style>
						<div style={{width:360,background:'linear-gradient(180deg,#fff8f8,#fffafc)',padding:22,borderRadius:16,boxShadow:'0 30px 90px rgba(30,10,10,0.14)',textAlign:'center',border:'1px solid rgba(0,0,0,0.04)',animation:'popIn 320ms cubic-bezier(.2,.9,.2,1) both'}}>
							<div style={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12}}>
								<div style={{width:72,height:72,borderRadius:999,display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(180deg,#fff,#fff)',boxShadow:'0 8px 20px rgba(0,0,0,0.06)',marginRight:12}}>
									<span style={{fontSize:34}}>😕</span>
								</div>
								<div style={{textAlign:'left'}}>
									<h2 style={{margin:'0 0 6px',fontSize:22,color:'#6b3f1a'}}>Hết thời gian</h2>
									<div style={{color:'#7a5236'}}>Bạn đã hết thời gian — thử lại để cải thiện kỹ thuật nhé.</div>
								</div>
							</div>
							<div style={{display:'flex',gap:12,justifyContent:'center',marginTop:16}}>
								<button onClick={start} style={{padding:'10px 18px',background:'linear-gradient(90deg,#f59e0b,#f07b17)',color:'white',borderRadius:12,border:'none',fontWeight:800,boxShadow:'0 10px 30px rgba(240,120,20,0.12)'}}>Thử lại</button>
								<button onClick={reset} style={{padding:'10px 18px',background:'white',borderRadius:12,border:'1px solid rgba(0,0,0,0.06)',fontWeight:700}}>Thoát</button>
							</div>
						</div>
					</div>
				)}

			</div>

			{/* Guide dialog (mimic Screen3 weaving) */}
			<div style={{position:'absolute', right:40, top:96, zIndex:40, transition: 'transform 320ms ease'}}>
				<GuideDialog
					started={state === 'playing'}
					showRequireStart={false}
					win={state === 'won'}
					progress={Math.round(progress * 100)}
					onNext={() => { if (onComplete) onComplete({ smoothness: progress }); }}
					phase="phase2"
					message={state === 'won' ? 'Hoàn thành! Bạn đã làm mịn tốt — tiếp tục nhé.' : undefined}
				/>
			</div>
		</div>
	);
}

