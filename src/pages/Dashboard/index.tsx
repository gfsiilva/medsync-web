import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'
import { Sidebar } from '../../components/Sidebar'

interface Appointment {
  id: string
  date: string
  status: string
  doctor?: { user?: { name?: string }; specialty?: string }
  patient?: { user?: { name?: string } }
}

interface Doctor {
  id: string
  specialty: string
  user?: { name?: string }
}

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  SCHEDULED: { label: 'Agendada',   bg: '#EFF6FF', color: '#1D4ED8' },
  CONFIRMED: { label: 'Confirmada', bg: '#F0FDF4', color: '#15803D' },
  CANCELLED: { label: 'Cancelada',  bg: '#FEF2F2', color: '#B91C1C' },
  COMPLETED: { label: 'Concluída',  bg: '#F8FAFC', color: '#475569' },
}

function getInitials(name?: string) {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

export function Dashboard() {
  const { user } = useAuth()

  const { data: appointmentsData, isLoading: loadingAppointments } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/appointments/mine', {
        params: { page: 1, limit: 10 },
      })
      return data.data.appointments as Appointment[]
    },
  })

  const { data: doctorsData, isLoading: loadingDoctors } = useQuery({
  queryKey: ['doctors'],
  queryFn: async () => {
    const { data } = await api.get('/api/v1/doctors')
    return data.data.doctors as Doctor[]
  },
})

  const appointments = appointmentsData ?? []
  const doctors = doctorsData ?? []
  const displayName = user?.name ?? user?.email ?? 'Usuário'
  const nextAppointment = appointments.find(a => a.status === 'SCHEDULED' || a.status === 'CONFIRMED')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0F4F8', fontFamily: 'Inter, system-ui, sans-serif' }}>

      <Sidebar active="dashboard" />

      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            Olá, {displayName.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B' }}>
            Aqui está um resumo da sua saúde
          </p>
        </div>

        {/* Cards de resumo */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            {
              label: 'Total de consultas',
              value: loadingAppointments ? '...' : appointments.length,
              sub: 'registradas',
              accent: '#0F4C81',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F4C81" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              ),
            },
            {
              label: 'Próxima consulta',
              value: nextAppointment ? new Date(nextAppointment.date).toLocaleDateString('pt-BR') : '—',
              sub: nextAppointment ? (nextAppointment.doctor?.user?.name ?? 'Médico') : 'Sem agendamento',
              accent: '#1A7F5A',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A7F5A" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
              ),
            },
            {
              label: 'Médicos disponíveis',
              value: loadingDoctors ? '...' : doctors.length,
              sub: 'prontos para atender',
              accent: '#7C3AED',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              ),
            },
          ].map(card => (
            <div key={card.label} style={{
              background: '#fff', border: '0.5px solid #E2E8F0',
              borderRadius: '12px', padding: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <p style={{ fontSize: '13px', color: '#64748B' }}>{card.label}</p>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: card.accent + '18',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {card.icon}
                </div>
              </div>
              <p style={{ fontSize: '26px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                {card.value}
              </p>
              <p style={{ fontSize: '12px', color: '#94A3B8' }}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Lista de consultas */}
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>Minhas consultas</h2>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>
              {loadingAppointments ? '' : `${appointments.length} no total`}
            </span>
          </div>

          {loadingAppointments ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: '64px', background: '#F8FAFC', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ marginBottom: '12px', opacity: 0.3 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" style={{ margin: '0 auto' }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>Nenhuma consulta</p>
              <p style={{ fontSize: '13px', color: '#94A3B8' }}>Suas consultas aparecerão aqui</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {appointments.map(a => {
                const status = statusConfig[a.status] ?? { label: a.status, bg: '#F8FAFC', color: '#475569' }
                const doctorName = a.doctor?.user?.name
                return (
                  <div key={a.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px', border: '0.5px solid #E2E8F0', borderRadius: '10px',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%', background: '#E6F1FB',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', fontWeight: 700, color: '#0F4C81', flexShrink: 0,
                      }}>
                        {doctorName ? getInitials(doctorName) : 'M'}
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginBottom: '2px' }}>
                          {doctorName ?? 'Médico não informado'}
                        </p>
                        <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                          {a.doctor?.specialty ?? 'Especialidade não informada'} · {new Date(a.date).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '12px', fontWeight: 600, padding: '4px 10px',
                      borderRadius: '20px', background: status.bg, color: status.color,
                    }}>
                      {status.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Lista de médicos */}
        {!loadingDoctors && doctors.length > 0 && (
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginTop: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>Médicos disponíveis</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {doctors.map(d => {
                const doctorName = d.user?.name
                return (
                  <div key={d.id} style={{
                    padding: '16px', border: '0.5px solid #E2E8F0', borderRadius: '10px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                  }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%', background: '#F0FDF4',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: 700, color: '#1A7F5A', flexShrink: 0,
                    }}>
                      {getInitials(doctorName)}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {doctorName ?? 'Médico'}
                      </p>
                      <p style={{ fontSize: '12px', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {d.specialty}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
