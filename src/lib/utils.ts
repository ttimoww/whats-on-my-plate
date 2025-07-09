import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function convertBase64ToBuffer(base64String: string): Buffer {
  // Remove the data URL prefix if present (e.g., "data:image/jpeg;base64,")
  const base64Data = base64String.includes(',')
    ? base64String.split(',')[1] || base64String
    : base64String;

  if (!base64Data) {
    throw new Error('Invalid base64 string provided');
  }

  return Buffer.from(base64Data, 'base64');
}

