"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import {
  History,
  LayoutDashboard,
  Brain,
  ArrowLeft,
  Trash2,
} from "lucide-react";

interface SummaryItem {
  id: string;
  note: string;
  summary: string;
  createdAt: Timestamp;
}

export default function HistoryPage() {
  const [data, setData] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "summaries"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        const summaries = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SummaryItem[];

        setData(summaries);
      } catch (error) {
        console.error("Error fetching summaries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-400/10 text-zinc-300 transition-colors"
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/20 text-blue-300 font-semibold transition-colors text-left">
            <History size={18} /> History
          </button>
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-6 mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors w-fit"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>

            <div>
              <h2 className="text-4xl font-bold tracking-tight bg-linear-to-r from-blue-200 to-cyan-100 bg-clip-text text-transparent">
                Knowledge Vault
              </h2>
              <p className="text-zinc-400 mt-2 text-lg">
                All your saved summaries and notes
              </p>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                <p className="text-zinc-400">Loading summaries...</p>
              </div>
            </div>
          ) : data.length === 0 ? (
            <div className="rounded-3xl border border-blue-200/20 bg-linear-to-br from-blue-950/50 to-slate-900/50 backdrop-blur-md p-12 text-center">
              <p className="text-zinc-400 text-lg mb-4">No summaries yet</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-blue-500 to-cyan-400 text-slate-950 font-semibold hover:shadow-lg transition-all"
              >
                Create your first summary
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-blue-200/20 bg-linear-to-br from-blue-950/50 to-slate-900/50 backdrop-blur-md p-6 hover:from-blue-950/70 hover:to-slate-900/70 transition-all group"
                >
                  {/* Header with date */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-xs text-zinc-500 font-medium">
                        {item.createdAt?.toDate?.().toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }) ?? "Recently"}
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        {item.createdAt?.toDate?.().toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }) ?? ""}
                      </p>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Original note preview */}
                  <div className="mb-4 pb-4 border-b border-blue-200/10">
                    <p className="text-xs text-zinc-500 font-medium mb-2">
                      Original Notes
                    </p>
                    <p className="text-sm text-zinc-300 line-clamp-2">
                      {item.note}
                    </p>
                  </div>

                  {/* Summary */}
                  <div>
                    <p className="text-xs text-zinc-500 font-medium mb-3">
                      Summary & Viva Questions
                    </p>
                    <div className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto pr-2">
                      {item.summary}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
