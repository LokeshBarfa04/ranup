"use client";

import { motion } from "framer-motion";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-leaf-900 text-white py-16 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-leaf-600/30 to-transparent" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-leaf-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-leaf-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                  <path d="M12 2C7 2 3 8 3 14c0 4 2.5 7 6 7.5V18c0-3 1.5-5 3-6.5C13.5 13 15 15 15 18v3.5c3.5-.5 6-3.5 6-7.5 0-6-4-12-9-12z" fill="#c8e6a0" />
                </svg>
              </div>
              <span className="font-display font-bold text-xl">AgroSeeds</span>
            </div>
            <p className="text-leaf-300/70 text-sm leading-relaxed max-w-sm">
              Premium certified seeds and agronomic solutions for India&apos;s
              farming communities. Serving with integrity since 1994.
            </p>
            <div className="mt-6 flex items-center gap-1 text-xs text-leaf-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Durg, Chhattisgarh — 491001, India
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-seed-300 text-xs font-semibold tracking-widest uppercase mb-4">
              Navigate
            </h4>
            <ul className="space-y-2.5">
              {["Home", "Seeds", "About", "Why Us", "Contact"].map((link) => (
                <li key={link}>
                  <button
                    onClick={() => {
                      const id = link.toLowerCase().replace(" ", "-");
                      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-leaf-300/70 hover:text-white text-sm transition-colors"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-seed-300 text-xs font-semibold tracking-widest uppercase mb-4">
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-leaf-300/70">
              <li>
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li>
                <a href="mailto:info@agroseeds.in" className="hover:text-white transition-colors">
                  info@agroseeds.in
                </a>
              </li>
              <li className="text-leaf-400/60">Mon–Sat, 9 AM – 6 PM IST</li>
            </ul>

            <div className="mt-6">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/30 rounded-xl text-[#4ADE80] text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-leaf-700/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-leaf-400/60">
          <p>© {year} AgroSeeds. All rights reserved.</p>
          <p>Designed with 🌱 in Chhattisgarh, India</p>
        </div>
      </div>
    </footer>
  );
}
