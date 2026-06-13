import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'

const loginSchema = z.object({
  email: z.string().min(1, 'Email obrigatório').email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória').min(6, 'Mínimo 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

export function Login() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue, // pra preencher os campos do demo
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit({ email, password }: LoginForm) {
    setServerError(null)
    try {
      const { data } = await api.post('/api/v1/auth/login', { email, password })
      login(data.data.user, data.data.token)
      navigate('/dashboard')
    } catch {
      setServerError('Email ou senha inválidos')
    }
  }

  function fillDemo(role: 'patient' | 'doctor') {
    if (role === 'patient') {
      setValue('email', 'patient@medsync.com')
      setValue('password', '123456Me')
    } else {
      setValue('email', 'doctor@medsync.com')
      setValue('password', '123456Me')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F0F4F8' }}>

      {/* Painel esquerdo */}
      <div style={{
        width: '45%', background: '#0F4C81', display: 'flex',
        flexDirection: 'column', justifyContent: 'space-between', padding: '48px',
      }} className="login-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', background: 'rgba(255,255,255,0.15)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>MedSync</span>
        </div>

        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Plataforma médica
          </p>
          <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Gerencie suas<br />consultas com<br />facilidade
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: '320px' }}>
            Pacientes e médicos em um só lugar. Agende, confirme e acompanhe consultas de forma simples.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          {[['Pacientes', '200+'], ['Médicos', '15+'], ['Consultas', '1.2k+']].map(([label, value]) => (
            <div key={label}>
              <p style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>{value}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Painel direito */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Bem-vindo de volta
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '36px' }}>
            Entre com suas credenciais para continuar
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                {...register('email')}
                style={{
                  height: '44px', border: errors.email ? '1.5px solid #E24B4A' : '1px solid #CBD5E1',
                  borderRadius: '10px', padding: '0 14px', fontSize: '14px', color: '#0F172A',
                  background: '#fff', outline: 'none', transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#0F4C81'}
                onBlur={e => e.target.style.borderColor = errors.email ? '#E24B4A' : '#CBD5E1'}
              />
              {errors.email && <span style={{ fontSize: '12px', color: '#E24B4A' }}>{errors.email.message}</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register('password')}
                  style={{
                    height: '44px', border: errors.password ? '1.5px solid #E24B4A' : '1px solid #CBD5E1',
                    borderRadius: '10px', padding: '0 44px 0 14px', fontSize: '14px', color: '#0F172A',
                    background: '#fff', outline: 'none', width: '100%', transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#0F4C81'}
                  onBlur={e => e.target.style.borderColor = errors.password ? '#E24B4A' : '#CBD5E1'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px',
                  }}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <span style={{ fontSize: '12px', color: '#E24B4A' }}>{errors.password.message}</span>}
            </div>

            {serverError && (
              <div style={{
                background: '#FCEBEB', border: '1px solid #F09595',
                borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#A32D2D',
              }}>
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                height: '46px', background: isSubmitting ? '#64748B' : '#0F4C81',
                color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s', marginTop: '4px',
              }}
              onMouseEnter={e => { if (!isSubmitting) (e.target as HTMLButtonElement).style.background = '#0C447C' }}
              onMouseLeave={e => { if (!isSubmitting) (e.target as HTMLButtonElement).style.background = '#0F4C81' }}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>

            {/* Acesso rápido demo */}
            <div style={{ marginTop: '4px' }}>
              <p style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', marginBottom: '8px' }}>
                Acesso rápido para demonstração
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => fillDemo('patient')}
                  style={{
                    flex: 1, height: '38px', background: '#fff',
                    border: '1px solid #E2E8F0', borderRadius: '8px',
                    fontSize: '12px', color: '#475569', cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                >
                  👤 Paciente
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('doctor')}
                  style={{
                    flex: 1, height: '38px', background: '#fff',
                    border: '1px solid #E2E8F0', borderRadius: '8px',
                    fontSize: '12px', color: '#475569', cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                >
                  🩺 Médico
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-panel { display: none !important; }
        }
      `}</style>
    </div>
  )
}