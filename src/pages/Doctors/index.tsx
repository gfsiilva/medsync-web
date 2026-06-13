import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import { Sidebar } from '../../components/Sidebar'

interface Doctor {
  id: string
  specialty: string
  crm: string
  user: { name: string; email: string }
}

// Protege contra name undefined
function getInitials(name: string) {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

const specialtyColors: Record<string, { bg: string; color: string }> = {
  Cardiologia:     { bg: '#FEF2F2', color: '#B91C1C' },
  Dermatologia:    { bg: '#FFF7ED', color: '#C2410C' },
  Neurologia:      { bg: '#EFF6FF', color: '#1D4ED8' },
  Pediatria:       { bg: '#F0FDF4', color: '#15803D' },
  Ortopedia:       { bg: '#FAF5FF', color: '#7E22CE' },
  Ginecologia:     { bg: '#FDF2F8', color: '#9D174D' },
  Psiquiatria:     { bg: '#ECFDF5', color: '#065F46' },
  'Clínica Geral': { bg: '#F0F9FF', color: '#0369A1' },
}

function getSpecialtyColor(specialty: string) {
  return specialtyColors[specialty] ?? { bg: '#F8FAFC', color: '#475569' }
}

export function Doctors() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const { data: doctorsData, isLoading } = useQuery({
  queryKey: ['doctors-list'], // era ['doctors']
  queryFn: async () => {
  const { data } = await api.get('/api/v1/doctors')
  const result = data.data
  return (Array.isArray(result) ? result : result.doctors ?? []) as Doctor[]
},
})

  const doctors = doctorsData ?? []

  // Protege contra user ou specialty undefined
  const filtered = doctors.filter(d =>
    (d.user?.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (d.specialty ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0F4F8', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Sidebar active="medicos" />

      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            Médicos
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B' }}>
            Encontre um especialista e agende sua consulta
          </p>
        </div>

        {/* Busca */}
        <div style={{ position: 'relative', marginBottom: '24px', maxWidth: '400px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nome ou especialidade..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', height: '42px', border: '1px solid #E2E8F0', borderRadius: '10px',
              padding: '0 14px 0 40px', fontSize: '14px', color: '#0F172A',
              background: '#fff', outline: 'none',
            }}
          />
        </div>

        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ height: '140px', background: '#fff', borderRadius: '12px', border: '0.5px solid #E2E8F0', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>Nenhum médico encontrado</p>
            <p style={{ fontSize: '13px', color: '#94A3B8' }}>Tente outro nome ou especialidade</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {filtered.map(d => {
              const sc = getSpecialtyColor(d.specialty)
              return (
                <div key={d.id} style={{
                  background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px',
                  padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px',
                  transition: 'box-shadow 0.15s, transform 0.15s', cursor: 'default',
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(15,76,129,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%', background: '#E6F1FB',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '15px', fontWeight: 700, color: '#0F4C81', flexShrink: 0,
                    }}>
                      {getInitials(d.user?.name)}
                    </div>
                    <div>
                      <p style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                        {d.user?.name ?? 'Nome não informado'}
                      </p>
                      <span style={{
                        fontSize: '12px', fontWeight: 600, padding: '3px 8px',
                        borderRadius: '20px', background: sc.bg, color: sc.color,
                      }}>
                        {d.specialty ?? 'Especialidade não informada'}
                      </span>
                    </div>
                  </div>

                  {d.crm && (
                    <p style={{ fontSize: '12px', color: '#94A3B8' }}>CRM: {d.crm}</p>
                  )}

                  <button
                    onClick={() => navigate(`/agendar/${d.id}`)}
                    style={{
                      height: '38px', background: '#0F4C81', color: '#fff', border: 'none',
                      borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#0C447C')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#0F4C81')}
                  >
                    Agendar consulta
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  )
}