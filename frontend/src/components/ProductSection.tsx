"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { type Category, type SubCategory, type Product, getStoredData } from "@/lib/ProductData";

const PRODUCTS_PER_PAGE = 3;

// ─────────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────────
export default function ProductsSection() {
  const [data, setData] = useState<Category[]>([]);
  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const [activeSubId, setActiveSubId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);

  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  // Load data & listen for admin updates
  useEffect(() => {
    setData(getStoredData());
    const handler = () => setData(getStoredData());
    window.addEventListener("ranup-products-updated", handler);
    return () => window.removeEventListener("ranup-products-updated", handler);
  }, []);

  const activeCategory = data.find((c) => c.id === activeCatId) ?? null;
  const activeSubCategory = activeCategory?.subCategories.find((s) => s.id === activeSubId) ?? null;

  // Reset visible count when sub-category changes
  useEffect(() => { setVisibleCount(PRODUCTS_PER_PAGE); }, [activeSubId]);

  const goBack = () => {
    if (activeSubId) setActiveSubId(null);
    else setActiveCatId(null);
  };

  if (!data.length) return null;

  return (
    <>
      <section id="products" className="py-28 px-6 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-leaf-50/40 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-seed-100/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">

          {/* Header */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="divider-leaf mb-6 max-w-xs mx-auto">
              <span className="text-leaf-500 text-xs tracking-widest uppercase font-medium px-4">
                Our Products
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-leaf-900 mb-4">
              What We Offer
            </h2>
            <p className="text-soil-500 text-lg max-w-xl mx-auto leading-relaxed">
              Choose a category to explore our complete range of seeds and fertilizers.
            </p>
          </motion.div>

          {/* Breadcrumb */}
          <AnimatePresence>
            {activeCatId && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-sm text-soil-400 mb-8 flex-wrap"
              >
                <button onClick={() => { setActiveCatId(null); setActiveSubId(null); }} className="hover:text-leaf-600 transition-colors">
                  Products
                </button>
                <span>/</span>
                <button
                  onClick={() => setActiveSubId(null)}
                  className={`transition-colors ${activeSubId ? "hover:text-leaf-600" : "text-leaf-700 font-medium pointer-events-none"}`}
                >
                  {activeCategory?.label}
                </button>
                {activeSubId && (
                  <>
                    <span>/</span>
                    <span className="text-leaf-700 font-medium">{activeSubCategory?.label}</span>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── LEVEL 1: Categories ── */}
          <AnimatePresence mode="wait">
            {!activeCatId && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
              >
                {data.map((cat, i) => (
                  <CategoryCard key={cat.id} category={cat} index={i} onClick={() => setActiveCatId(cat.id)} />
                ))}
              </motion.div>
            )}

            {/* ── LEVEL 2: Sub-Categories ── */}
            {activeCatId && !activeSubId && activeCategory && (
              <motion.div
                key="subcategories"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                <BackButton onClick={goBack} label="Back to Categories" />
                <div className="inline-flex items-center gap-3 mb-10 px-5 py-3 rounded-2xl" style={{ background: `${activeCategory.accent}12` }}>
                  <span className="text-2xl">{activeCategory.icon}</span>
                  <div>
                    <h3 className="font-display text-xl font-bold" style={{ color: activeCategory.accent }}>{activeCategory.label}</h3>
                    <p className="text-xs text-soil-400">{activeCategory.tagline}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {activeCategory.subCategories.map((sub, i) => (
                    <SubCategoryCard key={sub.id} sub={sub} accent={activeCategory.accent} index={i} onClick={() => setActiveSubId(sub.id)} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── LEVEL 3: Products ── */}
            {activeSubId && activeSubCategory && activeCategory && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                <BackButton onClick={goBack} label={`Back to ${activeCategory.label}`} />
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-3xl">{activeSubCategory.icon}</span>
                    <h3 className="font-display text-2xl font-bold" style={{ color: activeCategory.accent }}>
                      {activeSubCategory.label}
                    </h3>
                  </div>
                  <p className="text-soil-400 text-sm ml-12">{activeSubCategory.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeSubCategory.products.slice(0, visibleCount).map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      accent={activeCategory.accent}
                      index={i}
                      onClick={() => setSelectedProduct(product)}
                    />
                  ))}
                </div>

                {/* View More */}
                {activeSubCategory.products.length > visibleCount && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-10 text-center"
                  >
                    <button
                      onClick={() => setVisibleCount((v) => v + PRODUCTS_PER_PAGE)}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border-2 font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                      style={{ borderColor: activeCategory.accent, color: activeCategory.accent }}
                    >
                      View More Products
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <p className="text-xs text-soil-400 mt-2">
                      Showing {Math.min(visibleCount, activeSubCategory.products.length)} of {activeSubCategory.products.length} products
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── LEVEL 4: Product Modal ── */}
      <AnimatePresence>
        {selectedProduct && activeCategory && (
          <ProductModal
            product={selectedProduct}
            accent={activeCategory.accent}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// CATEGORY CARD
// ─────────────────────────────────────────────────────────────────
function CategoryCard({ category, index, onClick }: { category: Category; index: number; onClick: () => void }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const totalProducts = category.subCategories.reduce((acc, s) => acc + s.products.length, 0);

  return (
    <motion.button
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="group text-left w-full bg-white rounded-3xl border border-leaf-100 hover:border-transparent hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden focus:outline-none focus:ring-2 focus:ring-leaf-300"
    >
      <div className="h-2" style={{ background: `linear-gradient(to right, ${category.accent}50, ${category.accent})` }} />
      <div className="p-8">
        <div className="flex items-start justify-between mb-6">
          <span className="text-5xl">{category.icon}</span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: `${category.accent}15`, color: category.accent }}>
            {category.subCategories.length} categories
          </span>
        </div>
        <h3 className="font-display text-2xl font-bold mb-2 group-hover:translate-x-1 transition-transform" style={{ color: category.accent }}>
          {category.label}
        </h3>
        <p className="text-soil-400 text-sm leading-relaxed mb-6">{category.tagline}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {category.subCategories.map((s) => (
            <span key={s.id} className="text-xs px-2.5 py-1 rounded-full border font-medium text-soil-500"
              style={{ borderColor: `${category.accent}30`, background: `${category.accent}08` }}>
              {s.icon} {s.label}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-5 border-t" style={{ borderColor: `${category.accent}20` }}>
          <span className="text-xs text-soil-400">{totalProducts} products</span>
          <span className="text-sm font-semibold flex items-center gap-1.5 group-hover:gap-3 transition-all" style={{ color: category.accent }}>
            Explore
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────
// SUB-CATEGORY CARD
// ─────────────────────────────────────────────────────────────────
function SubCategoryCard({ sub, accent, index, onClick }: { sub: SubCategory; accent: string; index: number; onClick: () => void }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.button
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="group text-left w-full bg-white rounded-2xl border border-leaf-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-400 overflow-hidden focus:outline-none focus:ring-2 focus:ring-leaf-300"
    >
      <div className="h-1" style={{ background: `linear-gradient(to right, ${accent}40, ${accent})` }} />
      <div className="p-6">
        <span className="text-3xl mb-3 block">{sub.icon}</span>
        <h4 className="font-display text-lg font-bold mb-1.5" style={{ color: accent }}>{sub.label}</h4>
        <p className="text-xs text-soil-400 leading-relaxed mb-5">{sub.description}</p>
        <div className="flex items-center justify-between pt-4 border-t border-leaf-50">
          <span className="text-xs text-soil-400">{sub.products.length} products</span>
          <span className="text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: accent }}>
            View Products
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────────
function ProductCard({ product, accent, index, onClick }: { product: Product; accent: string; index: number; onClick: () => void }) {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <motion.button
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="group text-left w-full bg-white rounded-2xl border border-leaf-100 hover:shadow-xl hover:border-transparent hover:-translate-y-1 transition-all duration-400 overflow-hidden focus:outline-none focus:ring-2 focus:ring-leaf-300"
    >
      {/* Product Image */}
      <div className="relative w-full h-44 overflow-hidden bg-leaf-50">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1"
            style={{ background: `linear-gradient(135deg, ${accent}10, ${accent}20)` }}>
            <span className="text-5xl">{product.variety.includes("Tomato") ? "🍅" : product.variety.includes("Brinjal") ? "🍆" : "🌱"}</span>
            <span className="text-[10px] text-soil-400 font-medium">No image added</span>
          </div>
        )}
        {/* Tag badge */}
        {product.tags[0] && (
          <span className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full text-white shadow-sm"
            style={{ background: accent }}>
            {product.tags[0]}
          </span>
        )}
      </div>

      <div className="p-5">
        <h4 className="font-display text-base font-bold mb-0.5" style={{ color: accent }}>{product.name}</h4>
        <p className="text-[11px] text-soil-400 mb-3">{product.variety}</p>
        <p className="text-xs text-soil-500 leading-relaxed mb-4 line-clamp-2">{product.shortDesc}</p>

        {/* Stats */}
        <div className="flex gap-4 mb-4">
          {product.germination && (
            <div>
              <p className="text-sm font-bold" style={{ color: accent }}>{product.germination}</p>
              <p className="text-[10px] text-soil-400">germination</p>
            </div>
          )}
          {product.npkRatio && (
            <div>
              <p className="text-sm font-bold" style={{ color: accent }}>{product.npkRatio}</p>
              <p className="text-[10px] text-soil-400">NPK</p>
            </div>
          )}
          {(product.maturity || product.dosage) && (
            <>
              <div className="w-px bg-leaf-100" />
              <div>
                <p className="text-xs font-semibold text-soil-700">{product.maturity ?? product.dosage}</p>
                <p className="text-[10px] text-soil-400">{product.maturity ? "maturity" : "dosage"}</p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-leaf-50">
          <span className="text-xs text-soil-400">{product.packagingSizes.join(" · ")}</span>
          <span className="text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: accent }}>
            Full Info
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────
// PRODUCT MODAL
// ─────────────────────────────────────────────────────────────────
function ProductModal({ product, accent, onClose }: { product: Product; accent: string; onClose: () => void }) {
  const stats = [
    product.germination && { label: "Germination", value: product.germination },
    product.npkRatio && { label: "NPK / Content", value: product.npkRatio },
    product.season && { label: "Season", value: product.season },
    product.maturity && { label: "Maturity", value: product.maturity },
    product.seedRate && { label: "Seed Rate", value: product.seedRate },
    product.dosage && { label: "Dosage", value: product.dosage },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-leaf-900/40 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full sm:max-w-2xl max-h-[92vh] sm:rounded-3xl rounded-t-3xl overflow-y-auto shadow-2xl"
      >
        {/* Image hero */}
        <div className="relative w-full h-52 overflow-hidden rounded-t-3xl">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${accent}15, ${accent}30)` }}>
              <span className="text-7xl opacity-60">🌱</span>
            </div>
          )}
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${accent}60, transparent)` }} />
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-soil-600 hover:text-soil-900 transition-colors shadow-md">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-6">
            <h2 className="font-display text-2xl font-bold text-white leading-tight drop-shadow">{product.name}</h2>
            <p className="text-white/80 text-sm mt-0.5">{product.variety}</p>
          </div>
        </div>

        <div className="px-7 py-6 space-y-7">
          {/* Quick Stats */}
          {stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl p-3.5 text-center" style={{ background: `${accent}10` }}>
                  <p className="text-sm font-bold leading-tight" style={{ color: accent }}>{stat.value}</p>
                  <p className="text-[11px] text-soil-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          <div>
            <h4 className="text-xs font-semibold text-soil-400 uppercase tracking-wider mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="text-xs px-3 py-1 rounded-full border font-medium"
                  style={{ background: `${accent}10`, color: accent, borderColor: `${accent}30` }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs font-semibold text-soil-400 uppercase tracking-wider mb-2">About This Product</h4>
            <p className="text-soil-600 text-sm leading-relaxed">{product.fullDesc}</p>
          </div>

          {/* Key Benefits */}
          <div>
            <h4 className="text-xs font-semibold text-soil-400 uppercase tracking-wider mb-3">Key Benefits</h4>
            <ul className="space-y-2">
              {product.keyBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-soil-600">
                  <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold"
                    style={{ background: accent }}>✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Suitable For + Packaging */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <h4 className="text-xs font-semibold text-soil-400 uppercase tracking-wider mb-2">Suitable For</h4>
              <ul className="space-y-1">
                {product.suitableCrops.map((c) => (
                  <li key={c} className="text-sm text-soil-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-soil-400 uppercase tracking-wider mb-2">Packaging Available</h4>
              <div className="flex flex-wrap gap-2">
                {product.packagingSizes.map((size) => (
                  <span key={size} className="text-xs px-3 py-1.5 rounded-xl border font-medium text-soil-600"
                    style={{ borderColor: `${accent}40`, background: `${accent}08` }}>
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Instructions */}
          {(product.sowingInstructions || product.applicationMethod) && (
            <div className="rounded-2xl p-5" style={{ background: `${accent}08` }}>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: accent }}>
                {product.sowingInstructions ? "🌱 Sowing Instructions" : "💧 Application Method"}
              </h4>
              <p className="text-sm text-soil-600 leading-relaxed">
                {product.sowingInstructions ?? product.applicationMethod}
              </p>
            </div>
          )}

          {/* CTA */}
          <a href="#contact" onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${accent}cc, ${accent})` }}>
            Enquire About This Product
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// BACK BUTTON
// ─────────────────────────────────────────────────────────────────
function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-2 text-sm text-soil-500 hover:text-leaf-700 font-medium mb-8 group transition-colors">
      <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </button>
  );
}