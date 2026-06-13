export type Role = 'ADMIN' | 'DOCTOR' | 'PATIENT'

export interface User {
    id: string
    name: string
    email: string
    role: Role

}

export interface AuthState {
    user: User | null
    token: string | null
    
}