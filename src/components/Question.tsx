"use client";

import { getSocket } from "@/config/socket";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Ranking from "./Ranking";
import ThemeToggle from "./ThemeToggle";
import Toast, { ToastType } from "./Toast";

interface RankingUser {
  name: string;
  score: number;
}

export default function Question() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isWaiting, setIsWaiting] = useState(true);
  const [user, setUser] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToast({ message, type });
  }, []);

  // Socket connection memoized
  const socket = useMemo(() => {
    const socket = getSocket();
    return socket.connect();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!answer.trim() || isWaiting) return;
    socket.emit("submit-answer", { answer: answer.trim(), userId: user });
    setAnswer("");
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user.trim()) {
      showToast("Please enter a name", "error");
      return;
    }
    const response = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.trim() }),
    });

    const userData = await response.json();
    if (userData.error) {
      showToast(userData.error || "Something went wrong", "error");
      return;
    }
    localStorage.setItem("username", JSON.stringify(userData.user.name));
    setShowPopup(false);
    setIsLogin(true);
    window.location.reload();
  };

  const updateRanking = async () => {
    const response = await fetch("/api/user");
    const json = await response.json();
    setRanking(json.user ?? []);
  };

  const handleLogout = () => {
    // Remove the username from localStorage
    localStorage.removeItem("username");

    // Clear user state and show the popup for login
    setUser("");
    setIsLogin(false);
    setShowPopup(true);
  };

  useEffect(() => {
    // Prevent scroll when popup is shown
    if (showPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Get stored username from localStorage
    const storedUser = JSON.parse(localStorage.getItem("username") || '""');
    if (storedUser !== "") {
      setUser(storedUser);
      setIsLogin(true);
    }

    // Listen for quiz questions and winner announcements
    socket.on("new-problem", (problem) => {
      setQuestion(problem?.question ?? "");
      setIsWaiting(problem?.answer === "__waiting__");
    });

    // Request current problem in case we missed the initial emit (race condition on connect)
    socket.emit("get-problem");

    socket.on("winner", ({ userId }) => {
      showToast(`Congratulations, ${userId} won! 🎉`, "success");
      updateRanking();
    });

    socket.on("wrong-answer", () => {
      showToast("Incorrect answer — try again!", "error");
    });

    // Load leaderboard on mount
    updateRanking();

    return () => {
      socket.off("new-problem");
      socket.off("winner");
      socket.off("wrong-answer");
      socket.disconnect();
      document.body.style.overflow = "auto";
    };
  }, [socket, showPopup, showToast]);

  return (
    <div
      className={`min-h-screen bg-background text-foreground ${
        showPopup ? "fixed inset-0" : ""
      }`}
    >
      <Toast
        message={toast?.message ?? ""}
        type={toast?.type ?? "info"}
        visible={!!toast}
        onClose={() => setToast(null)}
      />
      {!isLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-card-foreground">
              Welcome to the Quiz!
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">Enter your name to start competing.</p>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Enter your name"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="mb-4 w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                required
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
              >
                Start Quiz
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Quiz Time</h1>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground transition hover:bg-primary hover:text-primary-foreground"
            >
              Host / Admin
            </Link>
            <ThemeToggle />
          {isLogin && (
            <div className="flex items-center gap-4">
              <span className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
                Hello, {user}!
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground transition hover:bg-destructive hover:text-destructive-foreground"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        </header>

        <main className="mb-12">
          <div className="mb-8 rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">Question</h2>
            <p className="mb-6 text-2xl font-semibold text-foreground">
              {question || "Waiting for the host to begin..."}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={isWaiting}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-lg text-foreground placeholder:text-muted-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
                required={!isWaiting}
              />
              <button
                type="submit"
                disabled={isWaiting}
                className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isWaiting ? "Waiting for question..." : "Submit Answer"}
              </button>
            </form>
          </div>
        </main>
        <Ranking ranking={ranking} />
      </div>
    </div>
  );
}
