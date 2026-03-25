'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function PendingPage() {
  const supabase = createClientComponentClient()
  const [email, setEmail] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setEmail(data.user.email || '')
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #F5F9FF; }

        .pending-root {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          padding: 24px; position: relative; overflow: hidden;
        }
        .pending-blob-1 {
          position: fixed; width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(50,130,222,0.12) 0%, transparent 70%);
          top: -100px; left: -100px; pointer-events: none;
        }
        .pending-blob-2 {
          position: fixed; width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(154,192,12,0.1) 0%, transparent 70%);
          bottom: -80px; right: -80px; pointer-events: none;
        }
        .pending-grid {
          position: fixed; inset: 0;
          background-image: linear-gradient(rgba(50,130,222,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(50,130,222,0.04) 1px, transparent 1px);
          background-size: 40px 40px; pointer-events: none;
        }
        .pending-card {
          background: white; border-radius: 20px; padding: 48px 40px;
          max-width: 460px; width: 100%; text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04);
          position: relative; z-index: 1;
          animation: cardIn 0.5s ease forwards;
        }
        @keyframes cardIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .pending-icon {
          width: 72px; height: 72px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(50,130,222,0.12), rgba(154,192,12,0.12));
          display: flex; align-items: center; justify-content: center;
          font-size: 32px; margin: 0 auto 24px;
          animation: pulse 2s ease infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(50,130,222,0.2); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 12px rgba(50,130,222,0); }
        }
        .pending-logo { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 32px; }
        .pending-logo-dot { width: 8px; height: 8px; border-radius: 50%; background: #9AC00C; }
        .pending-logo-text { font-size: 13px; font-weight: 700; color: #0c1524; }
        .pending-logo-div { width: 1px; height: 14px; background: #e2e8f0; margin: 0 4px; }
        .pending-logo-sub { font-size: 12px; color: #94a3b8; font-weight: 500; }

        h2 { font-size: 22px; font-weight: 800; color: #0c1524; letter-spacing: -0.02em; margin-bottom: 12px; }
        .pending-desc { font-size: 14px; color: #4a5568; line-height: 1.7; margin-bottom: 24px; }
        .pending-email {
          display: inline-block; background: #f1f5f9; border: 1px solid #e2e8f0;
          border-radius: 8px; padding: 8px 16px; font-size: 13px;
          color: #3282DE; font-weight: 600; margin-bottom: 28px;
        }
        .pending-steps {
          display: flex; flex-direction: column; gap: 12px;
          background: #f8fafc; border-radius: 12px; padding: 20px;
          margin-bottom: 28px; text-align: left;
        }
        .pending-step { display: flex; align-items: flex-start; gap: 12px; }
        .pending-step-num {
          width: 22px; height: 22px; border-radius: 50%; background: #3282DE;
          color: white; font-size: 11px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px;
        }
        .pending-step-text { font-size: 13px; color: #4a5568; line-height: 1.5; }
        .pending-step-text strong { color: #0c1524; display: block; font-weight: 600; }

        .pending-btn {
          width: 100%; padding: 12px; background: transparent;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          font-size: 13px; font-weight: 600; color: #94a3b8;
          cursor: pointer; font-family: inherit; transition: all .15s ease;
        }
        .pending-btn:hover { border-color: #fed7d7; color: #e53e3e; background: #fff5f5; }

        .pending-stripe {
          position: fixed; bottom: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #3282DE 0%, #9AC00C 50%, #3282DE 100%);
          background-size: 200% 100%; animation: stripe 3s linear infinite;
        }
        @keyframes stripe { from{background-position:0%} to{background-position:200%} }
      `}</style>

      <div className="pending-root">
        <div className="pending-grid" />
        <div className="pending-blob-1" />
        <div className="pending-blob-2" />
        <div className="pending-stripe" />

        <div className="pending-card">
          <div className="pending-logo">
            <div className="pending-logo-dot" />
            <span className="pending-logo-text">Actemium</span>
            <div className="pending-logo-div" />
            <span className="pending-logo-sub">Notes de frais</span>
          </div>

          <div className="pending-icon">⏳</div>

          <h2>Demande en attente</h2>
          <p className="pending-desc">
            Votre compte a été créé avec succès. Votre accès doit être validé par l'administrateur avant de pouvoir utiliser l'application.
          </p>

          {email && <div className="pending-email">{email}</div>}

          <div className="pending-steps">
            <div className="pending-step">
              <div className="pending-step-num">1</div>
              <div className="pending-step-text">
                <strong>Compte créé ✓</strong>
                Votre inscription a bien été enregistrée.
              </div>
            </div>
            <div className="pending-step">
              <div className="pending-step-num">2</div>
              <div className="pending-step-text">
                <strong>Validation en cours…</strong>
                L'administrateur va valider votre accès prochainement.
              </div>
            </div>
            <div className="pending-step">
              <div className="pending-step-num">3</div>
              <div className="pending-step-text">
                <strong>Accès activé</strong>
                Vous pourrez vous connecter dès validation.
              </div>
            </div>
          </div>

          <button className="pending-btn" onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>
      </div>
    </>
  )
}
