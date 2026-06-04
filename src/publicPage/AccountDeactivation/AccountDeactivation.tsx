import { useEffect, useRef, useState } from 'react'

export default function AccountDeactivate() {
  const [inputVal, setInputVal] = useState('')
  const [otpOpen, setOtpOpen] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [success, setSuccess] = useState(false)
  const [toast, setToast] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Auto-fill from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const account = params.get('account') || params.get('phone') || params.get('email')
    if (account) setInputVal(decodeURIComponent(account))
  }, [])

  const startTimer = () => {
    setTimer(30)
    setCanResend(false)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const openOtp = () => {
    setOtp(['', '', '', '', '', ''])
    setOtpOpen(true)
    startTimer()
    setTimeout(() => inputRefs.current[0]?.focus(), 350)
  }

  const closeOtp = () => {
    setOtpOpen(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const handleOtpChange = (val: string, idx: number) => {
    const clean = val.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[idx] = clean
    setOtp(next)
    if (clean && idx < 5) inputRefs.current[idx + 1]?.focus()
  }

  const handleOtpKey = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) inputRefs.current[idx - 1]?.focus()
    if (e.key === 'ArrowLeft' && idx > 0) inputRefs.current[idx - 1]?.focus()
    if (e.key === 'ArrowRight' && idx < 5) inputRefs.current[idx + 1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = ['', '', '', '', '', '']
    pasted.split('').forEach((c, i) => { next[i] = c })
    setOtp(next)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const confirmDeactivation = () => {
    // TODO: replace with actual API call
    setTimeout(() => {
      closeOtp()
      setSuccess(true)
      setToast(true)
      setTimeout(() => setToast(false), 4500)
    }, 1200)
  }

  const isEmail = inputVal.includes('@')
  const otpComplete = otp.every(d => d.length === 1)

  return (
    <>
      <style>{`
        .da-root { font-family: 'DM Sans', sans-serif; background: #0d0606; color: #f7fafc; min-height: 100vh; height: 100vh; overflow: hidden; display: flex; flex-direction: column; }
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        .da-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
        .da-bg::before { content:''; position:absolute; width:600px; height:600px; top:-200px; right:-200px; border-radius:50%; background:radial-gradient(circle,rgba(229,62,62,.12) 0%,transparent 70%); }
        .da-bg::after  { content:''; position:absolute; width:400px; height:400px; bottom:-100px; left:-100px; border-radius:50%; background:radial-gradient(circle,rgba(159,122,234,.08) 0%,transparent 70%); }
        .da-grid { position:relative; z-index:1; display:grid; grid-template-columns:1fr 1fr; height:100vh; }
        .da-left { display:flex; flex-direction:column; justify-content:center; padding:3rem 3.5rem; border-right:1px solid rgba(255,255,255,.09); animation:daRight .6s ease both; }
        .da-right { display:flex; flex-direction:column; justify-content:center; padding:3rem 3.5rem; overflow-y:auto; animation:daLeft .6s .1s ease both; }
        .da-logo { display:flex; align-items:center; gap:.625rem; margin-bottom:2.5rem; }
        .da-logo-mark { width:2.75rem; height:2.75rem; border-radius:.875rem; background:linear-gradient(135deg,#e53e3e,#9f7aea); display:flex; align-items:center; justify-content:center; box-shadow:0 4px 20px rgba(229,62,62,.25); }
        .da-logo-name { font-family:'Sora',sans-serif; font-weight:800; font-size:1.5rem; letter-spacing:-.03em; }
        .da-h1 { font-family:'Sora',sans-serif; font-weight:700; font-size:2.4rem; letter-spacing:-.03em; line-height:1.15; margin-bottom:1rem; }
        .da-sub { color:rgba(255,255,255,.55); font-size:.9rem; line-height:1.65; margin-bottom:1.5rem; max-width:340px; }
        .da-cons { background:rgba(229,62,62,.06); border:1px solid rgba(229,62,62,.15); border-radius:.75rem; padding:1rem 1.25rem; list-style:none; display:flex; flex-direction:column; gap:.6rem; margin-bottom:1rem; }
        .da-cons li { display:flex; align-items:flex-start; gap:.6rem; font-size:.83rem; color:#fc8181; line-height:1.5; }
        .da-cons li::before { content:'✕'; font-weight:700; font-size:.7rem; flex-shrink:0; width:14px; height:14px; background:rgba(229,62,62,.15); border-radius:50%; display:flex; align-items:center; justify-content:center; margin-top:.15rem; }
        .da-badge { display:inline-flex; align-items:center; gap:.5rem; background:rgba(252,129,74,.1); border:1px solid rgba(252,129,74,.25); border-radius:999px; padding:.4rem .9rem; font-size:.78rem; font-weight:600; color:#fbb17a; margin-bottom:1.5rem; }
        .da-card-title { font-family:'Sora',sans-serif; font-weight:700; font-size:2rem; letter-spacing:-.03em; line-height:1.15; margin-bottom:.5rem; }
        .da-card-sub { color:rgba(255,255,255,.55); font-size:.9rem; line-height:1.65; margin-bottom:1.5rem; }
        .da-label { display:block; font-size:.8rem; font-weight:600; letter-spacing:.04em; text-transform:uppercase; color:rgba(255,255,255,.55); margin-bottom:.5rem; }
        .da-input-row { display:flex; gap:.625rem; align-items:stretch; }
        .da-input-wrap { position:relative; flex:1; }
        .da-input-icon { position:absolute; left:1rem; top:50%; transform:translateY(-50%); color:rgba(255,255,255,.3); pointer-events:none; }
        .da-input { width:100%; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.09); border-radius:.75rem; color:#f7fafc; font-size:.95rem; padding:.8rem 1rem .8rem 2.65rem; outline:none; transition:border-color .2s,box-shadow .2s; }
        .da-input:focus { border-color:rgba(229,62,62,.5); box-shadow:0 0 0 3px rgba(229,62,62,.1); background:rgba(255,255,255,.09); }
        .da-input::placeholder { color:rgba(255,255,255,.3); }
        .da-btn-red { flex-shrink:0; background:linear-gradient(135deg,#e53e3e,#c53030); color:white; font-family:'Sora',sans-serif; font-size:.85rem; font-weight:700; padding:0 1.25rem; min-height:48px; border:none; border-radius:.75rem; cursor:pointer; white-space:nowrap; display:flex; align-items:center; gap:.4rem; box-shadow:0 8px 24px rgba(229,62,62,.35); transition:transform .2s,filter .2s; }
        .da-btn-red:hover { transform:translateY(-1px); filter:brightness(1.08); }
        .da-btn-red:disabled { opacity:.5; cursor:not-allowed; transform:none; }
        .da-divider { display:flex; align-items:center; gap:.75rem; margin:1.5rem 0; }
        .da-divider::before,.da-divider::after { content:''; flex:1; height:1px; background:rgba(255,255,255,.09); }
        .da-divider span { font-size:.75rem; color:rgba(255,255,255,.3); }
        .da-btn-ghost { background:transparent; color:rgba(255,255,255,.55); font-size:.875rem; padding:.75rem 1.5rem; border:1px solid rgba(255,255,255,.09); border-radius:.75rem; cursor:pointer; width:100%; transition:background .2s,color .2s; }
        .da-btn-ghost:hover { background:rgba(255,255,255,.07); color:#f7fafc; }
        .da-overlay { position:fixed; inset:0; background:rgba(0,0,0,.75); backdrop-filter:blur(8px); z-index:100; display:flex; align-items:center; justify-content:center; padding:1.25rem; }
        .da-modal { background:#1a0e0e; border:1px solid rgba(229,62,62,.2); border-radius:1.25rem; padding:2.25rem 2rem; width:100%; max-width:400px; box-shadow:0 40px 80px rgba(0,0,0,.7); animation:daModalIn .35s cubic-bezier(.34,1.56,.64,1) both; }
        .da-modal-icon { width:3.5rem; height:3.5rem; border-radius:1rem; background:linear-gradient(135deg,rgba(229,62,62,.15),rgba(159,122,234,.15)); border:1px solid rgba(229,62,62,.2); display:flex; align-items:center; justify-content:center; margin:0 auto 1.25rem; }
        .da-modal-title { font-family:'Sora',sans-serif; font-weight:700; font-size:1.25rem; text-align:center; margin-bottom:.4rem; }
        .da-modal-sub { text-align:center; color:rgba(255,255,255,.55); font-size:.85rem; line-height:1.6; margin-bottom:1.75rem; }
        .da-otp-row { display:flex; gap:.6rem; justify-content:center; margin-bottom:1.5rem; }
        .da-otp-box { width:52px; height:56px; text-align:center; font-family:'Sora',sans-serif; font-size:1.35rem; font-weight:700; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.09); border-radius:.75rem; color:#f7fafc; outline:none; caret-color:#e53e3e; }
        .da-otp-box:focus { border-color:#e53e3e; box-shadow:0 0 0 3px rgba(229,62,62,.15); background:rgba(229,62,62,.07); }
        .da-btn-confirm { width:100%; background:linear-gradient(135deg,#e53e3e,#c53030); color:white; font-family:'Sora',sans-serif; font-size:.9rem; font-weight:700; padding:.85rem 1.5rem; border:none; border-radius:.75rem; cursor:pointer; box-shadow:0 8px 24px rgba(229,62,62,.35); margin-bottom:.75rem; transition:transform .2s,filter .2s; }
        .da-btn-confirm:hover { transform:translateY(-1px); filter:brightness(1.08); }
        .da-btn-confirm:disabled { opacity:.5; cursor:not-allowed; transform:none; }
        .da-resend { text-align:center; font-size:.8rem; color:rgba(255,255,255,.3); margin-bottom:.5rem; }
        .da-resend-btn { background:none; border:none; color:#e53e3e; font-size:.8rem; font-weight:600; cursor:pointer; }
        .da-btn-cancel { width:100%; background:transparent; color:rgba(255,255,255,.55); font-size:.85rem; padding:.65rem; border:1px solid rgba(255,255,255,.09); border-radius:.75rem; cursor:pointer; margin-top:.5rem; }
        .da-toast { position:fixed; bottom:2rem; left:50%; transform:translateX(-50%) translateY(0); background:#1a2e1e; border:1px solid rgba(104,211,145,.3); border-radius:.75rem; padding:.9rem 1.5rem; display:flex; align-items:center; gap:.75rem; box-shadow:0 16px 40px rgba(0,0,0,.5); z-index:200; animation:daToastIn .45s cubic-bezier(.34,1.56,.64,1) both; }
        .da-toast-icon { width:2rem; height:2rem; background:rgba(104,211,145,.15); border-radius:50%; display:flex; align-items:center; justify-content:center; }
        .da-success { text-align:center; padding:1rem 0; }
        .da-success-ring { width:5rem; height:5rem; border-radius:50%; background:linear-gradient(135deg,rgba(104,211,145,.15),rgba(72,187,120,.08)); border:1.5px solid rgba(104,211,145,.3); display:flex; align-items:center; justify-content:center; margin:0 auto 1.25rem; animation:daRingPop .5s cubic-bezier(.34,1.56,.64,1) both; }
        .da-success-title { font-family:'Sora',sans-serif; font-weight:700; font-size:1.35rem; color:#68d391; margin-bottom:.5rem; }
        .da-success-sub { color:rgba(255,255,255,.55); font-size:.875rem; line-height:1.65; }
        .da-footer { position:fixed; bottom:0; left:0; right:0; z-index:2; text-align:center; padding:.9rem; color:rgba(255,255,255,.3); font-size:.75rem; border-top:1px solid rgba(255,255,255,.09); background:rgba(13,6,6,.85); backdrop-filter:blur(8px); }
        .da-footer a { color:rgba(255,255,255,.3); text-decoration:underline; }
        @keyframes daRight { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes daLeft  { from{opacity:0;transform:translateX(24px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes daModalIn { from{transform:scale(.92) translateY(20px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
        @keyframes daToastIn { from{transform:translateX(-50%) translateY(80px);opacity:0} to{transform:translateX(-50%) translateY(0);opacity:1} }
        @keyframes daRingPop { from{transform:scale(.5);opacity:0} to{transform:scale(1);opacity:1} }
        @media(max-width:768px){
          .da-root{height:auto;overflow:auto;}
          .da-grid{grid-template-columns:1fr;height:auto;}
          .da-left{display:none;}
          .da-right{padding:2rem 1.5rem 5rem;}
          .da-input-row{flex-direction:column;}
          .da-btn-red{width:100%;justify-content:center;}
          .da-otp-box{width:44px;height:50px;font-size:1.2rem;}
          .da-otp-row{gap:.45rem;}
        }
      `}</style>

      <div className="da-root">
        <div className="da-bg" />

        <div className="da-grid">
          {/* LEFT */}
          <div className="da-left">
            <div className="da-logo">
              <div className="da-logo-mark">
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
                </svg>
              </div>
              <span className="da-logo-name">Talky</span>
            </div>
            <h1 className="da-h1">Deactivate<br />Your Account</h1>
            <p className="da-sub">We're sad to see you go. Deactivating your Talky account will permanently remove all your data.</p>
            <ul className="da-cons">
              <li>Your profile and call history will be permanently deleted</li>
              <li>Your wallet balance will be forfeited and non-refundable</li>
              <li>You will lose access to all earned rewards and benefits</li>
              <li>This action cannot be undone — once confirmed, data is gone</li>
            </ul>
            <p style={{fontSize:'.78rem',color:'rgba(255,255,255,.3)',marginTop:'.5rem'}}>
              Need help? <a href="mailto:hello@talky.app" style={{color:'#e53e3e',textDecoration:'none'}}>hello@talky.app</a>
            </p>
          </div>

          {/* RIGHT */}
          <div className="da-right">
            <div style={{maxWidth:'440px'}}>
              <div className="da-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#fbb17a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Irreversible Action
              </div>

              {!success ? (
                <>
                  <h2 className="da-card-title">Confirm your<br />identity</h2>
                  <p className="da-card-sub">Enter the phone number or email associated with your Talky account to proceed.</p>
                  <div style={{marginBottom:'1.25rem'}}>
                    <label className="da-label">Phone Number or Email</label>
                    <div className="da-input-row">
                      <div className="da-input-wrap">
                        <svg className="da-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                          {isEmail
                            ? <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/><polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/></>
                            : <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.2 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          }
                        </svg>
                        <input className="da-input" type="text" value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder="e.g. +91 9876543210 or email@example.com" autoComplete="off" />
                      </div>
                      <button className="da-btn-red" onClick={openOtp} disabled={inputVal.trim().length < 5}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
                        Deactivate
                      </button>
                    </div>
                  </div>
                  <div className="da-divider"><span>need help instead?</span></div>
                  <button className="da-btn-ghost" onClick={() => window.location.href='mailto:hello@talky.app'}>
                    Contact Support · hello@talky.app
                  </button>
                </>
              ) : (
                <div className="da-success">
                  <div className="da-success-ring">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#68d391" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <h2 className="da-success-title">Account Deactivated</h2>
                  <p className="da-success-sub">Your Talky account has been successfully deactivated.<br/>All your data has been scheduled for permanent deletion.<br/><br/><span style={{fontSize:'.8rem',color:'rgba(255,255,255,.3)'}}>We're sorry to see you go. You're always welcome back.</span></p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="da-footer">
          © 2026 Talky · Made with ❤️ in Kerala &nbsp;·&nbsp;
          <a href="/privacy.html">Privacy Policy</a> &nbsp;·&nbsp;
          <a href="mailto:hello@talky.app">Support</a>
        </div>

        {/* OTP MODAL */}
        {otpOpen && (
          <div className="da-overlay" onClick={e => { if (e.target === e.currentTarget) closeOtp() }}>
            <div className="da-modal">
              <div className="da-modal-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="#e53e3e" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h2 className="da-modal-title">Confirm Deactivation</h2>
              <p className="da-modal-sub">We sent a 6-digit OTP to<br/><strong style={{color:'#f7fafc'}}>{inputVal}</strong><br/>Enter it below to confirm.</p>
              <div className="da-otp-row" onPaste={handlePaste}>
                {otp.map((d, i) => (
                  <input key={i} ref={el => { inputRefs.current[i] = el }} className="da-otp-box" type="text" maxLength={1} inputMode="numeric" value={d}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => handleOtpKey(e, i)} />
                ))}
              </div>
              <button className="da-btn-confirm" onClick={confirmDeactivation} disabled={!otpComplete}>
                Confirm &amp; Deactivate Account
              </button>
              <div className="da-resend">
                {!canResend
                  ? <span>Resend OTP in {timer}s</span>
                  : <button className="da-resend-btn" onClick={() => { setOtp(['','','','','','']); startTimer(); inputRefs.current[0]?.focus() }}>Resend OTP</button>
                }
              </div>
              <button className="da-btn-cancel" onClick={closeOtp}>Cancel</button>
            </div>
          </div>
        )}

        {/* TOAST */}
        {toast && (
          <div className="da-toast">
            <div className="da-toast-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#68d391" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <strong style={{display:'block',color:'#68d391',fontSize:'.9rem'}}>Account Deactivated Successfully</strong>
              <span style={{fontSize:'.78rem',color:'rgba(104,211,145,.65)'}}>Your data will be permanently removed.</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}