"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const seeds = [
  {
    id: 1,
    name: "Paddy (Rice)",
    variety: "MTU 1010 · IR 64 · Swarna",
    description:
      "High-yielding certified paddy seeds with excellent disease resistance. Suited for both kharif and rabi seasons across diverse soil types.",
    icon: "🌾",
    color: "from-amber-50 to-yellow-50",
    accent: "#c8950e",
    tags: ["High Yield", "Disease Resistant", "Certified"],
    germination: "96%",
    season: "Kharif · Rabi",
  },
  {
    id: 2,
    name: "Wheat",
    variety: "HD 3086 · GW 322 · HI 8498",
    description:
      "Premium bread and durum wheat varieties with superior protein content, robust stalk strength, and tolerance to terminal heat stress.",
    icon: "🌿",
    color: "from-amber-50 to-orange-50",
    accent: "#a86b28",
    tags: ["Premium Quality", "Heat Tolerant", "High Protein"],
    germination: "97%",
    season: "Rabi",
  },
  {
    id: 3,
    name: "Hybrid Vegetables",
    variety: "Tomato · Brinjal · Capsicum · Cucumber",
    description:
      "F1 hybrid vegetable seeds delivering uniform fruit quality, extended shelf life, and exceptional market-grade produce for commercial growers.",
    icon: "🥦",
    color: "from-green-50 to-emerald-50",
    accent: "#4d7d1a",
    tags: ["F1 Hybrid", "Uniform Quality", "High Value"],
    germination: "94%",
    season: "Year Round",
  },
  {
    id: 4,
    name: "Pulses",
    variety: "Soybean · Chickpea · Lentil · Moong",
    description:
      "Nitrogen-fixing pulse varieties that enhance soil fertility while delivering strong yields. Ideal for crop rotation and sustainable farming.",
    icon: "🫘",
    color: "from-lime-50 to-green-50",
    accent: "#3a6012",
    tags: ["Soil Enriching", "Drought Tolerant", "Sustainable"],
    germination: "95%",
    season: "Kharif · Rabi",
  },
  {
    id: 5,
    name: "Oilseeds",
    variety: "Mustard · Groundnut · Sunflower",
    description:
      "High oil-content varieties with strong stalk support and resistance to common foliar diseases. Favored by processors for consistent quality.",
    icon: "🌻",
    color: "from-yellow-50 to-amber-50",
    accent: "#c8950e",
    tags: ["High Oil Content", "Disease Resistant", "Commercial"],
    germination: "93%",
    season: "Rabi · Summer",
  },
  {
    id: 6,
    name: "Maize (Corn)",
    variety: "Single Cross · Triple Cross Hybrids",
    description:
      "Vigorous single-cross and triple-cross hybrids for grain, fodder, and starch use. Delivers consistent performance under irrigation and rainfed conditions.",
    icon: "🌽",
    color: "from-yellow-50 to-lime-50",
    accent: "#6a9e2e",
    tags: ["Dual Purpose", "Vigorous Growth", "High Starch"],
    germination: "98%",
    season: "Kharif · Rabi",
  },
  {
    id: 6,
    name: "Maize (Corn)",
    variety: "Single Cross · Triple Cross Hybrids",
    description:
      "Vigorous single-cross and triple-cross hybrids for grain, fodder, and starch use. Delivers consistent performance under irrigation and rainfed conditions.",
    icon: "🌽",
    color: "from-yellow-50 to-lime-50",
    accent: "#6a9e2e",
    tags: ["Dual Purpose", "Vigorous Growth", "High Starch"],
    germination: "98%",
    season: "Kharif · Rabi",
  }
];

export default function SeedsSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="seeds" className="py-28 px-6 bg-cream relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-leaf-50/60 to-transparent pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-seed-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="divider-leaf mb-6 max-w-xs mx-auto">
            <span className="text-leaf-500 text-xs tracking-widest uppercase font-medium px-4">
              Our Catalog
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-leaf-900 mb-4">
            Crops We Serve
          </h2>
          <p className="text-soil-500 text-lg max-w-2xl mx-auto leading-relaxed">
            From paddy fields to kitchen gardens, our certified seed portfolio
            covers the full breadth of Indian agriculture.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seeds.map((seed, i) => (
            <SeedCard key={seed.id} seed={seed} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SeedCard({
  seed,
  index,
}: {
  seed: (typeof seeds)[0];
  index: number;
}) {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white rounded-3xl overflow-hidden border border-leaf-100 hover:border-leaf-200 transition-all duration-500 hover:shadow-xl hover:shadow-leaf-100/60 hover:-translate-y-1"
    >
      {/* Color accent bar */}
      <div
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(to right, ${seed.accent}40, ${seed.accent})` }}
      />

      <div className="p-7">
        {/* Icon + name */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-4xl mb-2 block">{seed.icon}</span>
            <h3 className="font-display text-xl font-bold text-leaf-900 leading-tight">
              {seed.name}
            </h3>
            <p className="text-xs text-soil-400 font-medium mt-0.5">{seed.variety}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: `${seed.accent}18`, color: seed.accent }}
            >
              {seed.germination}
            </div>
            <span className="text-[10px] text-soil-400">germination</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-soil-500 text-sm leading-relaxed mb-5 line-clamp-3">
          {seed.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {seed.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-1 rounded-full bg-leaf-50 text-leaf-600 border border-leaf-100 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-leaf-50">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-leaf-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-soil-400">{seed.season}</span>
          </div>
          <button className="text-xs text-leaf-600 font-medium hover:text-leaf-700 flex items-center gap-1 group/btn">
            Enquire
            <svg className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
