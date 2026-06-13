import { api } from './api'

export interface Doctor {
  id: string
  name: string
  specialty: string
}

export async function getDoctors(): Promise<Doctor[]> {
  const { data } = await api.get('/api/v1/doctors')
  return data
}