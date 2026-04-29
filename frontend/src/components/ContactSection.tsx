"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface FormState {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim() || form.name.trim().length < 2)
    errors.name = "Please enter your full name (min 2 characters)";
  const digits = form.phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15)
    errors.phone = "Enter a valid phone number";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address";
  if (!form.message.trim() || form.message.trim().length < 10)
    errors.message = "Message must be at least 10 characters";
  return errors;
}

export default function ContactSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverMessage, setServerMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name]) {
      setErrors(validate(updated));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ name: true, phone: true, email: true, message: true });
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setStatus("loading");
    setServerMessage("");

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setServerMessage(data.message || "Your message was sent successfully!");
        setForm({ name: "", phone: "", email: "", message: "" });
        setTouched({});
      } else {
        setStatus("error");
        setServerMessage(
          data.detail ||
            "Something went wrong. Please try again or contact us directly."
        );
      }
    } catch {
      setStatus("error");
      setServerMessage(
        "Unable to reach the server. Please check your connection and try again."
      );
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setServerMessage("");
  };

  return (
    <section
      id="contact"
      className="py-28 px-6 bg-cream relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-leaf-200 to-transparent" />
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-leaf-100/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-seed-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="divider-leaf mb-6 max-w-xs mx-auto">
            <span className="text-leaf-500 text-xs tracking-widest uppercase font-medium px-4">
              contact us
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-leaf-900 mb-4">
            Let&apos;s Talk Farming
          </h2>
          <p className="text-soil-500 text-lg max-w-xl mx-auto leading-relaxed">
            Have a question about seeds, pricing, or availability? Drop us a
            message and we&apos;ll respond within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Contact info sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="p-7 bg-gradient-to-br from-leaf-800 to-leaf-900 rounded-3xl text-white">
              <h3 className="font-display text-2xl font-bold mb-2">
                Ranup Crop Care
              </h3>
              <p className="text-leaf-300/80 text-sm leading-relaxed mb-8">
                Trusted by farmers across India and international markets for high-quality agricultural solutions since 2024.
              </p>

              <div className="space-y-5">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    ),
                    label: "Phone / WhatsApp",
                    value: "+91 7587525025",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    ),
                    label: "Email",
                    value: "info.ranupcrop@gmail.com",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    ),
                    label: "Address",
                    value: "NARANBHAI SHANKERBHA,PATEL,NR.SAHJANAND SOC, ASLALI, AHMEDABAD, DASKROI, GUJARAT,382427",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    label: "Business Hours",
                    value: "Mon–Sun, 9 AM – 9 PM",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-leaf-700/50 flex items-center justify-center text-seed-300 shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-leaf-400/70 text-xs mb-0.5">{item.label}</p>
                      <p className="text-white/90 text-sm font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp quick link */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917879936069"}?text=Hello%2C%20I%20want%20to%20enquire%20about%20your%20seeds`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 rounded-2xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center text-white shrink-0">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div>
                <p className="text-leaf-800 font-semibold text-sm">Chat on WhatsApp</p>
                <p className="text-soil-500 text-xs">Usually replies within minutes</p>
              </div>
              <svg
                className="w-4 h-4 text-leaf-400 ml-auto group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-leaf-100 p-8 md:p-10 shadow-xl shadow-leaf-100/20">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 rounded-full bg-leaf-50 border-2 border-leaf-200 flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-leaf-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-leaf-900 mb-3">
                      Message Received!
                    </h3>
                    <p className="text-soil-500 leading-relaxed max-w-sm mx-auto mb-8">
                      {serverMessage}
                    </p>
                    <button
                      onClick={resetForm}
                      className="px-6 py-2.5 border border-leaf-200 text-leaf-700 hover:bg-leaf-50 rounded-xl text-sm font-medium transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-5"
                  >
                    <div>
                      <h3 className="font-display text-2xl font-bold text-leaf-900 mb-1">
                        Send Us a Message
                      </h3>
                      <p className="text-soil-400 text-sm">
                        All fields are required. We&apos;ll reply within 24 hours.
                      </p>
                    </div>

                    {/* Error banner */}
                    <AnimatePresence>
                      {status === "error" && serverMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
                        >
                          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                          </svg>
                          <span>{serverMessage}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Name + Phone row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField
                        label="Full Name"
                        name="name"
                        type="text"
                        placeholder="e.g., RANUP CROP CARE"
                        value={form.name}
                        error={touched.name ? errors.name : undefined}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="name"
                      />
                      <FormField
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        placeholder="e.g., +91 7587525025"
                        value={form.phone}
                        error={touched.phone ? errors.phone : undefined}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="tel"
                      />
                    </div>

                    <FormField
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="e.g., info.ranupcrop@gmail.com"
                      value={form.email}
                      error={touched.email ? errors.email : undefined}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="email"
                    />

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-soil-700">
                        Message
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        placeholder="Tell us about your crop, land size, region, or any specific queries about seeds…"
                        value={form.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`form-input resize-none ${
                          touched.message && errors.message
                            ? "border-red-300 bg-red-50/30"
                            : ""
                        }`}
                      />
                      {touched.message && errors.message && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full py-4 bg-leaf-700 hover:bg-leaf-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-leaf-200/60 hover:-translate-y-0.5 flex items-center justify-center gap-3"
                    >
                      {status === "loading" ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending Message…
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                          </svg>
                        </>
                      )}
                    </button>

                    <p className="text-xs text-soil-400 text-center">
                      We respect your privacy and will never share your information.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FormField({
  label,
  name,
  type,
  placeholder,
  value,
  error,
  onChange,
  onBlur,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-soil-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        className={`form-input ${error ? "border-red-300 bg-red-50/30" : ""}`}
      />
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
