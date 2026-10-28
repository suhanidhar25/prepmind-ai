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
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

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
        setOutput(data.error || "Failed to generate summary");
        setLoading(false);
        return;
      }

      setOutput(data.text);
      setLoading(false);

      addDoc(collection(db, "summaries"), {
        note,
        summary: data.text,
        createdAt: new Date(),
      }).catch((error) => {
        console.error("Error saving to database:", error);
      });
    } catch (error) {
      console.error("Error:", error);
      setOutput("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-black via-zinc-950 to-black text-zinc-100 flex overflow-hidden">
      {/* Animated background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-400/6 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Sidebar */}
      <aside className="w-72 border-r border-yellow-400/10 bg-zinc-950/70 backdrop-blur-md p-6 hidden lg:flex lg:flex-col relative z-10">
        <div className="mb-10 animate-float-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-linear-to-br from-yellow-400 to-yellow-300 text-black shadow-lg shadow-yellow-400/20">
              <Brain size={20} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-zinc-100">PrepMind</h1>
              <p className="text-xs text-zinc-500">AI Study Workspace</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2 text-sm flex-1 animate-slide-in-left">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-linear-to-r from-yellow-500 to-yellow-400 text-black font-semibold shadow-lg hover:shadow-xl hover:shadow-yellow-400/20 transition-all duration-200 hover:scale-105 active:scale-95">
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <Link
            href="/history"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-yellow-400/10 text-zinc-400 hover:text-zinc-100 transition-all duration-200 hover:translate-x-1"
          >
            <History size={18} /> History
          </Link>
        </nav>

        <Card className="animate-glow-pulse bg-linear-to-br from-yellow-500/10 to-yellow-400/5 border-yellow-400/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-yellow-400" />
              <p className="text-sm font-semibold text-yellow-300">PrepMind Pro</p>
            </div>
            <p className="text-xs text-zinc-400">
              Unlock advanced summarization, unlimited storage, and analytics.
            </p>
          </CardContent>
        </Card>
      </aside>

      {/* Main content */}
      <section className="flex-1 p-6 lg:p-8 overflow-auto relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 animate-fade-in">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text mb-2">
                Study Canvas
              </h2>
              <p className="text-zinc-400 text-lg max-w-xl">
                Transform your lecture notes into revision-ready summaries with AI-powered insights.
              </p>
            </div>
            <Link
              href="/history"
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-yellow-400/20 hover:bg-yellow-400/10 text-sm font-medium transition-colors"
            >
              <History size={16} /> History
            </Link>
          </div>

          {/* Main workspace grid */}
          <div className="grid xl:grid-cols-3 gap-6 animate-float-up">
            {/* Input Card */}
            <Card className="xl:col-span-2 shadow-2xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-yellow-400/15 shadow-md">
                    <Sparkles size={20} className="text-yellow-400" />
                  </div>
                  <div>
                    <CardTitle>Paste Your Notes</CardTitle>
                    <CardDescription>Enter lecture notes, concepts, or topics for AI analysis</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Paste your lecture notes, concepts, or topics here..."
                  className="w-full h-80 rounded-xl bg-zinc-900/80 border border-yellow-400/15 p-5 outline-none resize-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/15 text-zinc-100 placeholder-zinc-600 transition-all duration-200 font-mono text-sm leading-relaxed"
                />

                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={handleGenerate}
                    disabled={loading || !note.trim()}
                    variant="premium"
                    size="lg"
                    className="flex-1 min-w-fit"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Generate Summary</span>
                      </>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setNote("")}
                    disabled={!note.trim()}
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="shadow-2xl h-fit animate-slide-in-right">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-yellow-500/8 border border-yellow-400/15">
                    <p className="text-xs text-zinc-500 uppercase tracking-wide">Characters</p>
                    <p className="text-2xl font-bold text-yellow-300">{note.length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-400/8 border border-yellow-400/10">
                    <p className="text-xs text-zinc-500 uppercase tracking-wide">Words</p>
                    <p className="text-2xl font-bold text-yellow-200">{note.trim().split(/\s+/).filter(w => w).length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-800/60 border border-zinc-700/40">
                    <p className="text-xs text-zinc-500 uppercase tracking-wide">Status</p>
                    <Badge variant={note.trim() ? "success" : "secondary"} className="mt-1">
                      {note.trim() ? "Ready" : "Empty"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Output Card */}
          <Card className="shadow-2xl animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-yellow-400/15 shadow-md">
                    <Zap size={20} className="text-yellow-400" />
                  </div>
                  <div>
                    <CardTitle>AI-Generated Summary</CardTitle>
                    <CardDescription>Your revision-ready summary with key concepts and insights</CardDescription>
                  </div>
                </div>
                {output && (
                  <Badge variant="success" className="animate-float-up">
                    Complete
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-yellow-400/10 bg-zinc-900/50 p-6 min-h-64 max-h-96 overflow-y-auto">
                {output ? (
                  <div className="whitespace-pre-wrap text-zinc-200 text-sm leading-relaxed font-mono animate-float-up">
                    {output}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Sparkles size={32} className="text-zinc-700 mx-auto mb-3" />
                      <p className="text-zinc-500 text-sm">
                        Your AI-generated summary will appear here...
                      </p>
                      <p className="text-zinc-600 text-xs mt-2">
                        Add notes and click &quot;Generate Summary&quot; to begin
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-8 animate-fade-in">
            <Card className="hover:shadow-xl hover:border-yellow-400/30 transition-all cursor-pointer">
              <CardContent className="pt-6">
                <Sparkles size={24} className="text-yellow-400 mb-3" />
                <h3 className="font-semibold text-zinc-100 mb-1">AI Powered</h3>
                <p className="text-xs text-zinc-500">Advanced summarization using state-of-the-art AI</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl hover:border-yellow-400/30 transition-all cursor-pointer">
              <CardContent className="pt-6">
                <Zap size={24} className="text-yellow-400 mb-3" />
                <h3 className="font-semibold text-zinc-100 mb-1">Lightning Fast</h3>
                <p className="text-xs text-zinc-500">Get summaries in seconds, not minutes</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl hover:border-yellow-400/30 transition-all cursor-pointer">
              <CardContent className="pt-6">
                <History size={24} className="text-yellow-400 mb-3" />
                <h3 className="font-semibold text-zinc-100 mb-1">Full History</h3>
                <p className="text-xs text-zinc-500">Access all your previous summaries anytime</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
