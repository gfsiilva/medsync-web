import { useAuth } from '../../contexts/AuthContext'
import { Sidebar } from '../../components/Sidebar'

const roleLabel: Record<string, string> = {
  ADMIN: 'Administrador',
  DOCTOR: 'Médico',
  PATIENT: 'Paciente',
}

function getInitials(name: string) {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

export function Profile() {
  const { user } = useAuth()
  const displayName = user?.name ?? user?.email ?? 'Usuário'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0F4F8', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Sidebar active="perfil" />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>

        <div style={{
          width: '380px', background: '#0F4C81', borderRadius: '20px',
          padding: '32px', boxShadow: '0 8px 32px rgba(15,76,129,0.18)',
          position: 'relative', overflow: 'hidden',
        }}>

          {/* Decoração de fundo */}
          <div style={{
            position: 'absolute', top: '-40px', right: '-40px',
            width: '160px', height: '160px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-60px', left: '-30px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
          }} />

          {/* Header do cartão */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>
                MedSync
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                Cartão do Paciente
              </p>
            </div>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>

          {/* Avatar + nome */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {getInitials(displayName)}
            </div>
            <div>
              <p style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px', letterSpacing: '-0.02em' }}>
                {displayName}
              </p>
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '3px 10px',
                borderRadius: '20px', background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)',
              }}>
                {roleLabel[user?.role ?? ''] ?? user?.role}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }} />

          {/* Dados */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>
                Email
              </p>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>{user?.email}</p>
            </div>

            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>
                Função
              </p>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>{roleLabel[user?.role ?? ''] ?? user?.role}</p>
            </div>

            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>
                ID
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{user?.id}</p>
            </div>
          </div>

        </div>

      </main>
    </div>
  )
}