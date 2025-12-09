// FICHIER: components/ui/Button.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
}

export const Button = ({ className, variant = "primary", ...props }: ButtonProps) => {
  const baseStyles = "h-12 w-full rounded-lg font-medium transition-all duration-200 flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#3E7B52] text-white hover:bg-[#326342] shadow-sm",
    outline: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300",
    ghost: "bg-transparent text-gray-600 hover:text-gray-900",
  };

  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props} />
  );
};