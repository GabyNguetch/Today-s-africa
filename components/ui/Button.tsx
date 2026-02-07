// FICHIER: components/ui/Button.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg"; // Ajout de la définition de la prop size
}

export const Button = ({ className, variant = "primary", size = "default", ...props }: ButtonProps) => {
  const baseStyles = "w-full rounded-lg font-medium transition-all duration-200 flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#3E7B52] text-white hover:bg-[#326342] shadow-sm",
    outline: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300",
    ghost: "bg-transparent text-gray-600 hover:text-gray-900",
  };

  const sizes = {
    default: "h-12 px-4",
    sm: "h-9 px-3 text-xs",
    lg: "h-14 px-8 text-base",
  };

  return (
    <button className={cn(baseStyles, variants[variant], sizes[size], className)} {...props} />
  );
};