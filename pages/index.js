import Head from 'next/head'
import { useState, useRef, useCallback } from 'react'

const steps = ['people', 'scan', 'items', 'assign', 'results']
const AVATAR_COLORS = ['var(--orange-light)', '#C0392B', '#D97706', '#7C3AED', '#0369A1', '#047857', '#B45309', '#9D174D']
const genId = () => Math.random().toString(36).slice(2, 10)
const personColor = (people, name) => AVATAR_COLORS[people.indexOf(name) % AVATAR_COLORS.length]

// ─── reusable primitives ──────────────────────────────────────────────────────

function Avatar({ name, size = 38, color = 'var(--orange)' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, color: 'white', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.38,
    }}>
      {name.charAt(0).toLowerCase()}
    </div>
  )
}

function Card({ children, style = {} }) {
  return (
    <div className="fade-up" style={{
      background: '#fff', borderRadius: 16,
      padding: '1.5rem', marginBottom: '1rem',
      boxShadow: '0 2px 16px rgba(232,68,10,0.08)',
      ...style,
    }}>
      {children}
    </div>
  )
}

function PrimaryBtn({ children, onClick, disabled, loading, style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: '100%', padding: '0.95rem',
        background: disabled || loading ? '#E5E7EB' : 'var(--orange)',
        color: disabled || loading ? '#9CA3AF' : 'white',
        border: 'none', borderRadius: 12,
        fontSize: '0.95rem', fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        ...style,
      }}
    >
      {loading && <span className="spinner" />}
      {children}
    </button>
  )
}

function GhostBtn({ children, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', padding: '0.9rem',
        background: 'none', border: '1.5px solid var(--orange)',
        borderRadius: 12, color: 'var(--orange)',
        fontSize: '0.95rem', fontWeight: 700,
        ...style,
      }}
    >
      {children}
    </button>
  )
}

function StepBar({ step, setStep }) {
  return (
    <div style={{
      display: 'flex', background: '#fff',
      borderBottom: '1px solid #E5E7EB',
      overflowX: 'auto', WebkitOverflowScrolling: 'touch',
    }}>
      {steps.map((s, i) => (
        <div
          key={s}
          onClick={() => i < step && setStep(i)}
          style={{
            padding: '11px 14px', fontSize: '0.75rem',
            fontWeight: i === step ? 600 : 400,
            color: i === step ? 'var(--orange)' : i < step ? '#6B7280' : '#9CA3AF',
            borderBottom: i === step ? '2.5px solid var(--orange)' : '2.5px solid transparent',
            cursor: i < step ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', gap: 5,
            whiteSpace: 'nowrap', flexShrink: 0,
          }}
        >
          <span style={{
            width: 18, height: 18, borderRadius: '50%', fontSize: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700,
            background: i < step ? '#4CAF50' : i === step ? 'var(--orange)' : '#E5E7EB',
            color: i <= step ? 'white' : '#9CA3AF',
          }}>
            {i < step ? '✓' : i + 1}
          </span>
          {s}
        </div>
      ))}
    </div>
  )
}

// ─── steps ────────────────────────────────────────────────────────────────────

function StepPeople({ people, setPeople, onNext }) {
  const [input, setInput] = useState('')

  const add = () => {
    const n = input.trim()
    if (n && !people.map(p => p.toLowerCase()).includes(n.toLowerCase())) {
      setPeople([...people, n])
      setInput('')
    }
  }

  return (
    <Card>
      <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>who's at the table? 🪑</h2>
      <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '1.25rem', }}>
        add everyone who ate together — minimum 2 people
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'enter' && add()}
          placeholder="type a name…"
          style={{
            flex: 1, padding: '0.75rem 1rem',
            border: '1.5px solid var(--light-border)', borderRadius: 10,
            fontSize: '1rem', background: '#f8f9fa', color: '#111827',
          }}
        />
        <button
          onClick={add}
          style={{
            background: 'var(--orange)', color: 'white', border: 'none',
            borderRadius: 10, padding: '0.75rem 1.25rem',
            fontSize: '1rem', fontWeight: 700,
          }}
        >
          + add
        </button>
      </div>

      {people.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.5rem' }}>
          {people.map(p => (
            <div key={p} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#F4F5F7', border: '1.5px solid var(--light-border)',
              borderRadius: 20, padding: '5px 10px 5px 14px',
              fontSize: '0.88rem', color: '#4B5563',
            }}>
              {p}
              <button
                onClick={() => setPeople(people.filter(x => x !== p))}
                style={{
                  background: 'none', border: 'none',
                  color: 'var(--orange)', fontSize: '1.15rem',
                  lineHeight: 1, padding: '0 2px',
                }}
              >×</button>
            </div>
          ))}
        </div>
      )}

      <PrimaryBtn onClick={onNext} disabled={people.length < 2}>
        {people.length < 2
          ? `add at least 2 people (${people.length} so far)`
          : `continue with ${people.length} people →`}
      </PrimaryBtn>
    </Card>
  )
}

function StepScan({ onParsed }) {
  const [preview, setPreview] = useState(null)
  const [imgdata, setImgData] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const fileref = useRef()

  const handleFile = e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const img = new Image()
      img.onload = () => {
        const MAX_DIM = 1200
        let width = img.width
        let height = img.height

        if (width > height && width > MAX_DIM) {
          height *= MAX_DIM / width
          width = MAX_DIM
        } else if (height > MAX_DIM) {
          width *= MAX_DIM / height
          height = MAX_DIM
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')

        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, width, height)

        const dataUrl = canvas.toDataURL('image/jpeg', 0.7)

        setPreview(dataUrl)
        setImgData({ base64: dataUrl.split(',')[1], mimeType: 'image/jpeg' })
        setError('')
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  const scan = async () => {
    if (!imgdata) return
    setScanning(true)
    setError('')
    try {
      const res = await fetch('/api/parse-bill', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ imageBase64: imgdata.base64, mimeType: imgdata.mimeType }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'parse failed')
      const withids = data.items.map(it => ({ ...it, id: genId(), price: parseFloat(it.price) || 0, qty: parseInt(it.qty) || 1 }))
      onParsed(withids)
    } catch (err) {
      setError(err.message || 'something went wrong. try a clearer photo.')
    } finally {
      setScanning(false)
    }
  }

  return (
    <Card>
      <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>scan the bill 📸</h2>
      <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '1.25rem', }}>
        take a photo of your printed receipt
      </p>

      <div
        onClick={() => fileref.current.click()}
        style={{
          border: `2px dashed ${preview ? 'var(--orange)' : 'var(--light-border)'}`,
          borderRadius: 14,
          padding: preview ? '0.5rem' : '2.5rem 1.5rem',
          textAlign: 'center', cursor: 'pointer',
          background: '#f8f9fa', marginBottom: '1.25rem',
          overflow: 'hidden',
        }}
      >
        {preview
          ? <img src={preview} alt="bill" style={{ maxWidth: '100%', maxHeight: 340, borderRadius: 10, display: 'block', margin: '0 auto' }} />
          : <>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🧾</div>
            <div style={{ color: '#6B7280', fontSize: '0.9rem', }}>tap to upload bill photo</div>
            <div style={{ color: '#9CA3AF', fontSize: '0.78rem', marginTop: 4, }}>jpg, png, heic supported</div>
          </>
        }
      </div>

      {/* hidden file input — also opens camera on mobile */}
      <input
        ref={fileref}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFile}
      />

      {error && (
        <div style={{
          background: '#FFF0EE', border: '1px solid #FFB8A8', borderRadius: 8,
          padding: '10px 14px', marginBottom: '1rem',
          color: '#4B5563', fontSize: '0.83rem',
        }}>
          ⚠️ {error}
        </div>
      )}

      <PrimaryBtn onClick={scan} disabled={!imgdata} loading={scanning}>
        {scanning ? 'reading bill…' : imgdata ? 'scan & itemize →' : 'upload a photo first'}
      </PrimaryBtn>
    </Card>
  )
}

function StepItems({ items, setItems, onNext }) {
  const total = items.reduce((s, it) => s + (Number(it.price) * (Number(it.qty) || 1)), 0)

  const update = (id, field, val) =>
    setItems(items.map(it => it.id === id ? { ...it, [field]: val } : it))

  const remove = id => setItems(items.filter(it => it.id !== id))

  const addItem = () => {
    setItems([...items, { id: genId(), name: 'new item', price: 0, qty: 1, isCharge: false }])
  }

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>review items ✏️</h2>
          <p style={{ color: '#6B7280', fontSize: '0.85rem', }}>edit names, prices, or type</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.68rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1 }}>total</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--orange)', }}>₹{total.toFixed(2)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: '1rem', fontSize: '0.73rem', }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6B7280' }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#FF007F', display: 'inline-block' }} /> food / drink
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6B7280' }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#39FF14', display: 'inline-block' }} /> tax / charge
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1rem' }}>
        {items.map(it => (
          <div key={it.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 12px',
            background: it.isCharge ? '#F0FFF0' : '#FFF0F6',
            border: `1.5px solid ${it.isCharge ? '#B3FFB3' : '#FF80BF'}`,
            borderRadius: 10,
          }}>
            <span style={{
              width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
              background: it.isCharge ? '#39FF14' : '#FF007F',
            }} />
            <input
              value={it.name}
              onChange={e => update(it.id, 'name', e.target.value)}
              style={{
                flex: 1, border: 'none', background: 'transparent',
                fontSize: '0.87rem', color: '#111827', minwidth: 0,
              }}
            />

            <span style={{ color: '#6B7280', fontSize: '0.83rem', flexShrink: 0, paddingLeft: 4 }}>x</span>
            <input
              type="number" value={it.qty || 1} min="1" step="1"
              onChange={e => update(it.id, 'qty', parseInt(e.target.value) || 1)}
              style={{
                width: 36, border: 'none', background: 'transparent',
                fontSize: '0.87rem', color: '#111827', textAlign: 'center',
              }}
            />
            <span style={{ color: '#6B7280', fontSize: '0.83rem', flexShrink: 0 }}>₹</span>
            <input
              type="number" value={it.price} min="0" step="0.01"
              onChange={e => update(it.id, 'price', parseFloat(e.target.value) || 0)}
              style={{
                width: 68, border: 'none', background: 'transparent',
                fontSize: '0.87rem', color: '#111827', textAlign: 'right',
              }}
            />
            <button
              onClick={() => update(it.id, 'isCharge', !it.isCharge)}
              style={{
                border: '1px solid var(--light-border)', borderRadius: 6,
                padding: '2px 7px', fontSize: '0.68rem',
                color: '#6b7280', background: 'white', flexShrink: 0,
              }}
            >
              {it.isCharge ? 'charge' : 'food'}
            </button>
            <button
              onClick={() => remove(it.id)}
              style={{ background: 'none', border: 'none', color: 'var(--orange)', fontSize: '1.1rem', padding: '0 3px', flexShrink: 0 }}
            >×</button>
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        style={{
          width: '100%', padding: '0.7rem', background: 'none',
          border: '1.5px dashed var(--light-border)', borderRadius: 10,
          color: '#6B7280', fontSize: '0.88rem', marginBottom: '1rem',
        }}
      >
        + add item manually
      </button>

      <PrimaryBtn onClick={onNext} disabled={items.length === 0}>
        assign items to people →
      </PrimaryBtn>
    </Card>
  )
}

function StepAssign({ people, items, assignments, setAssignments, onCalculate }) {
  const toggle = (itemId, person) =>
    setAssignments(prev => {
      const cur = prev[itemId] || []
      return {
        ...prev,
        [itemId]: cur.includes(person) ? cur.filter(p => p !== person) : [...cur, person],
      }
    })

  const foodItems = items.filter(it => !it.isCharge)
  const charges = items.filter(it => it.isCharge)
  const unassigned = foodItems.filter(it => (assignments[it.id] || []).length === 0)

  return (
    <div>
      <Card>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>who ate what? 🍴</h2>
        <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '1rem', }}>
          tick everyone who had each item
        </p>

        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 6,
          padding: '10px 12px', background: '#F4F5F7',
          borderRadius: 10, marginBottom: '1.5rem',
        }}>
          {people.map(p => (
            <span key={p} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: personColor(people, p), color: 'white',
              borderRadius: 20, padding: '4px 11px 4px 6px',
              fontSize: '0.78rem',
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: '50%',
                background: 'rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700,
              }}>
                {p.charAt(0).toLowerCase()}
              </span>
              {p}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {foodItems.map(it => {
            const assigned = assignments[it.id] || []
            return (
              <div key={it.id} style={{
                border: '1.5px solid #E8E0DC', borderRadius: 12,
                padding: '12px 14px', background: '#FAFAFA',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#111827' }}>{it.name}</span>
                    <button
                      onClick={() => {
                        const isAllSelected = assigned.length === people.length;
                        setAssignments(prev => ({
                          ...prev,
                          [it.id]: isAllSelected ? [] : [...people]
                        }))
                      }}
                      style={{
                        fontSize: '0.73rem', background: '#F4F5F7', border: '1px solid var(--light-border)',
                        borderRadius: 6, padding: '2px 8px', color: '#6B7280'
                      }}
                    >
                      {assigned.length === people.length ? 'none' : 'all'}
                    </button>
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--orange)', fontWeight: 700, flexShrink: 0 }}>
                    ₹{Number(it.price).toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {people.map(p => {
                    const checked = assigned.includes(p)
                    return (
                      <label key={p} style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        cursor: 'pointer', fontSize: '0.82rem',
                        color: checked ? '#4B5563' : '#6B7280',
                        background: checked ? '#F4F5F7' : 'white',
                        border: `1.5px solid ${checked ? 'var(--orange)' : '#E0D8D3'}`,
                        borderRadius: 20, padding: '4px 10px',
                      }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(it.id, p)}
                        />
                        {p}
                      </label>
                    )
                  })}
                </div>
                {assigned.length > 1 && (
                  <div style={{ marginTop: 6, fontSize: '0.72rem', color: '#6B7280', }}>
                    ₹{(it.price / assigned.length).toFixed(2)} each
                  </div>
                )}
              </div>
            )
          })}

          {charges.length > 0 && (
            <div style={{
              border: '1.5px solid var(--light-border)', borderRadius: 12,
              padding: '12px 14px', background: '#FFFBF0',
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4B5563', marginBottom: 8, }}>
                🧾 shared charges — split equally among all {people.length}
              </div>
              {charges.map(it => (
                <div key={it.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontSize: '0.85rem', padding: '5px 0',
                  borderBottom: '1px solid #FFE8D0',
                }}>
                  <span style={{ color: '#5A3A2C' }}>{it.name}</span>
                  <span style={{ color: 'var(--orange)', fontWeight: 600 }}>
                    ₹{Number(it.price).toFixed(2)} → ₹{(it.price / people.length).toFixed(2)} each
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {unassigned.length > 0 && (
        <div style={{
          background: '#FFF9E6', border: '1px solid var(--light-border)', borderRadius: 10,
          padding: '10px 14px', marginBottom: '1rem',
          color: '#7A5000', fontSize: '0.82rem',
        }}>
          ⚠️ {unassigned.length} item{unassigned.length > 1 ? 's' : ''} not assigned ({unassigned.map(i => i.name).join(', ')}) — will be split equally among everyone.
        </div>
      )}

      <PrimaryBtn onClick={onCalculate}>calculate everyone's share →</PrimaryBtn>
    </div>
  )
}

function StepResults({ people, items, assignments, results, onReset }) {
  const total = items.reduce((s, it) => s + (Number(it.price) * (Number(it.qty) || 1)), 0)

  return (
    <div>
      <Card>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>here's what everyone owes 💸</h2>
        <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '1.5rem', }}>
          total bill: <strong style={{ color: 'var(--orange)' }}>₹{total.toFixed(2)}</strong>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.5rem' }}>
          {Object.entries(results)
            .sort((a, b) => b[1] - a[1])
            .map(([person, amount], i) => (
              <div key={person} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '13px 16px',
                background: i === 0 ? '#F4F5F7' : '#FAFAFA',
                border: `1.5px solid ${i === 0 ? 'var(--orange)' : '#E0D8D3'}`,
                borderRadius: 12,
              }}>
                <Avatar name={person} color={personColor(people, person)} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: '0.95rem', color: '#111827' }}>{person}</div>
                </div>
                <div style={{
                  fontWeight: 700, fontSize: '1.3rem',
                  color: i === 0 ? 'var(--orange)' : '#5A3A2C',

                }}>
                  ₹{amount.toFixed(2)}
                </div>
              </div>
            ))}
        </div>

        <div style={{
          background: '#F8FFF8', border: '1px solid #C8E6C9', borderRadius: 10,
          padding: '10px 14px', marginBottom: '1.25rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: '0.83rem', color: '#3A6A3A', }}>sum of all shares</span>
          <span style={{ fontWeight: 700, color: '#2E7D32', }}>
            ₹{Object.values(results).reduce((s, v) => s + v, 0).toFixed(2)}
          </span>
        </div>

        <GhostBtn onClick={onReset}>start a new split 🍽️</GhostBtn>
      </Card>

      <Card>
        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>
          item breakdown
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {items.map((it, idx) => {
            const assigned = assignments[it.id] || []
            return (
              <div key={it.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                padding: '9px 0',
                borderBottom: idx < items.length - 1 ? '1px solid #E5E7EB' : 'none',
                fontSize: '0.83rem',
              }}>
                <div style={{ paddingRight: 8, flex: 1 }}>
                  <div style={{ color: '#111827', fontWeight: 500 }}>{it.name}</div>
                  <div style={{ color: '#6B7280', marginTop: 2, fontSize: '0.73rem' }}>
                    {it.isCharge
                      ? `split equally — ₹${(it.price / people.length).toFixed(2)} each`
                      : assigned.length === 0
                        ? 'unassigned — split equally'
                        : assigned.length === 1
                          ? `→ ${assigned[0]}`
                          : `→ ${assigned.join(', ')} · ₹${(it.price / assigned.length).toFixed(2)} each`}
                  </div>
                </div>
                <span style={{ color: 'var(--orange)', fontWeight: 600, flexShrink: 0 }}>
                  ₹{Number(it.price).toFixed(2)}
                </span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

// ─── main app ─────────────────────────────────────────────────────────────────

export default function splitplate() {
  const [step, setStep] = useState(0)
  const [people, setPeople] = useState([])
  const [items, setItems] = useState([])
  const [assignments, setAssignments] = useState({})
  const [results, setresults] = useState({})

  const handleParsed = useCallback(parseditems => {
    setItems(parseditems)
    const init = {}
    parseditems.forEach(it => { init[it.id] = [] })
    setAssignments(init)
    setStep(2)
  }, [])

  const calculate = () => {
    const totals = {}
    people.forEach(p => { totals[p] = 0 })
    items.forEach(it => {
      const assigned = assignments[it.id] || []
      if (it.isCharge || assigned.length === 0) {
        const share = it.price / people.length
        people.forEach(p => { totals[p] += share })
      } else if (assigned.length === 1) {
        totals[assigned[0]] += it.price
      } else {
        const share = it.price / assigned.length
        assigned.forEach(p => { totals[p] += share })
      }
    })
    setresults(totals)
    setStep(4)
  }

  const reset = () => {
    setStep(0); setPeople([]); setItems([])
    setAssignments({}); setresults({})
  }

  return (
    <>
      <Head>
        <title>splitplate</title>
        <meta name="description" content="Scan your restaurant bill and split it fairly in seconds." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="var(--orange)" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍽️</text></svg>" />
      </Head>

      {/* header */}
      <div style={{
        background: 'var(--orange)',
        padding: '1.1rem 1.25rem',
        display: 'flex', alignItems: 'center', gap: 12,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <span style={{ fontSize: '1.8rem' }}>🍽️</span>
        <div style={{ flex: 1 }}>
          <h1 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.3px', margin: 0 }}>
            splitplate
          </h1>

        </div>
        {step > 0 && step < 4 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 140 }}>
            {people.map(p => (
              <span key={p} style={{
                background: 'rgba(255,255,255,0.2)', color: 'white',
                borderRadius: 20, padding: '2px 8px',
                fontSize: '0.7rem',
              }}>{p}</span>
            ))}
          </div>
        )}
      </div>

      <StepBar step={step} setStep={setStep} />

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '1.25rem 1rem 3rem' }}>
        {step === 0 && (
          <StepPeople people={people} setPeople={setPeople} onNext={() => setStep(1)} />
        )}
        {step === 1 && (
          <StepScan onParsed={handleParsed} />
        )}
        {step === 2 && (
          <StepItems items={items} setItems={setItems} onNext={() => {
            const unrolled = []
            items.forEach(it => {
              const q = Number(it.qty) || 1
              if (q > 1 && !it.isCharge) {
                for (let i = 0; i < q; i++) {
                  unrolled.push({ ...it, id: genId(), name: `${it.name} (${i + 1}/${q})`, qty: 1 })
                }
              } else {
                unrolled.push({ ...it })
              }
            })
            setItems(unrolled)
            const newAssignments = { ...assignments }
            unrolled.forEach(it => {
              if (!newAssignments[it.id]) newAssignments[it.id] = []
            })
            setAssignments(newAssignments)
            setStep(3)
          }} />
        )}
        {step === 3 && (
          <StepAssign
            people={people}
            items={items}
            assignments={assignments}
            setAssignments={setAssignments}
            onCalculate={calculate}
          />
        )}
        {step === 4 && (
          <StepResults
            people={people}
            items={items}
            assignments={assignments}
            results={results}
            onReset={reset}
          />
        )}
      </div>
    </>
  )
}
