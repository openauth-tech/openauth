import { createContext } from 'react'
import { IOpenAuthContext } from '../utils/types'

export const OpenAuthContext = createContext<IOpenAuthContext>({} as any)
