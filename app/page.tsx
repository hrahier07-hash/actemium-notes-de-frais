'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, type Employee, type Meal } from '@/lib/supabase'

const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

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
  '#f0f0f0','#999999','#e8b84b','#4ade80','#60a5fa',
  '#f87171','#c084fc','#fb923c','#34d399','#f472b6',
  '#111111','#1e3a5f','#3b1f1f','#1f3b2a',
]

function ColorPicker({ value, onChange, label }: { value: string; onChange: (c: string) => void; label: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <label style={styles.label}>{label}</label>
      <button onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', padding: '7px 12px', cursor: 'pointer', color: 'var(--text)', width: '100%' }}>
        <span style={{ width: 16, height: 16, borderRadius: 4, background: value, border: '1px solid #444', flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: 'var(--text2)' }}>{value}</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 200, marginTop: 4, background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', padding: 12, boxShadow: '0 8px 32px rgba(0,0,0,.6)', width: 220 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {PRESET_COLORS.map(c => (
              <button key={c} onClick={() => { onChange(c); setOpen(false) }} style={{ width: 24, height: 24, borderRadius: 4, background: c, border: c === value ? '2px solid var(--accent)' : '1px solid #444', cursor: 'pointer', flexShrink: 0 }} />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="color" value={value} onChange={e => onChange(e.target.value)} style={{ width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }} />
            <input value={value} onChange={e => onChange(e.target.value)} style={{ ...styles.input, flex: 1, fontSize: 12 }} placeholder="#000000" />
          </div>
        </div>
      )}
    </div>
  )
}

type Tab = 'saisie' | 'mensuel' | 'salaries'

export default function Home() {
  const [tab, setTab] = useState<Tab>('saisie')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear] = useState(new Date().getFullYear())
  const [mForm, setMForm] = useState({ employeeId: '', date: new Date().toISOString().slice(0, 10), type: 'paye' as 'paye' | 'invite', invites: [] as string[], commentaire: '', commentaireColor: '#f0f0f0', countColor: '#e8b84b' })
  const [editMeal, setEditMeal] = useState<Meal | null>(null)
  const [eForm, setEForm] = useState({ nom: '', prenom: '' })
  const [editEmp, setEditEmp] = useState<Employee | null>(null)
  const [toast, setToast] = useState('')

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2800) }

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

  const empById = Object.fromEntries(employees.map(e => [e.id, e]))
  function getEmpName(id: string | null) { if (!id) return '—'; const e = empById[id]; return e ? `${e.prenom} ${e.nom}` : '—' }

  async function addMeal() {
    if (!mForm.employeeId || !mForm.date) return
    const emp = empById[mForm.employeeId]
    const inserts: Partial<Meal>[] = []
    if (mForm.type === 'paye') {
      inserts.push({ employee_id: mForm.employeeId, date: mForm.date, type: 'paye', invited_by: null, commentaire: mForm.commentaire || genCommentaire('paye', mForm.date), commentaire_color: mForm.commentaireColor, count_color: mForm.countColor })
      for (const invId of mForm.invites) {
        inserts.push({ employee_id: invId, date: mForm.date, type: 'invite', invited_by: mForm.employeeId, commentaire: genCommentaire('invite', mForm.date, `${emp.prenom} ${emp.nom}`), commentaire_color: mForm.commentaireColor, count_color: mForm.countColor })
      }
    } else {
      inserts.push({ employee_id: mForm.employeeId, date: mForm.date, type: 'invite', invited_by: null, commentaire: mForm.commentaire || genCommentaire('invite', mForm.date), commentaire_color: mForm.commentaireColor, count_color: mForm.countColor })
    }
    await supabase.from('meals').insert(inserts)
    setMForm(f => ({ ...f, employeeId: '', invites: [], commentaire: '' }))
    showToast(`${inserts.length} repas enregistré${inserts.length > 1 ? 's' : ''} ✓`)
    fetchAll()
  }

  async function deleteMeal(id: string) { await supabase.from('meals').delete().eq('id', id); setMeals(prev => prev.filter(m => m.id !== id)); showToast('Repas supprimé') }

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

  async function deleteEmployee(id: string) { await supabase.from('employees').update({ actif: false }).eq('id', id); showToast('Salarié supprimé'); fetchAll() }
  function toggleInvite(id: string) { setMForm(f => ({ ...f, invites: f.invites.includes(id) ? f.invites.filter(i => i !== id) : [...f.invites, id] })) }

  const monthMeals = meals.filter(m => { const d = new Date(m.date); return d.getMonth() === currentMonth && d.getFullYear() === currentYear })
  const summary = employees.reduce((acc, e) => { const em = monthMeals.filter(m => m.employee_id === e.id); acc[e.id] = { paye: em.filter(m => m.type === 'paye').length, invite: em.filter(m => m.type === 'invite').length }; return acc }, {} as Record<string, { paye: number; invite: number }>)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {toast && (<div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, background: 'var(--accent)', color: '#000', padding: '10px 20px', borderRadius: 'var(--radius)', fontWeight: 600, fontSize: 13, boxShadow: '0 4px 20px rgba(232,184,75,.4)' }}>{toast}</div>)}

      {editMeal && (
        <div style={styles.overlay} onClick={() => setEditMeal(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalTitle}>Modifier le repas</div>
            <div style={{ display: 'grid', gap: 16 }}>
              <div><label style={styles.label}>Salarié</label><div style={{ fontWeight: 500 }}>{getEmpName(editMeal.employee_id)}</div></div>
              <div><label style={styles.label}>Date</label><input type="date" style={styles.input} value={editMeal.date} onChange={e => setEditMeal(m => m ? { ...m, date: e.target.value } : m)} /></div>
              <div><label style={styles.label}>Type</label><span style={editMeal.type === 'paye' ? styles.badgePaye : styles.badgeInvite}>{editMeal.type === 'paye' ? 'Payé' : 'Invité'}</span></div>
              {editMeal.invited_by && <div><label style={styles.label}>Invité par</label><div style={{ color: 'var(--text2)' }}>{getEmpName(editMeal.invited_by)}</div></div>}
              <div><label style={styles.label}>Commentaire</label><input style={styles.input} value={editMeal.commentaire || ''} onChange={e => setEditMeal(m => m ? { ...m, commentaire: e.target.value } : m)} /></div>
              <ColorPicker label="Couleur du commentaire" value={editMeal.commentaire_color || '#f0f0f0'} onChange={c => setEditMeal(m => m ? { ...m, commentaire_color: c } : m)} />
              <ColorPicker label="Couleur du compteur" value={editMeal.count_color || '#e8b84b'} onChange={c => setEditMeal(m => m ? { ...m, count_color: c } : m)} />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button style={styles.btnGhost} onClick={() => setEditMeal(null)}>Annuler</button>
                <button style={styles.btnPrimary} onClick={saveEditMeal}>Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '0 32px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0 0' }}>
            <div style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🍽</div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 700 }}>Notes de frais <span style={{ color: 'var(--accent)' }}>Actemium</span></div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>{employees.length} salariés actifs</div>
            </div>
          </div>
          <nav style={{ display: 'flex', marginTop: 12 }}>
            {(['saisie', 'mensuel', 'salaries'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ ...styles.tabBtn, color: tab === t ? 'var(--accent)' : 'var(--text3)', borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent' }}>
                {t === 'saisie' ? 'Saisie repas' : t === 'mensuel' ? 'Vue mensuelle' : 'Salariés'}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '28px 32px' }}>
        {loading ? <div style={{ color: 'var(--text2)', padding: '60px 0', textAlign: 'center' }}>Chargement…</div> : (
          <>
            {tab === 'saisie' && (
              <div style={{ display: 'grid', gap: 20 }}>
                <div style={styles.card}>
                  <div style={styles.cardTitle}>Ajouter un repas</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div><label style={styles.label}>Salarié</label><select style={styles.input} value={mForm.employeeId} onChange={e => setMForm(f => ({ ...f, employeeId: e.target.value, invites: [] }))}><option value="">Sélectionner…</option>{employees.map(e => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}</select></div>
                    <div><label style={styles.label}>Date</label><input type="date" style={styles.input} value={mForm.date} onChange={e => setMForm(f => ({ ...f, date: e.target.value }))} /></div>
                    <div><label style={styles.label}>Type</label><select style={styles.input} value={mForm.type} onChange={e => setMForm(f => ({ ...f, type: e.target.value as 'paye' | 'invite', invites: [] }))}><option value="paye">Payé par le salarié</option><option value="invite">En tant qu'invité</option></select></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div><label style={styles.label}>Commentaire <span style={{ color: 'var(--text3)', fontWeight: 400, textTransform: 'none' }}>(auto si vide)</span></label><input style={styles.input} value={mForm.commentaire} placeholder={genCommentaire(mForm.type, mForm.date)} onChange={e => setMForm(f => ({ ...f, commentaire: e.target.value }))} /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <ColorPicker label="Couleur commentaire" value={mForm.commentaireColor} onChange={c => setMForm(f => ({ ...f, commentaireColor: c }))} />
                      <ColorPicker label="Couleur compteur" value={mForm.countColor} onChange={c => setMForm(f => ({ ...f, countColor: c }))} />
                    </div>
                  </div>
                  {mForm.type === 'paye' && mForm.employeeId && (
                    <div style={{ marginBottom: 20 }}>
                      <label style={styles.label}>Invités <span style={{ color: 'var(--text3)', fontWeight: 400, textTransform: 'none' }}>— cliquer pour sélectionner</span></label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                        {employees.filter(e => e.id !== mForm.employeeId).map(e => (
                          <button key={e.id} onClick={() => toggleInvite(e.id)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: mForm.invites.includes(e.id) ? '1px solid var(--accent)' : '1px solid var(--border2)', background: mForm.invites.includes(e.id) ? 'var(--accent)' : 'var(--bg3)', color: mForm.invites.includes(e.id) ? '#000' : 'var(--text2)', transition: 'all .15s' }}>
                            {mForm.invites.includes(e.id) ? '✓ ' : ''}{e.prenom} {e.nom}
                          </button>
                        ))}
                      </div>
                      {mForm.invites.length > 0 && <div style={{ marginTop: 10, fontSize: 12, color: 'var(--accent)', background: 'rgba(232,184,75,.08)', borderRadius: 6, padding: '8px 12px' }}>→ {mForm.invites.length} entrée{mForm.invites.length > 1 ? 's' : ''} «invité» seront créées automatiquement.</div>}
                    </div>
                  )}
                  <button style={styles.btnPrimary} onClick={addMeal} disabled={!mForm.employeeId || !mForm.date}>+ Enregistrer le repas</button>
                </div>
                <div style={styles.card}>
                  <div style={{ ...styles.cardTitle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Repas récents</span><span style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 400 }}>{meals.length} au total</span></div>
                  {meals.slice(0, 10).length === 0 && <div style={{ color: 'var(--text3)', textAlign: 'center', padding: '24px 0' }}>Aucun repas enregistré.</div>}
                  {meals.slice(0, 10).map(m => <MealRow key={m.id} meal={m} empName={getEmpName(m.employee_id)} onEdit={() => setEditMeal(m)} onDelete={() => deleteMeal(m.id)} />)}
                </div>
              </div>
            )}

            {tab === 'mensuel' && (
              <div style={{ display: 'grid', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div><div style={styles.pageTitle}>Vue mensuelle</div><div style={{ fontSize: 13, color: 'var(--text3)' }}>Résumé et détail par salarié</div></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button style={styles.navBtn} onClick={() => setCurrentMonth(m => Math.max(0, m - 1))}>‹</button>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, minWidth: 130, textAlign: 'center' }}>{MONTHS[currentMonth]} {currentYear}</span>
                    <button style={styles.navBtn} onClick={() => setCurrentMonth(m => Math.min(11, m + 1))}>›</button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12 }}>
                  {employees.map(e => {
                    const s = summary[e.id] || { paye: 0, invite: 0 }; const total = s.paye + s.invite
                    const countColor = monthMeals.find(m => m.employee_id === e.id)?.count_color || 'var(--accent)'
                    if (total === 0) return null
                    return (<div key={e.id} style={{ ...styles.card, padding: 18 }}><div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, marginBottom: 14, fontSize: 14 }}>{e.prenom} {e.nom}</div><div style={{ display: 'flex', gap: 20 }}><Stat num={s.paye} label="Payé" color={countColor} /><Stat num={s.invite} label="Invité" color={countColor} /><Stat num={total} label="Total" color={countColor} big /></div></div>)
                  })}
                  {monthMeals.length === 0 && <div style={{ gridColumn: '1/-1', color: 'var(--text3)', textAlign: 'center', padding: '40px 0' }}>Aucun repas pour {MONTHS[currentMonth]} {currentYear}.</div>}
                </div>
                {monthMeals.length > 0 && (
                  <div style={styles.card}>
                    <div style={{ ...styles.cardTitle, marginBottom: 16 }}>Détail — {monthMeals.length} repas</div>
                    {[...monthMeals].sort((a, b) => a.date.localeCompare(b.date)).map(m => <MealRow key={m.id} meal={m} empName={getEmpName(m.employee_id)} onEdit={() => setEditMeal(m)} onDelete={() => deleteMeal(m.id)} />)}
                  </div>
                )}
              </div>
            )}

            {tab === 'salaries' && (
              <div style={{ display: 'grid', gap: 20 }}>
                <div style={styles.pageTitle}>Salariés</div>
                <div style={styles.card}>
                  <div style={styles.cardTitle}>{editEmp ? 'Modifier' : 'Nouveau salarié'}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'flex-end', marginTop: 14 }}>
                    <div><label style={styles.label}>Prénom</label><input style={styles.input} placeholder="Prénom" value={eForm.prenom} onChange={e => setEForm(f => ({ ...f, prenom: e.target.value }))} /></div>
                    <div><label style={styles.label}>Nom</label><input style={styles.input} placeholder="Nom" value={eForm.nom} onChange={e => setEForm(f => ({ ...f, nom: e.target.value }))} /></div>
                    <div style={{ display: 'flex', gap: 8 }}><button style={styles.btnPrimary} onClick={saveEmployee} disabled={!eForm.nom || !eForm.prenom}>{editEmp ? 'Enregistrer' : '+ Ajouter'}</button>{editEmp && <button style={styles.btnGhost} onClick={() => { setEditEmp(null); setEForm({ nom: '', prenom: '' }) }}>Annuler</button>}</div>
                  </div>
                </div>
                <div style={styles.card}>
                  <div style={{ ...styles.cardTitle, marginBottom: 16 }}>{employees.length} salarié{employees.length !== 1 ? 's' : ''}</div>
                  {employees.map(e => (
                    <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                      <div><div style={{ fontWeight: 500 }}>{e.prenom} {e.nom}</div><div style={{ fontSize: 12, color: 'var(--text3)' }}>{meals.filter(m => m.employee_id === e.id).length} repas enregistrés</div></div>
                      <div style={{ display: 'flex', gap: 8 }}><button style={styles.btnIcon} onClick={() => { setEditEmp(e); setEForm({ nom: e.nom, prenom: e.prenom }) }}>✎</button><button style={{ ...styles.btnIcon, color: 'var(--red)' }} onClick={() => deleteEmployee(e.id)}>✕</button></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } } input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.7); }`}</style>
    </div>
  )
}

function MealRow({ meal, empName, onEdit, onDelete }: { meal: Meal; empName: string; onEdit: () => void; onDelete: () => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '110px 160px 80px 1fr 80px', gap: 12, alignItems: 'center', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'monospace' }}>{formatDate(meal.date)}</span>
      <span style={{ fontWeight: 500, fontSize: 13 }}>{empName}</span>
      <span style={meal.type === 'paye' ? styles.badgePaye : styles.badgeInvite}>{meal.type === 'paye' ? 'Payé' : 'Invité'}</span>
      <span style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: meal.commentaire_color || 'var(--text2)' }}>{meal.commentaire}</span>
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <button style={styles.btnIcon} onClick={onEdit}>✎</button>
        <button style={{ ...styles.btnIcon, color: 'var(--red)' }} onClick={onDelete}>✕</button>
      </div>
    </div>
  )
}

function Stat({ num, label, color, big }: { num: number; label: string; color: string; big?: boolean }) {
  return <div><div style={{ fontSize: big ? 26 : 22, fontWeight: 700, color, fontFamily: 'Syne, sans-serif' }}>{num}</div><div style={{ fontSize: 11, color: 'var(--text3)' }}>{label}</div></div>
}

const styles = {
  card: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px' } as React.CSSProperties,
  cardTitle: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 20 } as React.CSSProperties,
  pageTitle: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '-.02em' } as React.CSSProperties,
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 } as React.CSSProperties,
  input: { width: '100%', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontSize: 13, color: 'var(--text)', outline: 'none' } as React.CSSProperties,
  btnPrimary: { background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 'var(--radius-sm)', padding: '9px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' } as React.CSSProperties,
  btnGhost: { background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', padding: '9px 18px', fontWeight: 500, fontSize: 13, cursor: 'pointer' } as React.CSSProperties,
  btnIcon: { background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: '4px 8px', fontSize: 14 } as React.CSSProperties,
  tabBtn: { background: 'none', border: 'none', padding: '10px 18px', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all .15s' } as React.CSSProperties,
  navBtn: { background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)', borderRadius: 'var(--radius-sm)', width: 32, height: 32, cursor: 'pointer', fontSize: 16 } as React.CSSProperties,
  badgePaye: { display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(74,222,128,.12)', color: 'var(--green)', border: '1px solid rgba(74,222,128,.2)' } as React.CSSProperties,
  badgeInvite: { display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(96,165,250,.12)', color: 'var(--blue)', border: '1px solid rgba(96,165,250,.2)' } as React.CSSProperties,
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 } as React.CSSProperties,
  modal: { background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 14, padding: 28, width: 460, maxWidth: '95vw', boxShadow: '0 24px 80px rgba(0,0,0,.8)' } as React.CSSProperties,
  modalTitle: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 20 } as React.CSSProperties,
}
