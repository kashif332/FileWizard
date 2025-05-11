import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

export function isValidFileType(file: File, acceptedTypes: string[]): boolean {
  const fileType = file.type;
  const extension = getFileExtension(file.name).toLowerCase();
  
  return acceptedTypes.some(type => {
    if (type.startsWith(".")) {
      return extension === type.substring(1).toLowerCase();
    }
    return fileType.includes(type);
  });
}

export function downloadFile(data: Blob | string, filename: string) {
  const blob = typeof data === 'string' ? new Blob([data]) : data;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}