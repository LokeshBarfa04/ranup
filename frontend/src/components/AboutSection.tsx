"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const milestones = [
  { year: "1994", event: "Founded in Chhattisgarh as a family seed distribution business" },
  { year: "2002", event: "Received state-level certified seed dealer license" },
  { year: "2010", event: "Expanded portfolio to 100+ hybrid vegetable varieties" },
  { year: "2018", event: "Partnered with ICAR and national seed corporations" },
  { year: "2024", event: "Serving 50,000+ farmers across Central India" },
];

export default function AboutSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      id="about"
      className="py-28 px-6 bg-gradient-to-br from-leaf-900 via-leaf-800 to-leaf-900 relative overflow-hidden"
    >
      {/* Decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-leaf-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-leaf-500/30 to-transparent" />
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-seed-400/5 rounded-full blur-3xl" />
      <div className="absolute left-0 bottom-1/4 w-64 h-64 bg-leaf-500/10 rounded-full blur-3xl" />

      {/* Rotating botanical illustration */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none hidden lg:block">
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
          viewBox="0 0 200 200"
          width="400"
          height="400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <g key={angle} transform={`rotate(${angle}, 100, 100)`}>
              <path
                d="M100 10 Q120 55 100 100 Q80 55 100 10"
                fill="#b4d985"
              />
              <line
                x1="100" y1="10"
                x2="100" y2="100"
                stroke="#4d7d1a"
                strokeWidth="1"
              />
            </g>
          ))}
          <circle cx="100" cy="100" r="8" fill="#f5cf52" />
        </motion.svg>
      </div>

      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leaf-700/40 border border-leaf-500/30 mb-8">
              <span className="text-leaf-300 text-xs tracking-widest uppercase font-medium">
                Our Story
              </span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Rooted in India,{" "}
              <span className="text-gradient-gold">Growing</span>{" "}
              with Every Season
            </h2>

            <p className="text-leaf-200/80 text-lg leading-relaxed mb-6">
              Born in the heartland of Chhattisgarh, AgroSeeds was built on a
              simple belief: every farmer deserves access to the best genetics
              science can offer, at prices that make sense for real farms.
            </p>

            <p className="text-leaf-300/70 leading-relaxed mb-10">
              For three decades, we&apos;ve been the trusted partner for smallholder
              and commercial farmers alike — providing certified seeds backed by
              field trials, agronomic support, and relationships that outlast a
              single season.
            </p>

            {/* Values */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🔬", title: "Science-Backed", desc: "Field-trialed varieties" },
                { icon: "🌱", title: "Sustainable", desc: "Eco-first approach" },
                { icon: "🤝", title: "Farmer-First", desc: "Community rooted" },
                { icon: "✅", title: "Certified", desc: "ISI & ICAR approved" },
              ].map((v) => (
                <div
                  key={v.title}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-leaf-800/40 border border-leaf-600/20"
                >
                  <span className="text-2xl">{v.icon}</span>
                  <div>
                    <div className="text-white text-sm font-semibold">{v.title}</div>
                    <div className="text-leaf-300/70 text-xs">{v.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="font-display text-xl font-semibold text-leaf-200 mb-8">
              Our Journey
            </h3>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[18px] top-0 bottom-0 w-px bg-gradient-to-b from-seed-400/60 via-leaf-500/40 to-transparent" />

              <div className="space-y-6">
                {milestones.map((m, i) => (
                  <motion.div
                    key={m.year}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-5 pl-12 relative"
                  >
                    {/* Dot */}
                    <div className="absolute left-0 top-1 w-9 h-9 rounded-full bg-leaf-800 border-2 border-seed-400/60 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-seed-300" />
                    </div>

                    <div>
                      <span className="font-display text-seed-300 font-bold text-lg">
                        {m.year}
                      </span>
                      <p className="text-leaf-200/75 text-sm mt-0.5 leading-relaxed">
                        {m.event}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
