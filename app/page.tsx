"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import {
  Sparkles,
  History,
  LayoutDashboard,
  FileText,
  BarChart3,
  Brain,
} from "lucide-react";

interface SummaryItem {
  id: string;
  note: string;
  summary: string;
  createdAt: any;
}

export default function Home() {
  const [note, setNote] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<SummaryItem[]>([]);

  const stats = useMemo(() => {
    const totalSummaries = recent.length;
    const totalWords = recent.reduce(
      (acc, item) => acc + (item.summary?.split(/\s+/).length || 0),
      0
    );
    return { totalSummaries, totalWords };
  }, [recent]);

  useEffect(() => {
    const fetchRecent = async () => {
      const q = query(
        collection(db, "summaries"),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const snap = await getDocs(q);
      setRecent(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SummaryItem)));
    };

    fetchRecent();
  }, [output]);

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
    <main className="min-h-screen bg-radial-gradient(circle_at_top_right,_#1e3a8a_0%,_#0b1120_35%,_#060816_100%)] text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-blue-200/10 bg-blue-950/20 backdrop-blur-xl p-6 hidden lg:flex lg:flex-col">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-2xl bg-white/10 border border-blue-200/10">
              <Brain size={20} />
            </div>
            <div>
              <h1 className="font-semibold text-lg tracking-tight">PrepMind</h1>
              <p className="text-xs text-zinc-400">AI Study Workspace</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2 text-sm">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-linear-to-r from-blue-400 to-cyan-300 text-slate-950 font-medium">
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <Link
            href="/history"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 text-zinc-300"
          >
            <History size={18} /> History
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 text-zinc-300">
            <FileText size={18} /> New Summary
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 text-zinc-300">
            <BarChart3 size={18} /> Analytics
          </button>
        </nav>

        <div className="mt-auto rounded-3xl border border-blue-200/10 bg-linear-to-br from-white/10 to-transparent p-4">
          <p className="text-sm font-medium">PrepMind Pro ✦</p>
          <p className="text-xs text-zinc-400 mt-1">
            A dark-blue glassmorphism command center designed like a premium AI productivity suite with its own distinct visual language.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <section className="flex-1 p-6 lg:p-8 relative before:absolute before:top-10 before:right-10 before:h-72 before:w-72 before:rounded-full before:bg-blue-400/10 before:blur-3xl before:content-[''] after:absolute after:bottom-10 after:left-10 after:h-64 after:w-64 after:rounded-full after:bg-cyan-300/10 after:blur-3xl after:content-['']">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Dashboard</h2>
            <p className="text-zinc-400 mt-1">
              A focused AI study operating system for transforming lecture notes into revision-ready intelligence.
            </p>
          </div>
          <Link
            href="/history"
            className="px-4 py-2 rounded-2xl border border-blue-200/10 hover:bg-white/5 text-sm"
          >
            Open History
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-3xl border border-blue-200/10 bg-white/6 backdrop-blur-2xl p-5">
            <p className="text-sm text-zinc-400">Summaries</p>
            <h3 className="text-3xl font-semibold mt-2">{stats.totalSummaries}</h3>
          </div>
          <div className="rounded-3xl border border-blue-200/10 bg-white/6 backdrop-blur-2xl p-5">
            <p className="text-sm text-zinc-400">Words Generated</p>
            <h3 className="text-3xl font-semibold mt-2">{stats.totalWords}</h3>
          </div>
          <div className="rounded-3xl border border-blue-200/10 bg-white/6 backdrop-blur-2xl p-5">
            <p className="text-sm text-zinc-400">Recent Activity</p>
            <h3 className="text-lg font-semibold mt-2">Live syncing</h3>
          </div>
        </div>

        {/* Workspace */}
        <div className="grid xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 rounded-4xl border border-blue-200/10 bg-linear-to-br from-blue-950/40 to-slate-900/40 backdrop-blur-2xl p-6 shadow-2xl ring-1 ring-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-zinc-300" />
              <h3 className="text-xl font-semibold">Study Canvas</h3>
            </div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Paste DBMS / OS / viva notes here..."
              className="w-full h-72 rounded-3xl bg-blue-950/30 border border-blue-200/10 p-5 outline-none resize-none focus:border-white/20"
            />

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-4 px-6 py-3 rounded-2xl bg-white text-black font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Summary"}
            </button>

            <div className="mt-6 rounded-3xl border border-blue-200/10 bg-blue-950/20 p-5 min-h-60 whitespace-pre-wrap text-zinc-200">
              {output || "Your structured brief, key concepts, and viva-ready questions render here in a clean document-style canvas."}
            </div>
          </div>

          {/* Recent history panel */}
          <div className="rounded-[28px] border border-blue-200/10 bg-white/6 backdrop-blur-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Knowledge Vault</h3>
              <Link href="/history" className="text-xs text-zinc-400 hover:text-slate-100">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {recent.length === 0 ? (
                <p className="text-sm text-zinc-500">No summaries yet.</p>
              ) : (
                recent.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-blue-200/10 bg-blue-950/20 p-4"
                  >
                    <p className="text-sm line-clamp-4 text-zinc-300">
                      {item.summary}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
