"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiMail, FiMessageCircle } from "react-icons/fi";
import { sendMessage } from "@/utils/actions";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await sendMessage(formState);

    await new Promise((resolve) => setTimeout(resolve, 700));

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-blue-600 mb-4">
              Get in touch
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-6">
              We&apos;d love to hear from you.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-10">
              Whether you have a question, feedback, or want to contribute, send
              us a message and we&apos;ll get back to you soon.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <FiMail size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Support</p>
                  <p className="text-sm text-gray-600">support@blogify.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <FiMessageCircle size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">General</p>
                  <p className="text-sm text-gray-600">hello@blogify.com</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-sm font-black text-white shadow-lg hover:bg-blue-700 transition-all"
              >
                Browse Articles
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-10">
            {submitted ? (
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-black text-gray-900">
                  Message sent!
                </h2>
                <p className="text-gray-600">
                  Thanks for reaching out — we&apos;ll respond as soon as
                  possible.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="inline-flex items-center justify-center rounded-full border border-blue-600 px-8 py-3 text-sm font-black text-blue-600 hover:bg-blue-50 transition-all"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-bold text-gray-700">
                      Name
                    </span>
                    <input
                      value={formState.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                      className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-bold text-gray-700">
                      Email
                    </span>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                      className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-sm font-bold text-gray-700">
                    Message
                  </span>
                  <textarea
                    value={formState.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    required
                    rows={5}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition resize-none"
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-lg hover:bg-blue-700 transition-all disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
