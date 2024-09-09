import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name?: string): string {
  if (!name) return "A"

  const names = name.split(' ');
  if (names.length === 1) return names[0][0].toUpperCase();

  return names[0][0].toUpperCase() + names[1][0].toUpperCase();
}
