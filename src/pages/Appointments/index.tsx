import { useQuery } from '@tanstack/react-query'
import { api } from '../../services/api'
import { Sidebar } from '../../components/Sidebar'

interface Appointment {
  id: string
  date: string
  status: string
  notes?: string
  doctor?: { user: { name: string }; specialty?: string }
}

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  SCHEDULED:  { label: 'Agendada',   bg: '#EFF6FF', color: '#1D4ED8' },
  CONFIRMED:  { label: 'Confirmada', bg: '#F0FDF4', color: '#15803D' },
  CANCELLED:  { label: 'Cancelada',  bg: '#FEF2F2', color: '#B91C1C' },
  COMPLETED:  { label: 'Concluída',  bg: '#F8FAFC', color: '#475569' },
}

function getInitials(name: string) {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

export function Appointments() {
  const { data, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/appointments/mine', { params: { page: 1, limit: 50 } })
      return data.data.appointments as Appointment[]
    },
  })

  const appointments = data ?? []

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0F4F8', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Sidebar active="consultas" />

      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            Minhas consultas
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B' }}>
            Histórico e próximas consultas agendadas
          </p>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: '80px', background: '#fff', borderRadius: '12px', border: '0.5px solid #E2E8F0', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '64px', textAlign: 'center' }}>
            <div style={{ marginBottom: '12px', opacity: 0.25 }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" style={{ margin: '0 auto' }}>
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Nenhuma consulta ainda</p>
            <p style={{ fontSize: '13px', color: '#94A3B8' }}>Vá em Médicos e agende sua primeira consulta</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {appointments.map(a => {
              const status = statusConfig[a.status] ?? { label: a.status, bg: '#F8FAFC', color: '#475569' }
              const dateObj = new Date(a.date)
              const doctorName = a.doctor?.user?.name
              return (
                <div key={a.id} style={{
                  background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px',
                  padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%', background: '#E6F1FB',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px', fontWeight: 700, color: '#0F4C81', flexShrink: 0,
                    }}>
                      {doctorName ? getInitials(doctorName) : 'M'}
                    </div>
                    <div>
                      <p style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', marginBottom: '3px' }}>
                        {doctorName ?? 'Médico não informado'}
                      </p>
                      <p style={{ fontSize: '13px', color: '#64748B' }}>
                        {a.doctor?.specialty ?? 'Especialidade não informada'}
                      </p>
                      {a.notes && (
                        <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px', fontStyle: 'italic' }}>
                          "{a.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                    <span style={{
                      fontSize: '12px', fontWeight: 600, padding: '4px 10px',
                      borderRadius: '20px', background: status.bg, color: status.color,
                    }}>
                      {status.label}
                    </span>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                        {dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                        {dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
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
