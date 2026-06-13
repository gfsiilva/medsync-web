import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '../../services/api'
import { Sidebar } from '../../components/Sidebar'
import axios from 'axios'


interface Doctor {
  id: string
  specialty: string
  crm: string
  user: { name: string; email: string }
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

function getTomorrowMin() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(8, 0, 0, 0)
  return d.toISOString().slice(0, 16)
}

export function Schedule() {
  const { doctorId } = useParams<{ doctorId: string }>()
  const navigate = useNavigate()
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: doctor, isLoading: loadingDoctor } = useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/doctors/${doctorId}`)
      return data.data as Doctor
    },
    enabled: !!doctorId,
  })

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post('/api/v1/appointments', {
        doctorId,
        date: new Date(date).toISOString(),
        notes: notes || undefined,
      })
    },
    onSuccess: () => {
      setSuccess(true)
      setError(null)
    },
    onError: (err: unknown) => {
  if (axios.isAxiosError(err)) {
    setError(err.response?.data?.message ?? 'Erro ao agendar. Tente outro horário.')
  } else {
    setError('Erro ao agendar. Tente outro horário.')
  }
},
  })

  if (success) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#F0F4F8', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <Sidebar active="consultas" />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
          <div style={{ textAlign: 'center', maxWidth: '360px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%', background: '#F0FDF4',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A7F5A" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Consulta agendada!
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, marginBottom: '28px' }}>
              Sua consulta com <strong>{doctor?.user.name}</strong> foi agendada com sucesso.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/consultas')}
                style={{
                  height: '42px', padding: '0 20px', background: '#0F4C81', color: '#fff',
                  border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Ver consultas
              </button>
              <button
                onClick={() => navigate('/medicos')}
                style={{
                  height: '42px', padding: '0 20px', background: '#fff', color: '#0F172A',
                  border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer',
                }}
              >
                Voltar
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0F4F8', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Sidebar active="medicos" />

      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <button
          onClick={() => navigate('/medicos')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', background: 'none',
            border: 'none', cursor: 'pointer', color: '#64748B', fontSize: '14px', marginBottom: '24px', padding: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Voltar para médicos
        </button>

        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            Agendar consulta
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B' }}>Escolha a data e horário da sua consulta</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '820px' }}>

          {/* Card do médico */}
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '24px', height: 'fit-content' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Médico selecionado
            </p>
            {loadingDoctor ? (
              <div style={{ height: '80px', background: '#F8FAFC', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
            ) : doctor ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%', background: '#E6F1FB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: 700, color: '#0F4C81', flexShrink: 0,
                }}>
                  {getInitials(doctor.user.name)}
                </div>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>{doctor.user.name}</p>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>{doctor.specialty}</p>
                  {doctor.crm && <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>CRM: {doctor.crm}</p>}
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '14px', color: '#94A3B8' }}>Médico não encontrado</p>
            )}
          </div>

          {/* Formulário */}
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Dados do agendamento
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Data e horário
                </label>
                <input
                  type="datetime-local"
                  value={date}
                  min={getTomorrowMin()}
                  onChange={e => setDate(e.target.value)}
                  style={{
                    width: '100%', height: '42px', border: '1px solid #E2E8F0', borderRadius: '8px',
                    padding: '0 12px', fontSize: '14px', color: '#0F172A', background: '#F8FAFC', outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Observações <span style={{ fontWeight: 400, color: '#94A3B8' }}>(opcional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Descreva seus sintomas ou motivo da consulta..."
                  rows={4}
                  style={{
                    width: '100%', border: '1px solid #E2E8F0', borderRadius: '8px',
                    padding: '10px 12px', fontSize: '14px', color: '#0F172A',
                    background: '#F8FAFC', outline: 'none', resize: 'vertical',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                />
              </div>

              {error && (
                <div style={{
                  background: '#FCEBEB', border: '1px solid #F09595', borderRadius: '8px',
                  padding: '10px 14px', fontSize: '13px', color: '#A32D2D',
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={() => mutation.mutate()}
                disabled={!date || mutation.isPending}
                style={{
                  height: '44px', background: !date || mutation.isPending ? '#94A3B8' : '#0F4C81',
                  color: '#fff', border: 'none', borderRadius: '8px',
                  fontSize: '14px', fontWeight: 600, cursor: !date || mutation.isPending ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (date && !mutation.isPending) (e.currentTarget.style.background = '#0C447C') }}
                onMouseLeave={e => { if (date && !mutation.isPending) (e.currentTarget.style.background = '#0F4C81') }}
              >
                {mutation.isPending ? 'Agendando...' : 'Confirmar agendamento'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  )
}
