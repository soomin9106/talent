import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleChange = (event: { target: { value: any; }; }, setValue: (arg0: any) => void) => {
  setValue(event.target.value)
}
