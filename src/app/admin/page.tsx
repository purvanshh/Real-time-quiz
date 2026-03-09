"use client";

import { getSocket } from "@/config/socket";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import Toast, { ToastType } from "@/components/Toast";

const OPTION_LETTERS = ["A", "B", "C", "D"];

export default function AdminPage() {
  const [adminSecret, setAdminSecret] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionType, setQuestionType] = useState<"text" | "multiple_choice">("text");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [participantCount, setParticipantCount] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToast({ message, type });
  }, []);

  const socket = useMemo(() => {
    const s = getSocket();
    return s.connect();
  }, []);

  useEffect(() => {
    socket.on("launch-success", ({ message }: { message: string }) => {
      showToast(message, "success");
      setQuestion("");
      setAnswer("");
    });

    socket.on("launch-error", ({ message }: { message: string }) => {
      showToast(message, "error");
    });

    socket.on("stats", ({ participantCount: count, currentQuestion: q }: { participantCount: number; currentQuestion: string | null }) => {
      setParticipantCount(count);
      setCurrentQuestion(q);
    });

    return () => {
      socket.off("launch-success");
      socket.off("launch-error");
      socket.off("stats");
    };
  }, [socket, showToast]);

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminSecret.trim()) {
      showToast("Enter admin password", "error");
      return;
    }
    if (!question.trim() || !answer.trim()) {
      showToast("Question and answer are required", "error");
      return;
    }
    socket.emit("launch-question", {
      question: question.trim(),
      answer: answer.trim(),
      adminSecret: adminSecret.trim(),
    });
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminSecret.trim()) {
      showToast("Enter admin password", "error");
      return;
    }
    setIsAuthenticated(true);
  };

  useEffect(() => {
    if (!isAuthenticated || !adminSecret.trim()) return;
    socket.emit("get-stats", { adminSecret: adminSecret.trim() });
    const interval = setInterval(() => {
      socket.emit("get-stats", { adminSecret: adminSecret.trim() });
    }, 3000);
    return () => clearInterval(interval);
  }, [socket, isAuthenticated, adminSecret]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Toast
          message={toast?.message ?? ""}
          type={toast?.type ?? "info"}
          visible={!!toast}
          onClose={() => setToast(null)}
        />
        <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-card-foreground">Admin Access</h1>
            <p className="mb-6 text-sm text-muted-foreground">Enter the admin password to launch questions.</p>
            <form onSubmit={handleAuth}>
              <input
                type="password"
                placeholder="Admin password"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                className="mb-4 w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                required
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
              >
                Enter Admin Panel
              </button>
            </form>
            <Link
              href="/"
              className="mt-4 block text-center text-sm text-muted-foreground underline hover:text-foreground"
            >
              ← Back to Quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toast
        message={toast?.message ?? ""}
        type={toast?.type ?? "info"}
        visible={!!toast}
        onClose={() => setToast(null)}
      />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Admin — Live Quiz Host</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground transition hover:bg-primary hover:text-primary-foreground"
            >
              View Quiz →
            </Link>
          </div>
        </header>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold uppercase tracking-wider text-foreground">Live Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Participants connected</span>
                <span className="text-2xl font-bold text-primary">{participantCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current question</span>
                <span className="max-w-[200px] truncate text-right text-sm">
                  {currentQuestion || "Waiting..."}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold uppercase tracking-wider text-foreground">Launch Question</h2>
            <form onSubmit={handleLaunch} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">Question</label>
                <textarea
                  placeholder="e.g. What is the capital of France?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">Correct Answer</label>
                <input
                  type="text"
                  placeholder="e.g. Paris"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
              >
                Launch to All Participants
              </button>
            </form>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Questions are sent to all participants instantly. When someone answers correctly, the next question slot opens — launch another question when ready.
        </p>
      </div>
    </div>
  );
};
