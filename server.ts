import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT as string, 10) || 3000;
const ADMIN_SECRET = process.env.ADMIN_SECRET || "admin123";

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

interface questionInterface {
  question: string;
  answer: string;
  type?: "text" | "multiple_choice";
  options?: string[];
}

const WAITING_PROBLEM: questionInterface = {
  question: "Waiting for the next question from the host...",
  answer: "__waiting__",
};

let currentProblem: questionInterface = WAITING_PROBLEM;
let solved = false;

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  // main connection
  io.on("connection", (socket) => {
    socket.emit("new-problem", currentProblem);

    // Allow client to request current problem (fixes race where listener isn't ready yet)
    socket.on("get-problem", () => {
      socket.emit("new-problem", currentProblem);
    });

    // Admin: launch a new question to all participants
    socket.on("launch-question", ({ question, answer, adminSecret, type, options }) => {
      if (adminSecret !== ADMIN_SECRET) {
        socket.emit("launch-error", { message: "Invalid admin password" });
        return;
      }
      if (!question?.trim() || !answer?.trim()) {
        socket.emit("launch-error", { message: "Question and answer are required" });
        return;
      }
      if (type === "multiple_choice" && (!options || options.length < 2)) {
        socket.emit("launch-error", { message: "Multiple choice requires at least 2 options" });
        return;
      }
      solved = false;
      currentProblem = {
        question: question.trim(),
        answer: answer.trim(),
        type: type || "text",
        options: type === "multiple_choice" ? options!.map((o: string) => o.trim()).filter(Boolean) : undefined,
      };
      io.emit("new-problem", currentProblem);
      socket.emit("launch-success", { message: "Question launched to all participants!" });
    });

    // Admin: start new competition (reset all scores to zero)
    socket.on("start-new-competition", async ({ adminSecret }) => {
      if (adminSecret !== ADMIN_SECRET) {
        socket.emit("launch-error", { message: "Invalid admin password" });
        return;
      }
      try {
        await prisma.user.updateMany({ data: { score: 0 } });
        io.emit("scores-reset");
        socket.emit("launch-success", { message: "New competition started! All scores reset to zero." });
      } catch (err) {
        socket.emit("launch-error", { message: "Failed to reset scores" });
      }
    });

    // Admin: get live session stats
    socket.on("get-stats", ({ adminSecret }) => {
      if (adminSecret !== ADMIN_SECRET) return;
      socket.emit("stats", {
        participantCount: io.sockets.sockets.size,
        currentQuestion: currentProblem.answer === "__waiting__" ? null : currentProblem.question,
      });
    });

    socket.on("submit-answer", async ({ answer, userId }) => {
      const trimmedAnswer = String(answer ?? "").trim();
      if (!trimmedAnswer || !userId) return;

      // Don't accept answers when waiting for admin
      if (currentProblem.answer === "__waiting__") return;

      if (!solved && trimmedAnswer.toLowerCase() === currentProblem.answer.toLowerCase()) {
        solved = true;
        await declareWinner(userId);

        io.emit("winner", { userId });

        setTimeout(() => {
          solved = false;
          currentProblem = WAITING_PROBLEM;
          io.emit("new-problem", currentProblem);
        }, 2000);
      } else if (!solved) {
        socket.emit("wrong-answer");
      }
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

async function declareWinner(userId: string) {
  try {
    await prisma.user.upsert({
      where: { name: userId },
      create: { name: userId, score: 1 },
      update: { score: { increment: 1 } },
    });
  } catch (err) {
    console.error("Error updating winner score:", err);
  }
}
