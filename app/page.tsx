'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { supabase, type Employee, type Meal } from '@/lib/supabase'

const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const LOGO_SRC = "data:image/jpeg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9k="

function formatDate(d: string) {
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

function genCommentaire(type: 'paye' | 'invite', date: string, inviterName?: string) {
  const label = formatDate(date)
  if (type === 'paye') return `Repas du ${label}`
  if (inviterName) return `Invité par ${inviterName} le ${label}`
  return `Repas en tant qu'invité le ${label}`
}

const PRESET_COLORS = [
  '#0f172a','#00336B','#9AC00C','#059669','#3b82f6',
  '#8b5cf6','#f59e0b','#ef4444','#ec4899','#64748b',
  '#ffffff','#f1f5f9','#fef3c7','#dcfce7',
]

function ColorPicker({ value, onChange, label }: { value: string; onChange: (c: string) => void; label: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <label style={S.label}>{label}</label>
      <button type="button" onClick={() => setOpen(o => !o)} style={S.colorTrigger}>
        <span style={{ width: 18, height: 18, borderRadius: 4, background: value, border: '1px solid var(--border2)', flexShrink: 0, display: 'inline-block' }} />
        <span style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'monospace' }}>{value}</span>
        <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 8L1 3h10z" fill="#6b7280"/>
        </svg>
      </button>
      {open && (
        <div style={S.colorPanel} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {PRESET_COLORS.map(c => (
              <button key={c} type="button" onClick={() => { onChange(c); setOpen(false) }} style={{
                width: 26, height: 26, borderRadius: 5, background: c, cursor: 'pointer', flexShrink: 0,
                border: c === value ? '2px solid var(--primary)' : '1px solid var(--border2)',
                boxShadow: c === value ? '0 0 0 2px var(--primary-light)' : 'none'
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="color" value={value} onChange={e => onChange(e.target.value)}
              style={{ width: 34, height: 34, border: 'none', background: 'none', cursor: 'pointer', padding: 0, borderRadius: 6 }} />
            <input value={value} onChange={e => onChange(e.target.value)} style={{ ...S.input, flex: 1, fontSize: 12, fontFamily: 'monospace' }} placeholder="#000000" />
          </div>
        </div>
      )}
    </div>
  )
}

function SearchInput({ value, onChange, placeholder, inputStyle }: { value: string; onChange: (v: string) => void; placeholder?: string; inputStyle?: React.CSSProperties }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', fontSize: 14, pointerEvents: 'none', opacity: 1, fontWeight: 600 }}>⌕</span>
      <input
        style={{ ...S.input, paddingLeft: 30, ...inputStyle }}
        placeholder={placeholder || 'Rechercher un salarié…'}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

type Tab = 'saisie' | 'mensuel' | 'salaries' | 'export'

const IMPUTATIONS = [
  { label: 'Vélizy',     color: '#a8e6a3' },
  { label: 'Chanteloup', color: '#a3d4f5' },
  { label: 'Verneuil',   color: '#fde89a' },
  { label: 'Cantine',    color: '#f5b8c8' },
] as const

function getImputation(color: string | null | undefined) {
  return IMPUTATIONS.find(i => i.color === color) || IMPUTATIONS[0]
}

export default function Home() {
  const [tab, setTab] = useState<Tab>('saisie')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const nowYM = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` }
  const [mForm, setMForm] = useState({
    employeeId: '', date: new Date().toISOString().slice(0, 10),
    targetMonth: nowYM(),
    type: 'paye' as 'paye' | 'invite', invites: [] as string[],
    commentaire: '', commentaireColor: '#0f172a', countColor: '#a8e6a3',
    empSearch: '', inviteSearch: ''
  })
  const [editMeal, setEditMeal] = useState<Meal | null>(null)
  const [eForm, setEForm] = useState({ nom: '', prenom: '' })
  const [editEmp, setEditEmp] = useState<Employee | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' }>({ msg: '', type: 'ok' })
  const [monthSearch, setMonthSearch] = useState('')
  const [empSearch, setEmpSearch] = useState('')
  const [summarySort, setSummarySort] = useState<{ key: 'nom' | 'paye' | 'invite' | 'total'; dir: 'asc' | 'desc' }>({ key: 'nom', dir: 'asc' })
  const [confirmDelEmp, setConfirmDelEmp] = useState<Employee | null>(null)
  const [confirmDelMeal, setConfirmDelMeal] = useState<Meal | null>(null)
  const nowD = new Date()
  const [exportMonth, setExportMonth] = useState(nowD.getMonth())
  const [exportYear, setExportYear] = useState(nowD.getFullYear())

  function showToast(msg: string, type: 'ok' | 'err' = 'ok') {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: 'ok' }), 2800)
  }

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [{ data: emps }, { data: ms }] = await Promise.all([
      supabase.from('employees').select('*').eq('actif', true).order('nom'),
      supabase.from('meals').select('*').order('date', { ascending: false })
    ])
    if (emps) setEmployees(emps)
    if (ms) setMeals(ms)
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const empById = useMemo(() => Object.fromEntries(employees.map(e => [e.id, e])), [employees])
  function getEmpName(id: string | null) {
    if (!id) return '—'
    const e = empById[id]
    return e ? `${e.prenom} ${e.nom}` : '—'
  }

  const filteredEmpForForm = useMemo(() =>
    employees.filter(e =>
      (e.prenom + ' ' + e.nom).toLowerCase().includes(mForm.empSearch.toLowerCase())
    ), [employees, mForm.empSearch])

  const filteredEmpForMonth = useMemo(() =>
    employees.filter(e =>
      (e.prenom + ' ' + e.nom).toLowerCase().includes(monthSearch.toLowerCase())
    ), [employees, monthSearch])

  const filteredEmpForAdmin = useMemo(() =>
    employees.filter(e =>
      (e.prenom + ' ' + e.nom).toLowerCase().includes(empSearch.toLowerCase())
    ), [employees, empSearch])

  async function addMeal() {
    if (!mForm.employeeId || !mForm.date) return
    const emp = empById[mForm.employeeId]
    const inserts: (Partial<Meal> & { target_month?: string })[] = []
    if (mForm.type === 'paye') {
      const tm = mForm.targetMonth + '-01'; inserts.push({ employee_id: mForm.employeeId, date: mForm.date, type: 'paye', invited_by: null, commentaire: mForm.commentaire || genCommentaire('paye', mForm.date), commentaire_color: mForm.commentaireColor, count_color: mForm.countColor, target_month: tm })
      for (const invId of mForm.invites) {
        inserts.push({ employee_id: invId, date: mForm.date, type: 'invite', invited_by: mForm.employeeId, commentaire: genCommentaire('invite', mForm.date, `${emp.prenom} ${emp.nom}`), commentaire_color: mForm.commentaireColor, count_color: mForm.countColor, target_month: tm })
      }
    } else {
      const tm2 = mForm.targetMonth + '-01'; inserts.push({ employee_id: mForm.employeeId, date: mForm.date, type: 'invite', invited_by: null, commentaire: mForm.commentaire || genCommentaire('invite', mForm.date), commentaire_color: mForm.commentaireColor, count_color: mForm.countColor, target_month: tm2 })
    }
    const { error } = await supabase.from('meals').insert(inserts)
    if (error) { showToast('Erreur lors de l\'enregistrement', 'err'); return }
    setMForm(f => ({ ...f, employeeId: '', invites: [], commentaire: '', empSearch: '', inviteSearch: '', targetMonth: nowYM() }))
    showToast(`${inserts.length} repas enregistré${inserts.length > 1 ? 's' : ''} ✓`)
    fetchAll()
  }

  async function deleteMeal(id: string) {
    await supabase.from('meals').delete().eq('id', id)
    setMeals(prev => prev.filter(m => m.id !== id))
    showToast('Repas supprimé')
  }

  async function saveEditMeal() {
    if (!editMeal) return
    await supabase.from('meals').update({ date: editMeal.date, commentaire: editMeal.commentaire, commentaire_color: editMeal.commentaire_color, count_color: editMeal.count_color }).eq('id', editMeal.id)
    setEditMeal(null); showToast('Repas modifié ✓'); fetchAll()
  }

  async function saveEmployee() {
    if (!eForm.nom || !eForm.prenom) return
    if (editEmp) { await supabase.from('employees').update(eForm).eq('id', editEmp.id); showToast('Salarié modifié ✓') }
    else { await supabase.from('employees').insert({ ...eForm, actif: true }); showToast('Salarié ajouté ✓') }
    setEForm({ nom: '', prenom: '' }); setEditEmp(null); fetchAll()
  }

  async function deleteEmployee(id: string) {
    await supabase.from('employees').delete().eq('id', id)
    setConfirmDelEmp(null); showToast('Salarié supprimé'); fetchAll()
  }

  function toggleInvite(id: string) {
    setMForm(f => ({ ...f, invites: f.invites.includes(id) ? f.invites.filter(i => i !== id) : [...f.invites, id] }))
  }

  const monthMeals = useMemo(() => meals.filter(m => {
    const tm = m.target_month ? m.target_month.slice(0, 7) : m.date.slice(0, 7)
    const [y, mo] = tm.split('-').map(Number)
    return mo - 1 === currentMonth && y === currentYear
  }), [meals, currentMonth, currentYear])

  const summary = useMemo(() => employees.reduce((acc, e) => {
    const em = monthMeals.filter(m => m.employee_id === e.id)
    acc[e.id] = { paye: em.filter(m => m.type === 'paye').length, invite: em.filter(m => m.type === 'invite').length }
    return acc
  }, {} as Record<string, { paye: number; invite: number }>), [employees, monthMeals])

  return (
    <div className="acm-shell">
      {toast.msg && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, background: toast.type === 'ok' ? 'var(--primary)' : 'var(--red)', color: '#fff', padding: '11px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: '0 4px 20px rgba(0,0,0,.15)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{toast.type === 'ok' ? '✓' : '✕'}</span> {toast.msg}
        </div>
      )}

      {editMeal && (
        <div style={S.overlay} onClick={() => setEditMeal(null)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <span style={S.modalTitle}>Modifier le repas</span>
              <button style={S.closeBtn} onClick={() => setEditMeal(null)}>✕</button>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              <div><label style={S.label}>Salarié</label><div style={{ fontWeight: 500, color: 'var(--primary)' }}>{getEmpName(editMeal.employee_id)}</div></div>
              <div><label style={S.label}>Date</label><input type="date" style={S.input} value={editMeal.date} onChange={e => setEditMeal(m => m ? { ...m, date: e.target.value } : m)} /></div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <label style={S.label}>Type</label>
                <span style={editMeal.type === 'paye' ? S.badgePaye : S.badgeInvite}>{editMeal.type === 'paye' ? 'Payé' : 'Invité'}</span>
              </div>
              {editMeal.invited_by && <div><label style={S.label}>Invité par</label><div style={{ color: 'var(--text2)' }}>{getEmpName(editMeal.invited_by)}</div></div>}
              <div><label style={S.label}>Commentaire</label><input style={S.input} value={editMeal.commentaire || ''} onChange={e => setEditMeal(m => m ? { ...m, commentaire: e.target.value } : m)} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <ColorPicker label="Couleur commentaire" value={editMeal.commentaire_color || '#0f172a'} onChange={c => setEditMeal(m => m ? { ...m, commentaire_color: c } : m)} />
                <div>
                        <label style={S.label}>Imputation</label>
                        <div style={{ position: 'relative' }}>
                          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, borderRadius: 4, background: editMeal.count_color || '#a8e6a3', border: '1px solid rgba(0,0,0,.12)', pointerEvents: 'none', zIndex: 1 }} />
                          <select style={{ ...S.input, paddingLeft: 32 }} value={editMeal.count_color || '#a8e6a3'} onChange={e => setEditMeal(m => m ? { ...m, count_color: e.target.value } : m)}>
                            {IMPUTATIONS.map(imp => <option key={imp.label} value={imp.color}>{imp.label}</option>)}
                          </select>
                        </div>
                      </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
                <button style={S.btnGhost} onClick={() => setEditMeal(null)}>Annuler</button>
                <button className="acm-btn-primary" style={S.btnPrimary} onClick={saveEditMeal}>Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDelEmp && (
        <div style={S.overlay} onClick={() => setConfirmDelEmp(null)}>
          <div style={{ ...S.modal, maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <span style={S.modalTitle}>Supprimer le salarié ?</span>
              <button style={S.closeBtn} onClick={() => setConfirmDelEmp(null)}>✕</button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8 }}>
              Vous êtes sur le point de supprimer <strong>{confirmDelEmp.prenom} {confirmDelEmp.nom}</strong>.
            </p>
            <p style={{ fontSize: 13, color: 'var(--red)', background: 'var(--red-light)', borderRadius: 6, padding: '8px 12px', marginBottom: 20 }}>
              ⚠ Tous les repas associés à ce salarié seront également supprimés. Cette action est irréversible.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button style={S.btnGhost} onClick={() => setConfirmDelEmp(null)}>Annuler</button>
              <button style={S.btnDanger} onClick={() => deleteEmployee(confirmDelEmp.id)}>Confirmer la suppression</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelMeal && (
        <div style={S.overlay} onClick={() => setConfirmDelMeal(null)}>
          <div style={{ ...S.modal, maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <span style={S.modalTitle}>Supprimer ce repas ?</span>
              <button style={S.closeBtn} onClick={() => setConfirmDelMeal(null)}>✕</button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10, lineHeight: 1.6 }}>
              Vous êtes sur le point de supprimer le repas de{' '}
              <strong>{getEmpName(confirmDelMeal.employee_id)}</strong> du{' '}
              <strong>{formatDate(confirmDelMeal.date)}</strong>.
            </p>
            <p style={{ fontSize: 13, color: 'var(--red)', background: 'var(--red-light)', borderRadius: 8, padding: '9px 13px', marginBottom: 20, border: '1px solid #fecaca' }}>
              ⚠ Cette action est irréversible.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="acm-btn-ghost" style={S.btnGhost} onClick={() => setConfirmDelMeal(null)}>Annuler</button>
              <button className="acm-btn-danger" style={S.btnDanger} onClick={() => { deleteMeal(confirmDelMeal.id); setConfirmDelMeal(null) }}>Confirmer la suppression</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside className="acm-sidebar">
        <div className="acm-sidebar-logo">
          <img src={LOGO_SRC} alt="Actemium" style={{ height: 50, width: 'auto', mixBlendMode: 'multiply' }} />
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--primary)', lineHeight: 1.3, textAlign: 'center', letterSpacing: '.04em', textTransform: 'uppercase' }}>Notes de frais</div>
        </div>
        <nav className="acm-nav">
          {([
            { key: 'saisie',   icon: '✎', label: 'Saisie repas' },
            { key: 'mensuel',  icon: '◫', label: 'Vue mensuelle' },
            { key: 'export',   icon: '⬇', label: 'Export' },
            { key: 'salaries', icon: '☰', label: 'Salariés' },
          ] as { key: Tab; icon: string; label: string }[]).map(item => (
            <button key={item.key} onClick={() => setTab(item.key)}
              className={`acm-nav-item${tab === item.key ? ' active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="acm-sidebar-footer">
          <div style={{ fontWeight: 500, color: 'var(--text2)' }}>{employees.length} salarié{employees.length !== 1 ? 's' : ''} actifs</div>
        </div>
      </aside>

      {/* ── Main wrapper ── */}
      <div className="acm-main-wrapper">
        <div className="acm-topbar">
          <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', letterSpacing: '-.01em' }}>
            {tab === 'saisie' ? 'Saisie des repas' : tab === 'mensuel' ? 'Vue mensuelle' : tab === 'export' ? 'Export' : 'Gestion des salariés'}
          </span>
          <span style={{ height: 16, width: 1, background: 'var(--border2)', margin: '0 4px' }} />
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>Actemium — Notes de frais</span>
        </div>
      <main className="acm-main">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text3)' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>⟳</div>
            <div>Chargement…</div>
          </div>
        ) : (
          <>
            {tab === 'saisie' && (
              <div className="acm-saisie-layout">
                <div style={S.card}>
                  <div style={S.cardHeader}>
                    <span style={S.cardTitle}>Ajouter un repas</span>
                  </div>
                  <div className="acm-grid2">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={S.label}>Salarié</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', fontSize: 14, pointerEvents: 'none', fontWeight: 600, zIndex: 1 }}>⌕</span>
                        <input
                          style={{ ...S.input, paddingLeft: 30 }}
                          placeholder="Rechercher un salarié…"
                          value={mForm.empSearch}
                          onChange={e => {
                            const v = e.target.value
                            setMForm(f => ({ ...f, empSearch: v, employeeId: '' }))
                          }}
                          onFocus={() => setMForm(f => ({ ...f, employeeId: '' }))}
                        />
                        {mForm.empSearch && filteredEmpForForm.length > 0 && !mForm.employeeId && (
                          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,.10)', marginTop: 4, overflow: 'hidden', maxHeight: 200, overflowY: 'auto' }}>
                            {filteredEmpForForm.map(e => (
                              <button key={e.id} type="button"
                                onMouseDown={() => setMForm(f => ({ ...f, employeeId: e.id, empSearch: e.prenom + ' ' + e.nom, invites: [] }))}
                                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', fontSize: 13.5, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', transition: 'background .1s' }}
                                onMouseEnter={ev => (ev.currentTarget.style.background = 'var(--bg2)')}
                                onMouseLeave={ev => (ev.currentTarget.style.background = 'none')}
                              >
                                {e.prenom} {e.nom}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={S.label}>Type de repas</label>
                      <select style={S.input} value={mForm.type} onChange={e => setMForm(f => ({ ...f, type: e.target.value as 'paye' | 'invite', invites: [] }))}>
                        <option value="paye">Payé par le salarié</option>
                        <option value="invite">En tant qu'invité</option>
                      </select>
                    </div>
                  </div>
                  <div className="acm-grid2">
                    <div>
                      <label style={S.label}>Date du repas</label>
                      <input type="date" style={S.input} value={mForm.date} onChange={e => setMForm(f => ({ ...f, date: e.target.value }))} />
                    </div>
                    <div>
                      <label style={S.label}>Mois de rattachement</label>
                      <input type="month" style={S.input} value={mForm.targetMonth} onChange={e => setMForm(f => ({ ...f, targetMonth: e.target.value }))} />
                    </div>
                  </div>

                  <div className="acm-grid2" style={{ marginBottom: 16, alignItems: 'end' }}>
                    <div>
                      <label style={S.label}>Commentaire <span style={{ color: 'var(--text3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(laissez vide pour auto)</span></label>
                      <input style={S.input} value={mForm.commentaire} placeholder={genCommentaire(mForm.type, mForm.date)} onChange={e => setMForm(f => ({ ...f, commentaire: e.target.value }))} />
                    </div>
                    <ColorPicker label="Couleur commentaire" value={mForm.commentaireColor} onChange={c => setMForm(f => ({ ...f, commentaireColor: c }))} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={S.label}>Imputation</label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, borderRadius: 4, background: mForm.countColor, border: '1px solid rgba(0,0,0,.12)', pointerEvents: 'none', zIndex: 1 }} />
                      <select style={{ ...S.input, paddingLeft: 32 }} value={mForm.countColor} onChange={e => setMForm(f => ({ ...f, countColor: e.target.value }))}>
                        {IMPUTATIONS.map(imp => <option key={imp.label} value={imp.color}>{imp.label}</option>)}
                      </select>
                    </div>
                  </div>

                  {mForm.type === 'paye' && mForm.employeeId && (
                    <div style={{ marginBottom: 16 }}>
                      <label style={S.label}>Personnes invitées</label>

                      {/* Tags des invités sélectionnés */}
                      {mForm.invites.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                          {mForm.invites.map(id => {
                            const emp = employees.find(e => e.id === id)
                            if (!emp) return null
                            return (
                              <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px 4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 500, background: 'var(--secondary-light)', color: '#3a4a00', border: '1.5px solid #c5d96e' }}>
                                {emp.prenom} {emp.nom}
                                <button type="button" onClick={() => toggleInvite(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3a4a00', fontSize: 14, lineHeight: 1, padding: '0 2px', opacity: 0.7 }}>×</button>
                              </span>
                            )
                          })}
                        </div>
                      )}

                      {/* Barre de recherche + suggestions */}
                      <div style={{ position: 'relative', maxWidth: 360 }}>
                        <SearchInput
                          value={mForm.inviteSearch}
                          onChange={v => setMForm(f => ({ ...f, inviteSearch: v }))}
                          placeholder="Rechercher un invité…"
                        />
                        {mForm.inviteSearch.trim().length > 0 && (() => {
                          const results = employees.filter(e =>
                            e.id !== mForm.employeeId &&
                            !mForm.invites.includes(e.id) &&
                            (e.prenom + ' ' + e.nom).toLowerCase().includes(mForm.inviteSearch.toLowerCase())
                          )
                          if (results.length === 0) return (
                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, marginTop: 4, background: 'var(--bg)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: 'var(--text3)', boxShadow: 'var(--shadow-md)' }}>
                              Aucun résultat
                            </div>
                          )
                          return (
                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, marginTop: 4, background: 'var(--bg)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)', maxHeight: 220, overflowY: 'auto' }}>
                              {results.map(e => (
                                <button key={e.id} type="button"
                                  onClick={() => { toggleInvite(e.id); setMForm(f => ({ ...f, inviteSearch: '' })) }}
                                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text)', borderBottom: '1px solid var(--border)' }}
                                  onMouseEnter={ev => (ev.currentTarget.style.background = 'var(--primary-light)')}
                                  onMouseLeave={ev => (ev.currentTarget.style.background = 'none')}
                                >
                                  {e.prenom} {e.nom}
                                </button>
                              ))}
                            </div>
                          )
                        })()}
                      </div>

                      {mForm.invites.length > 0 && (
                        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--primary)', background: 'var(--primary-light)', borderRadius: 6, padding: '8px 12px', fontWeight: 500 }}>
                          → {mForm.invites.length} entrée{mForm.invites.length > 1 ? 's' : ''} «invité» créées automatiquement
                        </div>
                      )}
                    </div>
                  )}

                  <button className="acm-btn-primary" style={S.btnPrimary} onClick={addMeal} disabled={!mForm.employeeId || !mForm.date}>
                    + Enregistrer le repas
                  </button>
                </div>

                <div style={S.card}>
                  <div style={{ ...S.cardHeader, marginBottom: 0 }}>
                    <span style={S.cardTitle}>Derniers ajouts</span>
                    <span style={S.badge}>{meals.length} au total</span>
                  </div>
                  <div style={S.tableWrap} className="acm-tbl">
                    {meals.slice(0, 3).length === 0 ? (
                      <div style={S.emptyState}>Aucun repas enregistré.</div>
                    ) : (
                      <>
                        <div style={S.tableHead}>
                          <span>Date</span><span>Salarié</span><span>Type</span><span></span>
                        </div>
                        {meals.slice(0, 3).map(m => (
                          <MealRow key={m.id} meal={m} empName={getEmpName(m.employee_id)} onEdit={() => setEditMeal(m)} onDelete={() => setConfirmDelMeal(m)} />
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {tab === 'mensuel' && (
              <div style={{ display: 'grid', gap: 20 }}>
                {/* ── En-tête navigation mois ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div><h1 style={S.pageTitle}>Vue mensuelle</h1></div>
                    <p style={{ fontSize: 13, color: 'var(--text2)' }}>Résumé et détail des repas par salarié</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button style={S.navBtn} onClick={() => {
                      if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
                      else setCurrentMonth(m => m - 1)
                    }}>‹</button>
                    <span style={{ fontWeight: 600, minWidth: 160, textAlign: 'center', color: 'var(--primary)', fontSize: 15 }}>{MONTHS[currentMonth]} {currentYear}</span>
                    <button style={S.navBtn} onClick={() => {
                      if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
                      else setCurrentMonth(m => m + 1)
                    }}>›</button>
                  </div>
                </div>

                {monthMeals.length === 0 ? (
                  <div style={S.card}><div style={S.emptyState}>Aucun repas pour {MONTHS[currentMonth]} {currentYear}.</div></div>
                ) : (() => {
                  const impColorLight = (hex: string) => { const h = hex.replace('#',''); const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16); return `rgba(${r},${g},${b},0.28)` }
                  const visibleEmps = [...filteredEmpForMonth]
                    .filter(e => { const s = summary[e.id] || { paye:0,invite:0 }; return (s.paye+s.invite) > 0 })
                    .sort((a,b) => {
                      const sa = summary[a.id] || { paye:0,invite:0 }
                      const sb = summary[b.id] || { paye:0,invite:0 }
                      const d = summarySort.dir === 'asc' ? 1 : -1
                      if (summarySort.key === 'nom') return (a.prenom+' '+a.nom).localeCompare(b.prenom+' '+b.nom)*d
                      if (summarySort.key === 'paye') return (sa.paye-sb.paye)*d
                      if (summarySort.key === 'invite') return (sa.invite-sb.invite)*d
                      return ((sa.paye+sa.invite)-(sb.paye+sb.invite))*d
                    })
                  const totalPaye = visibleEmps.reduce((acc,e) => acc+(summary[e.id]?.paye||0),0)
                  const totalInvite = visibleEmps.reduce((acc,e) => acc+(summary[e.id]?.invite||0),0)
                  return (
                    <div style={S.card}>
                      {/* ── Header ── */}
                      <div style={{ ...S.cardHeader, marginBottom: 16 }}>
                        <div>
                          <span style={S.cardTitle}>Repas de {MONTHS[currentMonth]} {currentYear}</span>
                          <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--text3)', fontWeight: 400 }}>{monthMeals.length} repas · {visibleEmps.length} salarié{visibleEmps.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div style={{ maxWidth: 240 }}>
                          <SearchInput value={monthSearch} onChange={setMonthSearch} placeholder="Filtrer par nom…" />
                        </div>
                      </div>

                      {/* ── En-têtes colonnes ── */}
                      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 72px 72px 72px', gap: 12, padding: '8px 12px 10px', borderBottom: '1.5px solid var(--border)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '.06em', color: 'var(--primary)' }}>
                        {([
                          { k: 'nom', label: 'Nom / Prénom', sortable: true },
                          { k: 'repas', label: 'Commentaire', sortable: false },
                          { k: 'paye', label: 'Payé', sortable: true },
                          { k: 'invite', label: 'Invité', sortable: true },
                          { k: 'total', label: 'Total', sortable: true },
                        ] as { k: string; label: string; sortable: boolean }[]).map(({ k, label, sortable }) => {
                          const active = sortable && summarySort.key === k
                          return (
                            <span key={k}
                              onClick={sortable ? () => setSummarySort(p => ({ key: k as 'nom'|'paye'|'invite'|'total', dir: p.key === k && p.dir === 'asc' ? 'desc' : 'asc' })) : undefined}
                              style={{ cursor: sortable ? 'pointer' : 'default', userSelect: 'none', display: 'flex', alignItems: 'center', gap: 3, justifyContent: k === 'nom' || k === 'repas' ? 'flex-start' : 'center', color: k === 'repas' ? 'var(--text3)' : 'var(--primary)' }}>
                              {label}
                              {sortable && <span style={{ fontSize: 9, opacity: active ? 1 : 0.5 }}>{active ? (summarySort.dir === 'asc' ? '▲' : '▼') : '⇅'}</span>}
                            </span>
                          )
                        })}
                      </div>

                      {/* ── Lignes ── */}
                      {visibleEmps.map((e) => {
                        const s = summary[e.id] || { paye:0,invite:0 }
                        const empMeals = monthMeals
                          .filter(m => m.employee_id === e.id)
                          .sort((a,b) => a.date.localeCompare(b.date))
                        return (
                          <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 72px 72px 72px', gap: 12, alignItems: 'center', padding: '14px 12px', borderBottom: '1px solid var(--border)', transition: 'background .15s' }}
                            className="acm-summary-row">
                            {/* Nom */}
                            <span style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text)' }}>{e.prenom} {e.nom}</span>
                            {/* Chips repas */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                              {empMeals.map(m => {
                                const fmtDate = m.date ? new Date(m.date+'T12:00:00').toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'}) : ''
                                const bg = impColorLight(m.count_color || '#a8e6a3')
                                let chipLabel: string
                                if (m.type === 'paye') {
                                  chipLabel = fmtDate
                                } else if (m.invited_by) {
                                  const inv = employees.find(e => e.id === m.invited_by)
                                  chipLabel = inv ? `invité par ${inv.prenom} ${inv.nom} le ${fmtDate}` : `invité le ${fmtDate}`
                                } else {
                                  chipLabel = `invité le ${fmtDate}`
                                }
                                return (
                                  <div key={m.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 8px 4px 9px', borderRadius: 7, fontSize: 12, background: bg, border: '1px solid rgba(0,0,0,.07)', color: '#1a1a1a' }}>
                                    <span style={{ fontSize: 11.5, color: 'var(--text)', fontWeight: 500 }}>{chipLabel}</span>
                                    <button onClick={() => setEditMeal(m)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 1px', opacity: 0.4, fontSize: 12, lineHeight: 1, transition: 'opacity .1s' }} onMouseEnter={ev => ev.currentTarget.style.opacity='1'} onMouseLeave={ev => ev.currentTarget.style.opacity='.4'} title="Modifier">✎</button>
                                    <button onClick={() => setConfirmDelMeal(m)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 1px', opacity: 0.35, color: 'var(--red)', fontSize: 12, lineHeight: 1, transition: 'opacity .1s' }} onMouseEnter={ev => ev.currentTarget.style.opacity='1'} onMouseLeave={ev => ev.currentTarget.style.opacity='.35'} title="Supprimer">×</button>
                                  </div>
                                )
                              })}
                            </div>
                            {/* Compteurs */}
                            <span style={{ textAlign: 'center', fontWeight: 700, fontSize: 15, color: '#0c1524' }}>{s.paye}</span>
                            <span style={{ textAlign: 'center', fontWeight: 700, fontSize: 15, color: '#0c1524' }}>{s.invite}</span>
                            <span style={{ textAlign: 'center', fontWeight: 800, fontSize: 17, color: '#0c1524' }}>{s.paye+s.invite}</span>
                          </div>
                        )
                      })}

                      {/* ── Ligne totaux ── */}
                      {visibleEmps.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 72px 72px 72px', gap: 12, alignItems: 'center', padding: '12px 12px', borderTop: '2px solid var(--primary)', background: 'var(--primary-light)', borderRadius: '0 0 12px 12px' }}>
                          <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.05em' }}>Total</span>
                          <span />
                          <span style={{ textAlign: 'center', fontWeight: 800, fontSize: 16, color: 'var(--primary)' }}>{totalPaye}</span>
                          <span style={{ textAlign: 'center', fontWeight: 800, fontSize: 16, color: 'var(--primary)' }}>{totalInvite}</span>
                          <span style={{ textAlign: 'center', fontWeight: 900, fontSize: 18, color: 'var(--primary)' }}>{totalPaye+totalInvite}</span>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            )}

            {tab === 'export' && (() => {
              // ── helpers ──────────────────────────────────────────────
              const fmtDM = (d: string) => new Date(d+'T12:00:00').toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'})

              const buildComment = (empId: string, ms: Meal[]) => {
                const paid = ms.filter(m => m.employee_id === empId && m.type === 'paye').sort((a,b)=>a.date.localeCompare(b.date))
                const inv  = ms.filter(m => m.employee_id === empId && m.type === 'invite').sort((a,b)=>a.date.localeCompare(b.date))
                const parts: string[] = [
                  ...paid.map(m => fmtDM(m.date)),
                  ...inv.map(m => {
                    const day = fmtDM(m.date)
                    if (m.invited_by) {
                      const inviter = employees.find(e => e.id === m.invited_by)
                      if (inviter) return `invité par ${inviter.prenom} ${inviter.nom} le ${day}`
                    }
                    return `invité le ${day}`
                  }),
                ]
                return parts.join(', ')
              }

              const exportMeals = meals.filter(m => {
                const target = m.target_month ? m.target_month.slice(0,7) : m.date.slice(0,7)
                return target === `${exportYear}-${String(exportMonth+1).padStart(2,'0')}`
              })

              const empWithMeals = employees.filter(e => exportMeals.some(m => m.employee_id === e.id))
                .sort((a,b) => a.nom.localeCompare(b.nom))

              const rows = empWithMeals.map(e => {
                const paye   = exportMeals.filter(m => m.employee_id === e.id && m.type === 'paye').length
                const invite = exportMeals.filter(m => m.employee_id === e.id && m.type === 'invite').length
                return {
                  emp: e,
                  paye,
                  invite,
                  total: paye + invite,
                  comment: buildComment(e.id, exportMeals),
                }
              })

              const monthLabel = `${MONTHS[exportMonth]} ${exportYear}`

              async function doExcelExport() {
                const XLSX = await import('xlsx')
                const data = rows.map(r => ({
                  'Nom':           r.emp.nom,
                  'Prénom':        r.emp.prenom,
                  'Repas payés':   r.paye,
                  'Repas invité':  r.invite,
                  'Total':         r.total,
                  'Commentaires':  r.comment,
                }))
                const ws = XLSX.utils.json_to_sheet(data)
                // Column widths
                ws['!cols'] = [{ wch: 22 }, { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 8 }, { wch: 80 }]
                const wb = XLSX.utils.book_new()
                XLSX.utils.book_append_sheet(wb, ws, monthLabel)
                XLSX.writeFile(wb, `repas_${exportYear}_${String(exportMonth+1).padStart(2,'0')}.xlsx`)
              }

              function doCSVExport() {
                const header = ['Nom','Prénom','Repas payés','Repas invité','Total','Commentaires']
                const lines = [header, ...rows.map(r => [r.emp.nom, r.emp.prenom, r.paye, r.invite, r.total, r.comment])]
                const csv = lines.map(l => l.map(c => `"${String(c).replace(/"/g,'""')}"`).join(';')).join('\n')
                const blob = new Blob(['\uFEFF'+csv], { type: 'text/csv;charset=utf-8;' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a'); a.href = url; a.download = `repas_${exportYear}_${String(exportMonth+1).padStart(2,'0')}.csv`
                a.click(); URL.revokeObjectURL(url)
              }

              return (
                <div style={{ display: 'grid', gap: 20 }}>
                  <div>
                    <h1 style={S.pageTitle}>Export</h1>
                    <p style={S.pageSub}>Exportez les repas par mois de rattachement</p>
                  </div>

                  {/* ── Sélecteur mois ── */}
                  <div style={S.card}>
                    <span style={S.cardTitle}>Mois à exporter</span>
                    <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                      <div>
                        <label style={S.label}>Mois</label>
                        <select style={{ ...S.input, width: 160 }} value={exportMonth} onChange={e => setExportMonth(Number(e.target.value))}>
                          {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={S.label}>Année</label>
                        <select style={{ ...S.input, width: 110 }} value={exportYear} onChange={e => setExportYear(Number(e.target.value))}>
                          {[2024,2025,2026,2027].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      <div style={{ alignSelf: 'flex-end', display: 'flex', gap: 10 }}>
                        <button className="acm-btn-primary" style={{ ...S.btnPrimary, display: 'flex', alignItems: 'center', gap: 7 }}
                          onClick={doExcelExport} disabled={rows.length === 0}>
                          ⬇ Excel (.xlsx)
                        </button>
                        <button style={{ ...S.btnGhost, display: 'flex', alignItems: 'center', gap: 7 }}
                          onClick={doCSVExport} disabled={rows.length === 0}>
                          ⬇ CSV / Google Sheets
                        </button>
                      </div>
                    </div>
                    {rows.length === 0 && (
                      <div style={{ ...S.emptyState, marginTop: 16 }}>Aucun repas pour {monthLabel}.</div>
                    )}
                  </div>

                  {/* ── Prévisualisation ── */}
                  {rows.length > 0 && (
                    <div style={S.card}>
                      <div style={{ ...S.cardHeader, marginBottom: 12 }}>
                        <span style={S.cardTitle}>Aperçu — {monthLabel}</span>
                        <span style={{ fontSize: 12, color: 'var(--text3)' }}>{rows.length} salarié{rows.length > 1 ? 's' : ''} · {exportMeals.length} repas</span>
                      </div>
                      {/* header */}
                      <div style={{ display: 'grid', gridTemplateColumns: '160px 120px 90px 90px 60px 1fr', gap: 10, padding: '8px 12px 10px', borderBottom: '1.5px solid var(--border)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '.06em', color: 'var(--primary)' }}>
                        <span>Nom</span><span>Prénom</span>
                        <span style={{ textAlign:'center' }}>Payés</span>
                        <span style={{ textAlign:'center' }}>Invités</span>
                        <span style={{ textAlign:'center' }}>Total</span>
                        <span>Commentaires</span>
                      </div>
                      {rows.map(r => (
                        <div key={r.emp.id} style={{ display: 'grid', gridTemplateColumns: '160px 120px 90px 90px 60px 1fr', gap: 10, alignItems: 'center', padding: '12px 12px', borderBottom: '1px solid var(--border)' }}
                          className="acm-summary-row">
                          <span style={{ fontWeight: 600, fontSize: 13 }}>{r.emp.nom}</span>
                          <span style={{ fontSize: 13 }}>{r.emp.prenom}</span>
                          <span style={{ textAlign:'center', fontWeight: 700, fontSize: 14 }}>{r.paye}</span>
                          <span style={{ textAlign:'center', fontWeight: 700, fontSize: 14 }}>{r.invite}</span>
                          <span style={{ textAlign:'center', fontWeight: 800, fontSize: 15, color: 'var(--primary)' }}>{r.total}</span>
                          <span style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{r.comment}</span>
                        </div>
                      ))}
                      {/* totaux */}
                      <div style={{ display: 'grid', gridTemplateColumns: '160px 120px 90px 90px 60px 1fr', gap: 10, alignItems: 'center', padding: '12px 12px', borderTop: '2px solid var(--primary)', background: 'var(--primary-light)', borderRadius: '0 0 12px 12px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 12, textTransform: 'uppercase' as const, letterSpacing: '.05em', gridColumn: '1/3' }}>Total</span>
                        <span style={{ textAlign:'center', fontWeight: 800, fontSize: 15, color: 'var(--primary)' }}>{rows.reduce((a,r)=>a+r.paye,0)}</span>
                        <span style={{ textAlign:'center', fontWeight: 800, fontSize: 15, color: 'var(--primary)' }}>{rows.reduce((a,r)=>a+r.invite,0)}</span>
                        <span style={{ textAlign:'center', fontWeight: 900, fontSize: 17, color: 'var(--primary)' }}>{rows.reduce((a,r)=>a+r.total,0)}</span>
                        <span />
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}

            {tab === 'salaries' && (
              <div style={{ display: 'grid', gap: 20 }}>
                <div><h1 style={S.pageTitle}>Salariés</h1><p style={S.pageSub}>Gérez les collaborateurs actifs</p></div>
                <div style={S.card}>
                  <div style={S.cardTitle}>{editEmp ? 'Modifier le salarié' : 'Nouveau salarié'}</div>
                  <div className="acm-emp-form">
                    <div><label style={S.label}>Prénom</label><input style={S.input} placeholder="Prénom" value={eForm.prenom} onChange={e => setEForm(f => ({ ...f, prenom: e.target.value }))} /></div>
                    <div><label style={S.label}>Nom</label><input style={S.input} placeholder="Nom" value={eForm.nom} onChange={e => setEForm(f => ({ ...f, nom: e.target.value }))} /></div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="acm-btn-primary" style={S.btnPrimary} onClick={saveEmployee} disabled={!eForm.nom || !eForm.prenom}>{editEmp ? 'Enregistrer' : '+ Ajouter'}</button>
                      {editEmp && <button style={S.btnGhost} onClick={() => { setEditEmp(null); setEForm({ nom: '', prenom: '' }) }}>Annuler</button>}
                    </div>
                  </div>
                </div>
                <div style={S.card}>
                  <div style={{ ...S.cardHeader, marginBottom: 16 }}>
                    <span style={S.cardTitle}>{employees.length} salarié{employees.length !== 1 ? 's' : ''}</span>
                    <div style={{ maxWidth: 260, flex: 1 }}>
                      <SearchInput value={empSearch} onChange={setEmpSearch} />
                    </div>
                  </div>
                  {filteredEmpForAdmin.map((e, i) => (
                    <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                      <div>
                        <div style={{ fontWeight: 500, color: 'var(--text)' }}>{e.prenom} {e.nom}</div>
                        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{meals.filter(m => m.employee_id === e.id).length} repas enregistrés</div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button style={S.btnOutline} onClick={() => { setEditEmp(e); setEForm({ nom: e.nom, prenom: e.prenom }) }}>Modifier</button>
                        <button style={S.btnDanger} onClick={() => setConfirmDelEmp(e)}>Supprimer</button>
                      </div>
                    </div>
                  ))}
                  {filteredEmpForAdmin.length === 0 && <div style={S.emptyState}>Aucun résultat pour "{empSearch}"</div>}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      </div>{/* end acm-main-wrapper */}

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        input[type=date]::-webkit-calendar-picker-indicator { opacity: 0.45; cursor: pointer; }
        button:disabled { opacity: 0.4; cursor: not-allowed; }
        select { appearance: auto; }
        .acm-tr { transition: background 150ms ease; }
        .acm-tr:hover { background: var(--bg2) !important; }
        .acm-summary-row { transition: background 150ms ease; }
        .acm-summary-row:hover { background: var(--bg2) !important; }
        input:hover { border-color: var(--border2) !important; }
        .acm-btn-primary { background: linear-gradient(135deg, #3282DE 0%, #5AA7FF 100%) !important; box-shadow: 0 2px 8px rgba(50,130,222,0.25) !important; transition: all 0.2s ease !important; }
        .acm-btn-primary:hover:not(:disabled) { transform: translateY(-1px) !important; box-shadow: 0 8px 20px rgba(50,130,222,0.35) !important; filter: brightness(1.06); }
        .acm-btn-primary:active:not(:disabled) { transform: translateY(0) !important; }
        .acm-btn-ghost:hover:not(:disabled) { background: var(--bg3) !important; border-color: var(--border2) !important; }
        .acm-btn-danger:hover:not(:disabled) { background: #fee2e2 !important; border-color: #fca5a5 !important; }
        .acm-icon-btn:hover { background: var(--bg3) !important; color: var(--text2) !important; }
        button.acm-nav-btn:hover { background: var(--primary-light) !important; border-color: var(--primary) !important; }
        .acm-card-hover:hover { box-shadow: 0 8px 28px rgba(50,130,222,0.10) !important; transform: translateY(-1px); transition: all 200ms ease; }
        .acm-btn-outline:hover { background: var(--primary-light) !important; }
      `}</style>
    </div>
  )
}

function MealRow({ meal, empName, onEdit, onDelete }: { meal: Meal; empName: string; onEdit: () => void; onDelete: () => void }) {
  return (
    <div style={S.tableRow} className="acm-tr">
      <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'monospace' }}>{formatDate(meal.date)}</span>
      <span style={{ fontWeight: 500, fontSize: 13 }}>{empName}</span>
      <span style={meal.type === 'paye' ? S.badgePaye : S.badgeInvite}>{meal.type === 'paye' ? 'Payé' : 'Invité'}</span>
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <button style={S.iconBtn} title="Modifier" onClick={onEdit}>✎</button>
        <button style={{ ...S.iconBtn, color: 'var(--red)' }} title="Supprimer" onClick={onDelete}>✕</button>
      </div>
    </div>
  )
}

function StatBox({ num, label, color, big }: { num: number; label: string; color: string; big?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: big ? 26 : 20, fontWeight: 700, color, lineHeight: 1 }}>{num}</div>
      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{label}</div>
    </div>
  )
}

const S = {
  // ── Cards ──
  card: { background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px', boxShadow: 'var(--shadow)' } as React.CSSProperties,
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, gap: 12 } as React.CSSProperties,
  cardTitle: { fontWeight: 600, fontSize: 15.5, color: 'var(--text)', letterSpacing: '-.02em' } as React.CSSProperties,
  pageTitle: { fontWeight: 700, fontSize: 23, color: 'var(--text)', letterSpacing: '-.03em', lineHeight: 1.3 } as React.CSSProperties,
  pageSub: { fontSize: 13, color: 'var(--text3)', marginTop: 5, fontWeight: 400 } as React.CSSProperties,
  // ── Form ──
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', letterSpacing: '.03em', marginBottom: 7, textTransform: 'uppercase' as const } as React.CSSProperties,
  input: { width: '100%', background: '#ffffff', border: '1px solid var(--border2)', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, color: 'var(--text)', outline: 'none', transition: 'border-color .15s, box-shadow .15s', height: 42, boxShadow: 'none' } as React.CSSProperties,
  // ── Buttons ──
  btnPrimary: { background: 'linear-gradient(135deg, #3282DE 0%, #5AA7FF 100%)', color: '#fff', border: 'none', borderRadius: 10, padding: '0 22px', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap', height: 42, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 8px rgba(50,130,222,0.25)' } as React.CSSProperties,
  btnGhost: { background: 'var(--bg)', color: 'var(--text2)', border: '1px solid var(--border2)', borderRadius: 10, padding: '0 18px', fontWeight: 500, fontSize: 13, cursor: 'pointer', transition: 'all .15s', height: 38, display: 'inline-flex', alignItems: 'center' } as React.CSSProperties,
  btnOutline: { background: 'transparent', color: 'var(--primary)', border: '1.5px solid var(--primary)', borderRadius: 10, padding: '0 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .15s', height: 36, display: 'inline-flex', alignItems: 'center' } as React.CSSProperties,
  btnDanger: { background: 'var(--red-light)', color: 'var(--red)', border: '1px solid #fecaca', borderRadius: 10, padding: '0 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .15s', height: 36, display: 'inline-flex', alignItems: 'center' } as React.CSSProperties,
  iconBtn: { background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: '5px 7px', fontSize: 14, borderRadius: 7, transition: 'color .1s, background .1s', display: 'inline-flex', alignItems: 'center' } as React.CSSProperties,
  navBtn: { background: 'var(--bg)', border: '1px solid var(--border2)', color: 'var(--primary)', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' } as React.CSSProperties,
  // ── Badges ──
  badge: { background: 'var(--primary-light)', color: 'var(--primary)', padding: '3px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, border: '1px solid rgba(50,130,222,0.15)' } as React.CSSProperties,
  badgePaye: { display: 'inline-flex', alignItems: 'center', padding: '3px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: 'rgba(34,197,94,0.1)', color: '#15803d', border: '1px solid rgba(34,197,94,0.2)' } as React.CSSProperties,
  badgeInvite: { display: 'inline-flex', alignItems: 'center', padding: '3px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(50,130,222,0.15)' } as React.CSSProperties,
  // ── Tables ──
  tableWrap: { } as React.CSSProperties,
  tableHead: { display: 'grid', gridTemplateColumns: '110px 1fr 100px 64px', gap: 12, padding: '10px 14px 12px', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.08em' } as React.CSSProperties,
  tableRow: { display: 'grid', gridTemplateColumns: '110px 1fr 100px 64px', gap: 12, alignItems: 'center', padding: '13px 14px', borderBottom: '1px solid var(--border)', transition: 'background .1s' } as React.CSSProperties,
  summaryCard: { background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', boxShadow: 'var(--shadow)', borderLeft: '3px solid var(--secondary)' } as React.CSSProperties,
  summaryHead: { display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px', gap: 12, padding: '8px 16px 10px', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.06em', color: 'var(--text3)' } as React.CSSProperties,
  summaryRow: { display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px', gap: 12, alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border)', transition: 'background .15s' } as React.CSSProperties,
  emptyState: { textAlign: 'center', padding: '52px 0', color: 'var(--text3)', fontSize: 13 } as React.CSSProperties,
  // ── Modals ──
  overlay: { position: 'fixed', inset: 0, background: 'rgba(8,15,35,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(10px)' } as React.CSSProperties,
  modal: { background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '30px 30px 26px', width: 500, maxWidth: '95vw', boxShadow: '0 24px 64px rgba(0,0,0,.16), 0 0 0 1px var(--border)' } as React.CSSProperties,
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, paddingBottom: 18, borderBottom: '1px solid var(--border)' } as React.CSSProperties,
  modalTitle: { fontWeight: 700, fontSize: 15.5, color: 'var(--text)', letterSpacing: '-.015em' } as React.CSSProperties,
  closeBtn: { background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer', fontSize: 13, padding: '5px 10px', borderRadius: 7, lineHeight: 1, fontWeight: 600, transition: 'all .15s' } as React.CSSProperties,
  // ── Color picker ──
  colorTrigger: { display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', border: '1px solid var(--border2)', borderRadius: 10, padding: '9px 13px', cursor: 'pointer', color: 'var(--text)', width: '100%', height: 42, transition: 'border-color .15s', boxShadow: 'none' } as React.CSSProperties,
  colorPanel: { position: 'absolute', top: '100%', left: 0, zIndex: 200, marginTop: 6, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, boxShadow: 'var(--shadow-md)', width: 240, minWidth: 210 } as React.CSSProperties,
}
