import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function generateImagePlaceholder(width: number, height: number, text = "Image"): string {
  return `https://placehold.co/${width}x${height}/CCCCCC/777777?text=${text}`;
}

export function getCategoryBgColor(color: string, opacity = "10"): string {
  return `${color}${opacity}`;
}

export function getReadableTextColor(bgColor: string): string {
  // For simplicity, we'll use white text on colored backgrounds
  return "white";
}
