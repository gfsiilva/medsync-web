import { api } from './api'

export interface Appointment {
  id: string
  date: string
  status: string
  doctor: { name: string }
  patient: { name: string }
}

export async function getMyAppointments(): Promise<Appointment[]> {
  const { data } = await api.get('/api/v1/appointments/mine')
  return data
}