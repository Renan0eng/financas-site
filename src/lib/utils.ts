import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatarDataBr(data: string | Date): string {
  const date = new Date(data)
  const dia = String(date.getDate()).padStart(2, '0')
  const mes = String(date.getMonth() + 1).padStart(2, '0') // Meses começam do zero
  const ano = date.getFullYear()
  
  return `${dia}/${mes}/${ano}`
}
