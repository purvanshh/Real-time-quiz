import React from "react";

interface RankingInterface {
  name: string;
  score: number;
}
const Ranking = ({ ranking }: { ranking: RankingInterface[] }) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold uppercase tracking-wider text-foreground">Leaderboard</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Rank</th>
              <th className="py-3 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</th>
              <th className="py-3 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Score</th>
            </tr>
          </thead>
          <tbody>
            {ranking.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-sm text-muted-foreground">
                  No scores yet — be the first!
                </td>
              </tr>
            ) : (
              ranking?.map((ele, i) => (
                <tr
                  key={ele.name}
                  className="border-b border-border last:border-b-0 transition hover:bg-muted/50"
                >
                  <td className="py-3 px-4">
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${i === 0 ? "bg-chart-4 text-foreground" : i === 1 ? "bg-muted text-muted-foreground" : i === 2 ? "bg-chart-2 text-white" : "bg-secondary text-secondary-foreground"}`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-foreground">{ele?.name}</td>
                  <td className="py-3 px-4 font-semibold text-foreground">{ele?.score}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ranking;
