"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  type Category, type SubCategory, type Product,
  getStoredData, saveData, resetData, DEFAULT_DATA,
} from "@/lib/ProductData";

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────
const nextId = () => Date.now() + Math.floor(Math.random() * 1000);

function genSlug(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

// ─────────────────────────────────────────────────────────────────
// LOGIN GATE
// ─────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const adminId = process.env.NEXT_PUBLIC_ADMIN_ID || "admin";
      const adminPw = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
      if (id === adminId && pw === adminPw) {
        sessionStorage.setItem("ranup_admin", "true");
        onLogin();
      } else {
        setError("Invalid credentials. Please try again.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-leaf-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-leaf-200">
            <span className="text-3xl">🌱</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-leaf-900">Admin Panel</h1>
          <p className="text-soil-400 text-sm mt-1">Sign in to manage products</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-leaf-100/40 p-8 space-y-5 border border-leaf-50">
          <div>
            <label className="block text-xs font-semibold text-soil-500 uppercase tracking-wider mb-1.5">Admin ID</label>
            <input
              value={id} onChange={(e) => setId(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-leaf-100 text-soil-700 focus:outline-none focus:ring-2 focus:ring-leaf-300 text-sm"
              placeholder="Enter admin ID"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-soil-500 uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password" value={pw} onChange={(e) => setPw(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-leaf-100 text-soil-700 focus:outline-none focus:ring-2 focus:ring-leaf-300 text-sm"
              placeholder="Enter password"
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-leaf-600 text-white font-semibold text-sm hover:bg-leaf-700 transition-colors disabled:opacity-60 shadow-md shadow-leaf-200">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-soil-400 mt-6">
          Set <code className="bg-leaf-50 px-1 rounded text-leaf-600">NEXT_PUBLIC_ADMIN_ID</code> and{" "}
          <code className="bg-leaf-50 px-1 rounded text-leaf-600">NEXT_PUBLIC_ADMIN_PASSWORD</code> in your <code>.env.local</code>
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN ADMIN PANEL
// ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [data, setData] = useState<Category[]>([]);

  // Active selections
  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const [activeSubId, setActiveSubId] = useState<string | null>(null);

  // Modals
  const [modal, setModal] = useState<
    | { type: "cat"; cat?: Category }
    | { type: "sub"; catId: string; sub?: SubCategory }
    | { type: "product"; catId: string; subId: string; product?: Product }
    | { type: "delete"; label: string; onConfirm: () => void }
    | null
  >(null);

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const ok = sessionStorage.getItem("ranup_admin") === "true";
    setAuthed(ok);
    setChecked(true);
  }, []);

  useEffect(() => {
    if (authed) setData(getStoredData());
  }, [authed]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const persist = (newData: Category[]) => {
    saveData(newData);
    setData(newData);
    showToast("Saved successfully!");
  };

  const logout = () => {
    sessionStorage.removeItem("ranup_admin");
    setAuthed(false);
  };

  if (!checked) return null;
  if (!authed) return <LoginPage onLogin={() => { setAuthed(true); setData(getStoredData()); }} />;

  const activeCategory = data.find((c) => c.id === activeCatId) ?? null;
  const activeSubCategory = activeCategory?.subCategories.find((s) => s.id === activeSubId) ?? null;

  // ── CRUD handlers ──

  // Category
  const saveCategory = (cat: Category, isNew: boolean) => {
    const newData = isNew ? [...data, cat] : data.map((c) => (c.id === cat.id ? cat : c));
    persist(newData);
    setModal(null);
  };
  const deleteCategory = (catId: string) => {
    persist(data.filter((c) => c.id !== catId));
    if (activeCatId === catId) { setActiveCatId(null); setActiveSubId(null); }
  };

  // Sub-category
  const saveSubCategory = (catId: string, sub: SubCategory, isNew: boolean) => {
    const newData = data.map((c) => {
      if (c.id !== catId) return c;
      return {
        ...c,
        subCategories: isNew
          ? [...c.subCategories, sub]
          : c.subCategories.map((s) => (s.id === sub.id ? sub : s)),
      };
    });
    persist(newData);
    setModal(null);
  };
  const deleteSubCategory = (catId: string, subId: string) => {
    const newData = data.map((c) => {
      if (c.id !== catId) return c;
      return { ...c, subCategories: c.subCategories.filter((s) => s.id !== subId) };
    });
    persist(newData);
    if (activeSubId === subId) setActiveSubId(null);
  };

  // Product
  const saveProduct = (catId: string, subId: string, product: Product, isNew: boolean) => {
    const newData = data.map((c) => {
      if (c.id !== catId) return c;
      return {
        ...c,
        subCategories: c.subCategories.map((s) => {
          if (s.id !== subId) return s;
          return {
            ...s,
            products: isNew
              ? [...s.products, product]
              : s.products.map((p) => (p.id === product.id ? product : p)),
          };
        }),
      };
    });
    persist(newData);
    setModal(null);
  };
  const deleteProduct = (catId: string, subId: string, productId: number) => {
    const newData = data.map((c) => {
      if (c.id !== catId) return c;
      return {
        ...c,
        subCategories: c.subCategories.map((s) => {
          if (s.id !== subId) return s;
          return { ...s, products: s.products.filter((p) => p.id !== productId) };
        }),
      };
    });
    persist(newData);
  };

  return (
    <div className="min-h-screen bg-leaf-50/30">
      {/* ── Top Bar ── */}
      <header className="bg-white border-b border-leaf-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-soil-400 hover:text-leaf-600 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </a>
            <div className="w-px h-5 bg-leaf-100" />
            <span className="text-2xl">🌱</span>
            <h1 className="font-display font-bold text-leaf-900 text-lg">Product Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setModal({ type: "delete", label: "reset all data to defaults", onConfirm: () => { resetData(); setData(DEFAULT_DATA); setActiveCatId(null); setActiveSubId(null); setModal(null); showToast("Reset to defaults."); } })}
              className="text-xs text-soil-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50">
              Reset to Defaults
            </button>
            <button onClick={logout}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-leaf-50 text-leaf-700 hover:bg-leaf-100 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">

          {/* ── Left Sidebar: Categories ── */}
          <aside className="col-span-12 md:col-span-3">
            <div className="bg-white rounded-2xl border border-leaf-100 overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-leaf-50 flex items-center justify-between">
                <h2 className="font-semibold text-sm text-leaf-900">Categories</h2>
                <button onClick={() => setModal({ type: "cat" })}
                  className="w-7 h-7 rounded-lg bg-leaf-600 text-white flex items-center justify-center hover:bg-leaf-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <ul className="divide-y divide-leaf-50">
                {data.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => { setActiveCatId(cat.id); setActiveSubId(null); }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-leaf-50 transition-colors group ${activeCatId === cat.id ? "bg-leaf-50" : ""}`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-soil-700 truncate">{cat.label}</p>
                        <p className="text-[10px] text-soil-400">{cat.subCategories.length} sub-categories</p>
                      </div>
                      <div className="hidden group-hover:flex items-center gap-1">
                        <IconBtn icon="edit" onClick={(e) => { e.stopPropagation(); setModal({ type: "cat", cat }); }} />
                        <IconBtn icon="delete" onClick={(e) => { e.stopPropagation(); setModal({ type: "delete", label: `category "${cat.label}"`, onConfirm: () => { deleteCategory(cat.id); setModal(null); } }); }} danger />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ── Middle: Sub-categories ── */}
          <div className="col-span-12 md:col-span-4">
            {activeCategory ? (
              <div className="bg-white rounded-2xl border border-leaf-100 overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-leaf-50 flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-sm text-leaf-900">{activeCategory.label}</h2>
                    <p className="text-[10px] text-soil-400">Sub-categories</p>
                  </div>
                  <button onClick={() => setModal({ type: "sub", catId: activeCategory.id })}
                    className="w-7 h-7 rounded-lg bg-leaf-600 text-white flex items-center justify-center hover:bg-leaf-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <ul className="divide-y divide-leaf-50">
                  {activeCategory.subCategories.map((sub) => (
                    <li key={sub.id}>
                      <button
                        onClick={() => setActiveSubId(sub.id)}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-leaf-50 transition-colors group ${activeSubId === sub.id ? "bg-leaf-50" : ""}`}
                      >
                        <span className="text-xl">{sub.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-soil-700 truncate">{sub.label}</p>
                          <p className="text-[10px] text-soil-400">{sub.products.length} products</p>
                        </div>
                        <div className="hidden group-hover:flex items-center gap-1">
                          <IconBtn icon="edit" onClick={(e) => { e.stopPropagation(); setModal({ type: "sub", catId: activeCategory.id, sub }); }} />
                          <IconBtn icon="delete" onClick={(e) => { e.stopPropagation(); setModal({ type: "delete", label: `sub-category "${sub.label}"`, onConfirm: () => { deleteSubCategory(activeCategory.id, sub.id); setModal(null); } }); }} danger />
                        </div>
                      </button>
                    </li>
                  ))}
                  {activeCategory.subCategories.length === 0 && (
                    <li className="px-4 py-6 text-center text-xs text-soil-400">No sub-categories yet</li>
                  )}
                </ul>
              </div>
            ) : (
              <EmptyPane label="Select a category to manage sub-categories" />
            )}
          </div>

          {/* ── Right: Products ── */}
          <div className="col-span-12 md:col-span-5">
            {activeSubCategory && activeCategory ? (
              <div className="bg-white rounded-2xl border border-leaf-100 overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-leaf-50 flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-sm text-leaf-900">{activeSubCategory.label}</h2>
                    <p className="text-[10px] text-soil-400">Products</p>
                  </div>
                  <button onClick={() => setModal({ type: "product", catId: activeCategory.id, subId: activeSubCategory.id })}
                    className="w-7 h-7 rounded-lg bg-leaf-600 text-white flex items-center justify-center hover:bg-leaf-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <ul className="divide-y divide-leaf-50 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {activeSubCategory.products.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-leaf-50 group transition-colors">
                      {/* Thumbnail */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-leaf-50 border border-leaf-100">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">🌱</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-soil-700 truncate">{p.name}</p>
                        <p className="text-[10px] text-soil-400 truncate">{p.variety}</p>
                      </div>
                      <div className="hidden group-hover:flex items-center gap-1">
                        <IconBtn icon="edit" onClick={() => setModal({ type: "product", catId: activeCategory.id, subId: activeSubCategory.id, product: p })} />
                        <IconBtn icon="delete" onClick={() => setModal({ type: "delete", label: `product "${p.name}"`, onConfirm: () => { deleteProduct(activeCategory.id, activeSubCategory.id, p.id); setModal(null); } })} danger />
                      </div>
                    </li>
                  ))}
                  {activeSubCategory.products.length === 0 && (
                    <li className="px-4 py-6 text-center text-xs text-soil-400">No products yet</li>
                  )}
                </ul>
              </div>
            ) : (
              <EmptyPane label="Select a sub-category to manage products" />
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {modal?.type === "cat" && (
        <CategoryModal
          cat={modal.cat}
          onSave={(cat, isNew) => saveCategory(cat, isNew)}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "sub" && (
        <SubCategoryModal
          catId={modal.catId}
          sub={modal.sub}
          onSave={(catId, sub, isNew) => saveSubCategory(catId, sub, isNew)}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "product" && (
        <ProductFormModal
          catId={modal.catId}
          subId={modal.subId}
          product={modal.product}
          onSave={(catId, subId, product, isNew) => saveProduct(catId, subId, product, isNew)}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "delete" && (
        <ConfirmModal
          label={modal.label}
          onConfirm={modal.onConfirm}
          onClose={() => setModal(null)}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] bg-leaf-700 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium animate-fade-in">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// CATEGORY MODAL
// ─────────────────────────────────────────────────────────────────
function CategoryModal({ cat, onSave, onClose }: { cat?: Category; onSave: (cat: Category, isNew: boolean) => void; onClose: () => void }) {
  const [label, setLabel] = useState(cat?.label ?? "");
  const [tagline, setTagline] = useState(cat?.tagline ?? "");
  const [icon, setIcon] = useState(cat?.icon ?? "🌿");
  const [accent, setAccent] = useState(cat?.accent ?? "#4d7d1a");

  const handleSave = () => {
    if (!label.trim()) return;
    const isNew = !cat;
    onSave({ id: cat?.id ?? genSlug(label), label, tagline, icon, accent, subCategories: cat?.subCategories ?? [] }, isNew);
  };

  return (
    <ModalShell title={cat ? "Edit Category" : "Add Category"} onClose={onClose}>
      <div className="space-y-4">
        <Field label="Category Name" required>
          <input value={label} onChange={(e) => setLabel(e.target.value)} className={inputCls} placeholder="e.g. Vegetable Seeds" />
        </Field>
        <Field label="Tagline">
          <input value={tagline} onChange={(e) => setTagline(e.target.value)} className={inputCls} placeholder="e.g. Certified F1 hybrids…" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Icon (emoji)">
            <input value={icon} onChange={(e) => setIcon(e.target.value)} className={inputCls} maxLength={4} />
          </Field>
          <Field label="Accent Colour">
            <div className="flex gap-2">
              <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="w-12 h-10 rounded-lg border border-leaf-100 cursor-pointer p-1" />
              <input value={accent} onChange={(e) => setAccent(e.target.value)} className={`${inputCls} flex-1`} />
            </div>
          </Field>
        </div>
        <SaveBar onSave={handleSave} onClose={onClose} />
      </div>
    </ModalShell>
  );
}

// ─────────────────────────────────────────────────────────────────
// SUB-CATEGORY MODAL
// ─────────────────────────────────────────────────────────────────
function SubCategoryModal({ catId, sub, onSave, onClose }: { catId: string; sub?: SubCategory; onSave: (catId: string, sub: SubCategory, isNew: boolean) => void; onClose: () => void }) {
  const [label, setLabel] = useState(sub?.label ?? "");
  const [icon, setIcon] = useState(sub?.icon ?? "🌿");
  const [description, setDescription] = useState(sub?.description ?? "");

  const handleSave = () => {
    if (!label.trim()) return;
    const isNew = !sub;
    onSave(catId, { id: sub?.id ?? genSlug(label), label, icon, description, products: sub?.products ?? [] }, isNew);
  };

  return (
    <ModalShell title={sub ? "Edit Sub-Category" : "Add Sub-Category"} onClose={onClose}>
      <div className="space-y-4">
        <Field label="Name" required>
          <input value={label} onChange={(e) => setLabel(e.target.value)} className={inputCls} placeholder="e.g. Tomato" />
        </Field>
        <Field label="Icon (emoji)">
          <input value={icon} onChange={(e) => setIcon(e.target.value)} className={inputCls} maxLength={4} />
        </Field>
        <Field label="Description">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputCls} resize-none`} rows={2} placeholder="Brief description…" />
        </Field>
        <SaveBar onSave={handleSave} onClose={onClose} />
      </div>
    </ModalShell>
  );
}

// ─────────────────────────────────────────────────────────────────
// PRODUCT FORM MODAL
// ─────────────────────────────────────────────────────────────────
function ProductFormModal({ catId, subId, product, onSave, onClose }: {
  catId: string; subId: string; product?: Product;
  onSave: (catId: string, subId: string, product: Product, isNew: boolean) => void;
  onClose: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"basic" | "details" | "instructions">("basic");

  const [image, setImage] = useState(product?.image ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const [variety, setVariety] = useState(product?.variety ?? "");
  const [shortDesc, setShortDesc] = useState(product?.shortDesc ?? "");
  const [fullDesc, setFullDesc] = useState(product?.fullDesc ?? "");
  const [germination, setGermination] = useState(product?.germination ?? "");
  const [npkRatio, setNpkRatio] = useState(product?.npkRatio ?? "");
  const [season, setSeason] = useState(product?.season ?? "");
  const [maturity, setMaturity] = useState(product?.maturity ?? "");
  const [seedRate, setSeedRate] = useState(product?.seedRate ?? "");
  const [dosage, setDosage] = useState(product?.dosage ?? "");
  const [packagingSizes, setPackagingSizes] = useState(product?.packagingSizes.join(", ") ?? "");
  const [suitableCrops, setSuitableCrops] = useState(product?.suitableCrops.join(", ") ?? "");
  const [tags, setTags] = useState(product?.tags.join(", ") ?? "");
  const [keyBenefits, setKeyBenefits] = useState(product?.keyBenefits.join("\n") ?? "");
  const [sowingInstructions, setSowingInstructions] = useState(product?.sowingInstructions ?? "");
  const [applicationMethod, setApplicationMethod] = useState(product?.applicationMethod ?? "");

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setImage(base64);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const isNew = !product;
    const p: Product = {
      id: product?.id ?? nextId(),
      name, variety, image,
      shortDesc, fullDesc,
      germination: germination || undefined,
      npkRatio: npkRatio || undefined,
      season: season || undefined,
      maturity: maturity || undefined,
      seedRate: seedRate || undefined,
      dosage: dosage || undefined,
      packagingSizes: packagingSizes.split(",").map((s) => s.trim()).filter(Boolean),
      suitableCrops: suitableCrops.split(",").map((s) => s.trim()).filter(Boolean),
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
      keyBenefits: keyBenefits.split("\n").map((s) => s.trim()).filter(Boolean),
      sowingInstructions: sowingInstructions || undefined,
      applicationMethod: applicationMethod || undefined,
    };
    onSave(catId, subId, p, isNew);
  };

  const TABS = [
    { id: "basic", label: "Basic Info" },
    { id: "details", label: "Details" },
    { id: "instructions", label: "Instructions" },
  ] as const;

  return (
    <ModalShell title={product ? "Edit Product" : "Add Product"} onClose={onClose} wide>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-leaf-50 rounded-xl p-1">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-all ${tab === t.id ? "bg-white text-leaf-700 shadow-sm" : "text-soil-500 hover:text-soil-700"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {tab === "basic" && (
          <>
            {/* Image upload */}
            <Field label="Product Image">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-leaf-50 border border-leaf-100 flex-shrink-0 flex items-center justify-center">
                  {image ? (
                    <img src={image} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">🌱</span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => fileRef.current?.click()}
                    className="px-4 py-2 rounded-xl border border-leaf-200 text-xs font-semibold text-leaf-700 hover:bg-leaf-50 transition-colors">
                    Upload Image
                  </button>
                  {image && (
                    <button onClick={() => setImage("")}
                      className="px-4 py-2 rounded-xl border border-red-100 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors">
                      Remove
                    </button>
                  )}
                  <p className="text-[10px] text-soil-400">JPG or PNG. Stored as base64.</p>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Product Name" required>
                <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="e.g. Arka Rakshak F1" />
              </Field>
              <Field label="Variety / Type">
                <input value={variety} onChange={(e) => setVariety(e.target.value)} className={inputCls} placeholder="e.g. Indeterminate · Round" />
              </Field>
            </div>
            <Field label="Short Description">
              <input value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} className={inputCls} placeholder="1-line summary shown on card" />
            </Field>
            <Field label="Full Description">
              <textarea value={fullDesc} onChange={(e) => setFullDesc(e.target.value)} className={`${inputCls} resize-none`} rows={3} placeholder="Detailed product description for modal…" />
            </Field>
            <Field label="Tags (comma-separated)">
              <input value={tags} onChange={(e) => setTags(e.target.value)} className={inputCls} placeholder="e.g. F1 Hybrid, High Yield, Export Quality" />
            </Field>
          </>
        )}

        {tab === "details" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Germination %">
                <input value={germination} onChange={(e) => setGermination(e.target.value)} className={inputCls} placeholder="e.g. 94%" />
              </Field>
              <Field label="NPK Ratio">
                <input value={npkRatio} onChange={(e) => setNpkRatio(e.target.value)} className={inputCls} placeholder="e.g. 19 : 19 : 19" />
              </Field>
              <Field label="Season">
                <input value={season} onChange={(e) => setSeason(e.target.value)} className={inputCls} placeholder="e.g. Kharif · Rabi" />
              </Field>
              <Field label="Maturity">
                <input value={maturity} onChange={(e) => setMaturity(e.target.value)} className={inputCls} placeholder="e.g. 65–70 days" />
              </Field>
              <Field label="Seed Rate">
                <input value={seedRate} onChange={(e) => setSeedRate(e.target.value)} className={inputCls} placeholder="e.g. 150–200 g/acre" />
              </Field>
              <Field label="Dosage">
                <input value={dosage} onChange={(e) => setDosage(e.target.value)} className={inputCls} placeholder="e.g. 3–5 g/litre" />
              </Field>
            </div>
            <Field label="Packaging Sizes (comma-separated)">
              <input value={packagingSizes} onChange={(e) => setPackagingSizes(e.target.value)} className={inputCls} placeholder="e.g. 10 g, 50 g, 100 g" />
            </Field>
            <Field label="Suitable Crops / Uses (comma-separated)">
              <input value={suitableCrops} onChange={(e) => setSuitableCrops(e.target.value)} className={inputCls} placeholder="e.g. Open field, Polyhouse" />
            </Field>
            <Field label="Key Benefits (one per line)">
              <textarea value={keyBenefits} onChange={(e) => setKeyBenefits(e.target.value)} className={`${inputCls} resize-none`} rows={4} placeholder={"Resistant to ToLCV\nYield potential 60–80 t/ha"} />
            </Field>
          </>
        )}

        {tab === "instructions" && (
          <>
            <Field label="Sowing Instructions (for seeds)">
              <textarea value={sowingInstructions} onChange={(e) => setSowingInstructions(e.target.value)} className={`${inputCls} resize-none`} rows={4} placeholder="Transplant 25-day seedlings at 60 × 45 cm…" />
            </Field>
            <Field label="Application Method (for fertilizers)">
              <textarea value={applicationMethod} onChange={(e) => setApplicationMethod(e.target.value)} className={`${inputCls} resize-none`} rows={4} placeholder="Dissolve in water before applying through drip…" />
            </Field>
          </>
        )}
      </div>

      <div className="mt-6">
        <SaveBar onSave={handleSave} onClose={onClose} saveLabel={product ? "Save Changes" : "Add Product"} />
      </div>
    </ModalShell>
  );
}

// ─────────────────────────────────────────────────────────────────
// CONFIRM DELETE MODAL
// ─────────────────────────────────────────────────────────────────
function ConfirmModal({ label, onConfirm, onClose }: { label: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <ModalShell title="Confirm Delete" onClose={onClose}>
      <p className="text-sm text-soil-600 mb-6">
        Are you sure you want to delete <strong>{label}</strong>? This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-leaf-100 text-sm text-soil-600 font-medium hover:bg-leaf-50 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">
          Delete
        </button>
      </div>
    </ModalShell>
  );
}

// ─────────────────────────────────────────────────────────────────
// SHARED UI PRIMITIVES
// ─────────────────────────────────────────────────────────────────
function ModalShell({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className={`relative bg-white rounded-3xl shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-leaf-50 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
          <h3 className="font-display font-bold text-leaf-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-leaf-50 flex items-center justify-center text-soil-400 hover:text-soil-700 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-soil-500 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

function SaveBar({ onSave, onClose, saveLabel = "Save" }: { onSave: () => void; onClose: () => void; saveLabel?: string }) {
  return (
    <div className="flex gap-3 pt-2">
      <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-leaf-100 text-sm text-soil-600 font-medium hover:bg-leaf-50 transition-colors">
        Cancel
      </button>
      <button onClick={onSave} className="flex-1 py-2.5 rounded-xl bg-leaf-600 text-white text-sm font-semibold hover:bg-leaf-700 transition-colors shadow-md shadow-leaf-200">
        {saveLabel}
      </button>
    </div>
  );
}

function IconBtn({ icon, onClick, danger }: { icon: "edit" | "delete"; onClick: (e: React.MouseEvent) => void; danger?: boolean }) {
  return (
    <button onClick={onClick}
      className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${danger ? "hover:bg-red-50 text-soil-400 hover:text-red-500" : "hover:bg-leaf-50 text-soil-400 hover:text-leaf-600"}`}>
      {icon === "edit" ? (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )}
    </button>
  );
}

function EmptyPane({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-2xl border border-leaf-100 h-48 flex items-center justify-center shadow-sm">
      <p className="text-sm text-soil-300 text-center px-6">{label}</p>
    </div>
  );
}

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-leaf-100 text-sm text-soil-700 focus:outline-none focus:ring-2 focus:ring-leaf-300 transition-all";