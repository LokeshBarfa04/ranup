"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

// Particle system for floating seeds/pollen
function SeedParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; hue: number; type: number;
    }> = [];

    const count = 60;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.6 + 0.2),
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.4 + 0.1,
        hue: Math.random() > 0.6 ? 40 : 100,
        type: Math.floor(Math.random() * 3),
      });
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.opacity;

        if (p.type === 0) {
          // Oval seed
          ctx.fillStyle = `hsl(${p.hue}, 60%, 45%)`;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size * 1.5, p.size * 0.7, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 1) {
          // Circle pollen
          ctx.fillStyle = `hsl(${p.hue}, 70%, 60%)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Leaf shape
          ctx.fillStyle = `hsl(100, 50%, 35%)`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - p.size);
          ctx.quadraticCurveTo(p.x + p.size * 1.5, p.y, p.x, p.y + p.size);
          ctx.quadraticCurveTo(p.x - p.size * 1.5, p.y, p.x, p.y - p.size);
          ctx.fill();
        }

        ctx.restore();

        p.x += p.vx + Math.sin(Date.now() * 0.001 + p.y * 0.01) * 0.2;
        p.y += p.vy;

        if (p.y < -20) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-leaf-900 via-leaf-800 to-soil-900" />
      <div className="absolute inset-0 bg-mesh opacity-60" />

      {/* Decorative circles */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-leaf-700/10 blur-3xl" />
      <div className="absolute bottom-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-seed-400/8 blur-3xl" />

      {/* Particles */}
      <SeedParticles />

      {/* Decorative ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="w-[700px] h-[700px] rounded-full border border-leaf-600/20 border-dashed"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute w-[900px] h-[900px] rounded-full border border-seed-400/10 border-dashed"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leaf-700/30 border border-leaf-500/30 backdrop-blur-sm mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-seed-300 animate-pulse" />
          <span className="text-leaf-200 text-xs font-medium tracking-widest uppercase">
            Premium Agricultural Seeds
          </span>
        </motion.div> */}

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-6"
        >
          Seeds of a{" "}
          <em className="not-italic text-gradient-gold">Better</em>
          <br />
          Tomorrow
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-leaf-200/80 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >

          Driving agricultural innovation through advanced seed research and in-house development.
           We specialize in high-performance vegetable seeds designed for better yield, resilience, and farmer success.

          Three decades of agronomic excellence. Supplying India&apos;s finest
          certified seeds for paddy, wheat, vegetables, and pulses — from field
          to a bountiful harvest.

        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => scrollToSection("seeds")}
            className="group px-8 py-4 bg-seed-400 hover:bg-seed-300 text-leaf-900 font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-seed-900/30 hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
          >

            Explore Seeds & Fertilizers
            Explore Seeds

            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="px-8 py-4 border border-leaf-400/40 text-leaf-100 hover:bg-leaf-700/30 font-medium rounded-2xl transition-all duration-300 backdrop-blur-sm"
          >
            Contact Us
          </button>
        </motion.div>

        {/* Stats */}

        {/* <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { value: "30+", label: "Years Experience" },
            { value: "200+", label: "Seed Varieties" },
            { value: "50k+", label: "Happy Farmers" },
            { value: "98%", label: "Germination Rate" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <span className="font-display text-3xl font-bold text-seed-300">
                {stat.value}
              </span>
              <span className="text-leaf-300/70 text-xs font-medium text-center">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div> */}

      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-leaf-400/60 text-[10px] tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-leaf-400/30 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-leaf-400/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
