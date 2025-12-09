"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown, Globe } from "lucide-react";
import { APP_CONFIG, HOME_DATA } from "@/lib/constant";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-100 dark:border-zinc-800 bg-[#FBFBFB] dark:bg-black py-16 px-6 md:px-12 w-full">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
             <Globe className="w-5 h-5 text-[#3E7B52] dark:text-[#13EC13]" />
             <h4 className="font-black text-sm uppercase tracking-wider text-black dark:text-white">
                {APP_CONFIG.name}
             </h4>
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed max-w-xs">
            {HOME_DATA.footer.description}
          </p>
        </div>

        {/* Colonne Sections Dynamique via le navLinks principal */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-black dark:text-white">
            Sections
          </h4>
          <ul className="space-y-2.5">
            {HOME_DATA.navLinks.slice(0, 5).map((item) => (
              <li key={item.slug}>
                <Link href={`/category/${item.slug}`} className="text-xs text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-black dark:text-white">
            À propos
          </h4>
          <ul className="space-y-2.5">
            {HOME_DATA.footer.about.map((item) => (
              <li key={item}>
                <Link href="#" className="text-xs text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-black dark:text-white">
            Langue
          </h4>
          <div className="relative max-w-[180px]">
            <select className="w-full appearance-none bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 text-xs font-medium py-2.5 px-4 rounded hover:border-gray-400 focus:outline-none cursor-pointer">
              <option>Français</option>
              <option>English</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center">
          <p className="text-[10px] text-gray-400 dark:text-zinc-600">
              © {APP_CONFIG.year} {APP_CONFIG.name}. Tous droits réservés.
          </p>
          <div className="flex gap-4">
             <Link href="#" className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">À propos</Link>
             <Link href="#" className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">Contact</Link>
             <Link href="#" className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">Politique de confidentialité</Link>
          </div>
      </div>
    </footer>
  );
}