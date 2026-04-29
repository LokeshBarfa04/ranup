"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "#home" },

  { label: "Products", href: "#products" },

  // { label: "Seeds", href: "#seeds" },

  { label: "About", href: "#about" },
  { label: "Why Us", href: "#why-us" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-cream/90 backdrop-blur-xl shadow-sm border-b border-leaf-100/60"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          {/* <button
            onClick={() => scrollTo("#home")}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-full bg-leaf-700 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path
                  d="M12 2C7 2 3 8 3 14c0 4 2.5 7 6 7.5V18c0-3 1.5-5 3-6.5C13.5 13 15 15 15 18v3.5c3.5-.5 6-3.5 6-7.5 0-6-4-12-9-12z"
                  fill="#c8e6a0"
                />
                <path
                  d="M12 11.5C10.5 9.8 9 7.5 9 5.5"
                  stroke="#4d7d1a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex flex-col -gap-1">
              <span className="font-display font-bold text-leaf-800 text-lg leading-none">
                AgroSeeds
              </span>
              <span className="text-[10px] font-body text-soil-400 tracking-widest uppercase leading-none">
                Est. 1994
              </span>
            </div>
          </button> */}

         <button
  onClick={() => scrollTo("#home")}
  className="group"
>
  <img
    src="/logothree.png"
    alt="Ranup Crop Care Pvt. Ltd"
    className="h-14 w-14 rounded-full object-cover shadow-md group-hover:scale-110 transition-transform duration-300"
  />
</button>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${
                      isActive
                        ? "text-leaf-600"
                        : "text-soil-600 hover:text-leaf-700"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-leaf-50 rounded-lg border border-leaf-200/60"
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scrollTo("#contact")}
              className="px-5 py-2.5 bg-leaf-700 hover:bg-leaf-600 text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-leaf-200 hover:-translate-y-0.5"
            >
              contact us 
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-leaf-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 bg-soil-700 block rounded-full origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-5 h-0.5 bg-soil-700 block rounded-full"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 bg-soil-700 block rounded-full origin-center"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-cream/95 backdrop-blur-xl border-b border-leaf-100 shadow-xl md:hidden"
          >
            <ul className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="w-full text-left px-4 py-3 text-soil-700 hover:text-leaf-700 hover:bg-leaf-50 rounded-xl text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
              >
                <button
                  onClick={() => scrollTo("#contact")}
                  className="w-full mt-2 px-4 py-3 bg-leaf-700 text-white text-sm font-medium rounded-xl text-center"
                >
                  contact us 
                </button>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
