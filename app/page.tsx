"use client";

import { useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
} from "firebase/firestore";
import {
  Sparkles,
  History,
  LayoutDashboard,
  Brain,
  Send,
} from "lucide-react";

export default function Home() {
  const [note, setNote] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!note.trim() || loading) return;

    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });

      const data = await res.json();
      if (!res.ok) {
        setOutput(data.error || "Failed");
        return;
      }

      setOutput(data.text);

      await addDoc(collection(db, "summaries"), {
        note,
        summary: data.text,
        createdAt: new Date(),
      });
    } catch (error) {
      setOutput("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-900 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-blue-200/10 bg-blue-950/30 backdrop-blur-md p-6 hidden lg:flex lg:flex-col">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-linear-to-br from-blue-400 to-cyan-300 text-slate-950">
              <Brain size={20} className="font-bold" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">PrepMind</h1>
              <p className="text-xs text-zinc-500">AI Study Workspace</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2 text-sm flex-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-linear-to-r from-blue-500 to-cyan-400 text-slate-950 font-semibold shadow-lg hover:shadow-xl transition-shadow">
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <Link
            href="/history"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-400/10 text-zinc-300 transition-colors"
          >
            <History size={18} /> History
          </Link>
        </nav>

        <div className="rounded-2xl border border-blue-200/20 bg-linear-to-br from-blue-500/10 to-cyan-400/5 p-4 backdrop-blur-sm">
          <p className="text-sm font-semibold text-blue-200">PrepMind Pro ✦</p>
          <p className="text-xs text-zinc-400 mt-2">
            Unlock advanced summarization, unlimited storage, and analytics.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <section className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-4xl font-bold tracking-tight bg-linear-to-r from-blue-200 to-cyan-100 bg-clip-text text-transparent">
                Dashboard
              </h2>
              <p className="text-zinc-400 mt-2 text-lg">
                Transform your notes into revision-ready summaries with AI.
              </p>
            </div>
            <Link
              href="/history"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-blue-200/30 hover:bg-blue-400/10 text-sm font-medium transition-colors"
            >
              <History size={16} /> History
            </Link>
          </div>

          {/* Workspace */}
          <div className="grid xl:grid-cols-3 gap-6">
            <div className="xl:col-span-3 rounded-3xl border border-blue-200/20 bg-linear-to-br from-blue-950/50 to-slate-900/50 backdrop-blur-md p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-blue-400/20">
                  <Sparkles size={20} className="text-blue-300" />
                </div>
                <h3 className="text-2xl font-bold">Study Canvas</h3>
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Paste your lecture notes, concepts, or topics here..."
                className="w-full h-72 rounded-2xl bg-slate-800/50 border border-blue-200/20 p-5 outline-none resize-none focus:border-blue-300/50 focus:ring-2 focus:ring-blue-400/20 text-slate-100 placeholder-zinc-500 transition-all"
              />

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="mt-6 w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-linear-to-r from-blue-500 to-cyan-400 text-slate-950 font-semibold shadow-lg hover:shadow-xl hover:from-blue-400 hover:to-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Generate Summary
                  </>
                )}
              </button>

              <div className="mt-8">
                <p className="text-sm text-zinc-400 font-medium mb-3">Output</p>
                <div className="rounded-2xl border border-blue-200/20 bg-slate-800/30 p-6 min-h-64 max-h-96 overflow-y-auto whitespace-pre-wrap text-zinc-200 text-sm leading-relaxed">
                  {output || (
                    <span className="text-zinc-500">
                      Your AI-generated summary with key concepts and viva questions will appear here...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

