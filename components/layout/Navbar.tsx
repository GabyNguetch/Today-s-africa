"use client";

import React from "react";
import Link from "next/link";
import { Globe, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP_CONFIG, HOME_DATA } from "@/lib/constant";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-[#0a0a0a]/95 dark:border-b dark:border-zinc-800 py-4 px-6 md:px-12 flex items-center justify-between shadow-sm backdrop-blur-sm">
      {/* Logo Section */}
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2.5 font-extrabold text-lg tracking-wider text-black dark:text-white uppercase group">
          <div className="bg-[#3E7B52] text-white p-1 rounded-sm">
            <Globe size={20} strokeWidth={3} />
          </div>
          <span>{APP_CONFIG.name}</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6">
          {HOME_DATA.navLinks.map((item) => (
            <Link 
              key={item.slug} 
              href={`/category/${item.slug}`} 
              className="text-[12px] font-bold uppercase tracking-wide text-gray-600 hover:text-[#3E7B52] dark:text-gray-300 dark:hover:text-[#13EC13] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Search input (desktop only for space) */}
        <div className="hidden md:flex items-center relative">
            <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-9 pr-4 py-1.5 text-xs bg-gray-100 dark:bg-zinc-800 border-none rounded-md focus:ring-1 focus:ring-[#3E7B52] outline-none dark:text-white w-48"
            />
            <Search className="absolute left-3 w-3.5 h-3.5 text-gray-400" />
        </div>

        <Link href="/about" className="hidden sm:block text-xs font-semibold text-gray-900 dark:text-gray-100 hover:opacity-80">
          À Propos
        </Link>
        <Button 
          className="h-9 px-6 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded text-xs font-bold uppercase tracking-wider dark:bg-[#2563EB]"
        >
          S'abonner
        </Button>
        <button className="lg:hidden text-black dark:text-white">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}