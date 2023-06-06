'use client'
import { FC, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

interface ProviderProps {
  children: ReactNode
}

const Provider: FC<ProviderProps> = ({children}) => {
  return (
  <>
  <Toaster position='top-center' reverseOrder = {false}></Toaster>
  {children}
  </>
  )
}

export default Provider