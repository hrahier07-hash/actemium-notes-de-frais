'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type Mode = 'login' | 'register'

export default function LoginPage() {
  const supabase = createClientComponentClient()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [mounted, setMounted] = useState(false)
  const [showPass, setShowPass] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  function resetForm() {
    setError('')
    setSuccess('')
    setPassword('')
    setConfirmPassword('')
  }

  function switchMode(m: Mode) {
    setMode(m)
    resetForm()
  }

  async function handleSubmit() {
    setError('')
    setSuccess('')

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.')
      return
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas.')
        return
      }
      if (password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères.')
        return
      }
    }

    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Email ou mot de passe incorrect.')
      } else {
        window.location.href = '/'
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/` }
      })
      if (error) {
        setError(error.message === 'User already registered'
          ? 'Un compte existe déjà avec cet email.'
          : error.message)
      } else {
        setSuccess('Compte créé ! Vérifiez votre email pour confirmer votre inscription.')
      }
    }

    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', sans-serif;
          background: #F5F9FF;
          position: relative;
          overflow: hidden;
        }

        /* ── Animated background blobs ── */
        .auth-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0;
          pointer-events: none;
          animation: blobAppear 1.2s ease forwards;
        }
        .auth-blob-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(50,130,222,0.18) 0%, transparent 70%);
          top: -120px; left: -100px;
          animation-delay: 0s;
        }
        .auth-blob-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(154,192,12,0.12) 0%, transparent 70%);
          bottom: -80px; right: -80px;
          animation-delay: 0.2s;
        }
        .auth-blob-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(50,130,222,0.1) 0%, transparent 70%);
          top: 50%; right: 10%;
          animation-delay: 0.4s;
        }
        @keyframes blobAppear {
          to { opacity: 1; }
        }

        /* ── Grid pattern ── */
        .auth-grid {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(50,130,222,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(50,130,222,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* ── Left panel ── */
        .auth-left {
          display: none;
          flex: 1;
          flex-direction: column;
          justify-content: center;
          padding: 60px;
          position: relative;
          z-index: 1;
        }
        @media (min-width: 1024px) {
          .auth-left { display: flex; }
        }

        .auth-left-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 60px;
          opacity: 0;
          animation: slideUp 0.6s ease 0.3s forwards;
        }
        .auth-left-badge {
          background: linear-gradient(135deg, #3282DE, #1a5fb8);
          color: white;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 4px 10px;
          border-radius: 20px;
          text-transform: uppercase;
        }

        .auth-left-headline {
          opacity: 0;
          animation: slideUp 0.6s ease 0.5s forwards;
        }
        .auth-left-headline h1 {
          font-size: 42px;
          font-weight: 800;
          line-height: 1.15;
          color: #0c1524;
          letter-spacing: -0.03em;
          margin-bottom: 16px;
        }
        .auth-left-headline h1 span {
          background: linear-gradient(135deg, #3282DE 0%, #9AC00C 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .auth-left-headline p {
          font-size: 16px;
          color: #4a5568;
          line-height: 1.6;
          max-width: 380px;
        }

        .auth-features {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 48px;
          opacity: 0;
          animation: slideUp 0.6s ease 0.7s forwards;
        }
        .auth-feature {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(226,232,240,0.8);
          border-radius: 12px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .auth-feature:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 20px rgba(50,130,222,0.1);
        }
        .auth-feature-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }
        .auth-feature-text strong {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #0c1524;
        }
        .auth-feature-text span {
          font-size: 12px;
          color: #4a5568;
        }

        /* ── Right panel ── */
        .auth-right {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          z-index: 1;
        }
        @media (min-width: 1024px) {
          .auth-right {
            width: 480px;
            flex-shrink: 0;
            border-left: 1px solid rgba(226,232,240,0.6);
            background: rgba(255,255,255,0.85);
            backdrop-filter: blur(20px);
          }
        }

        /* ── Card ── */
        .auth-card {
          width: 100%;
          max-width: 400px;
          opacity: 0;
          animation: cardIn 0.5s ease 0.2s forwards;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .auth-card-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 32px;
        }
        .auth-card-logo-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #9AC00C;
        }
        .auth-card-logo-text {
          font-size: 13px;
          font-weight: 700;
          color: #0c1524;
          letter-spacing: -0.01em;
        }
        .auth-card-logo-divider {
          width: 1px; height: 14px;
          background: #e2e8f0;
          margin: 0 4px;
        }
        .auth-card-logo-sub {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
        }

        /* ── Tab switcher ── */
        .auth-tabs {
          display: flex;
          background: #f1f5f9;
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 28px;
          position: relative;
        }
        .auth-tab {
          flex: 1;
          padding: 9px;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 600;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.2s ease;
          font-family: inherit;
          position: relative;
          z-index: 1;
        }
        .auth-tab.active {
          color: #0c1524;
        }
        .auth-tab-slider {
          position: absolute;
          top: 4px; bottom: 4px;
          width: calc(50% - 4px);
          background: white;
          border-radius: 7px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          left: 4px;
        }
        .auth-tab-slider.register {
          transform: translateX(calc(100% + 0px));
        }

        /* ── Form heading ── */
        .auth-heading {
          margin-bottom: 24px;
        }
        .auth-heading h2 {
          font-size: 22px;
          font-weight: 800;
          color: #0c1524;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }
        .auth-heading p {
          font-size: 13px;
          color: #4a5568;
        }

        /* ── Fields ── */
        .auth-field {
          margin-bottom: 16px;
        }
        .auth-field label {
          display: block;
          font-size: 12.5px;
          font-weight: 600;
          color: #0c1524;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }
        .auth-input-wrap {
          position: relative;
        }
        .auth-input-icon {
          position: absolute;
          left: 12px; top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 15px;
          pointer-events: none;
          line-height: 1;
        }
        .auth-input {
          width: 100%;
          padding: 11px 12px 11px 38px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          color: #0c1524;
          background: white;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          outline: none;
          -webkit-appearance: none;
        }
        .auth-input::placeholder { color: #94a3b8; }
        .auth-input:focus {
          border-color: #3282DE;
          box-shadow: 0 0 0 3px rgba(50,130,222,0.12);
        }
        .auth-input:hover:not(:focus) {
          border-color: #d1dae6;
        }
        .auth-input-toggle {
          position: absolute;
          right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          font-size: 16px;
          padding: 0;
          line-height: 1;
          transition: color 0.15s ease;
        }
        .auth-input-toggle:hover { color: #4a5568; }

        /* ── Error / success ── */
        .auth-alert {
          padding: 11px 14px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 16px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          animation: alertIn 0.2s ease;
        }
        @keyframes alertIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .auth-alert.error {
          background: #fff5f5;
          border: 1px solid #fed7d7;
          color: #c53030;
        }
        .auth-alert.success {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
        }

        /* ── Submit button ── */
        .auth-btn {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #3282DE 0%, #2670c7 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 14.5px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          letter-spacing: -0.01em;
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
          box-shadow: 0 4px 14px rgba(50,130,222,0.3);
          position: relative;
          overflow: hidden;
          margin-top: 4px;
        }
        .auth-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .auth-btn:hover:not(:disabled)::after { opacity: 1; }
        .auth-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(50,130,222,0.35);
        }
        .auth-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(50,130,222,0.2);
        }
        .auth-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        /* ── Spinner ── */
        .auth-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Divider ── */
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
          color: #94a3b8;
          font-size: 12px;
        }
        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        /* ── Footer ── */
        .auth-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.6;
        }
        .auth-footer a {
          color: #3282DE;
          text-decoration: none;
          font-weight: 500;
        }
        .auth-footer a:hover { text-decoration: underline; }

        /* ── Slide animations ── */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Field animation on mode switch ── */
        .auth-field-extra {
          overflow: hidden;
          transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.3s ease,
                      margin-bottom 0.3s ease;
        }
        .auth-field-extra.hidden {
          max-height: 0;
          opacity: 0;
          margin-bottom: 0;
        }
        .auth-field-extra.visible {
          max-height: 100px;
          opacity: 1;
          margin-bottom: 16px;
        }

        /* Actemium stripe accent */
        .auth-stripe {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #3282DE 0%, #9AC00C 50%, #3282DE 100%);
          background-size: 200% 100%;
          animation: stripe 3s linear infinite;
        }
        @keyframes stripe {
          from { background-position: 0% 0%; }
          to   { background-position: 200% 0%; }
        }
      `}</style>

      <div className="auth-root">
        {/* Background */}
        <div className="auth-grid" />
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
        <div className="auth-blob auth-blob-3" />
        <div className="auth-stripe" />

        {/* Left panel */}
        <div className="auth-left">
          <div className="auth-left-logo">
            <span style={{ fontWeight: 800, fontSize: 18, color: '#0c1524', letterSpacing: '-0.02em' }}>Actemium</span>
            <span className="auth-left-badge">Vinci Energies</span>
          </div>

          <div className="auth-left-headline">
            <h1>Notes de frais<br /><span>repas</span></h1>
            <p>Gérez les remboursements repas de vos équipes simplement, avec traçabilité et export mensuel.</p>
          </div>

          <div className="auth-features">
            {[
              { icon: '🍽️', bg: 'rgba(50,130,222,0.1)', title: 'Saisie rapide', sub: 'Enregistrez les repas en quelques clics' },
              { icon: '📊', bg: 'rgba(154,192,12,0.12)', title: 'Synthèse mensuelle', sub: 'Vue consolidée par mois et par salarié' },
              { icon: '📤', bg: 'rgba(50,130,222,0.08)', title: 'Export Excel', sub: 'Fichiers prêts pour la comptabilité' },
            ].map((f, i) => (
              <div key={i} className="auth-feature">
                <div className="auth-feature-icon" style={{ background: f.bg }}>
                  {f.icon}
                </div>
                <div className="auth-feature-text">
                  <strong>{f.title}</strong>
                  <span>{f.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="auth-right">
          <div className="auth-card">
            {/* Logo mobile */}
            <div className="auth-card-logo">
              <div className="auth-card-logo-dot" />
              <span className="auth-card-logo-text">Actemium</span>
              <div className="auth-card-logo-divider" />
              <span className="auth-card-logo-sub">Notes de frais</span>
            </div>

            {/* Tabs */}
            <div className="auth-tabs">
              <div className={`auth-tab-slider ${mode === 'register' ? 'register' : ''}`} />
              <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => switchMode('login')}>
                Se connecter
              </button>
              <button className={`auth-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => switchMode('register')}>
                Créer un compte
              </button>
            </div>

            {/* Heading */}
            <div className="auth-heading">
              <h2>{mode === 'login' ? 'Bon retour 👋' : 'Créer votre accès'}</h2>
              <p>{mode === 'login' ? 'Connectez-vous pour accéder à l\'application.' : 'Remplissez les champs pour créer votre compte.'}</p>
            </div>

            {/* Alerts */}
            {error && (
              <div className="auth-alert error">
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="auth-alert success">
                <span>✓</span>
                <span>{success}</span>
              </div>
            )}

            {/* Email */}
            <div className="auth-field">
              <label>Email professionnel</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉</span>
                <input
                  className="auth-input"
                  type="email"
                  placeholder="prenom.nom@actemium.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field">
              <label>Mot de passe</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  className="auth-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder={mode === 'register' ? 'Minimum 6 caractères' : '••••••••'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  style={{ paddingRight: 42 }}
                />
                <button className="auth-input-toggle" type="button" onClick={() => setShowPass(s => !s)}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Confirm password — only register */}
            <div className={`auth-field-extra ${mode === 'register' ? 'visible' : 'hidden'}`}>
              <div className="auth-field" style={{ marginBottom: 0 }}>
                <label>Confirmer le mot de passe</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔒</span>
                  <input
                    className="auth-input"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Répétez le mot de passe"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button className="auth-btn" onClick={handleSubmit} disabled={loading || !!success}>
              <div className="auth-btn-inner">
                {loading ? (
                  <><div className="auth-spinner" /> {mode === 'login' ? 'Connexion...' : 'Création...'}</>
                ) : (
                  mode === 'login' ? 'Se connecter →' : 'Créer mon compte →'
                )}
              </div>
            </button>

            {/* Footer */}
            <div className="auth-footer">
              {mode === 'login' ? (
                <p>Pas encore de compte ?{' '}
                  <a href="#" onClick={e => { e.preventDefault(); switchMode('register') }}>Créer un accès</a>
                </p>
              ) : (
                <p>Déjà un compte ?{' '}
                  <a href="#" onClick={e => { e.preventDefault(); switchMode('login') }}>Se connecter</a>
                </p>
              )}
              <p style={{ marginTop: 12 }}>
                Accès réservé aux collaborateurs Actemium.<br />
                <a href="mailto:dsi@actemium.com">Contacter le support</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
