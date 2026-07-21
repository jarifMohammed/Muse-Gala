import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(length = 5) {
  return "#" + Array.from({ length }, () => Math.floor(Math.random() * 10)).join("")
}
