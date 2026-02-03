import { formatDuration } from "../../../../hooks/utils/time";
import { Crown } from "lucide-react";

function PodiumCard({ rank, user, score, duration }) {
  const isWinner = rank === 1;

  return (
    <div
      className={`flex flex-col items-center justify-end rounded-xl border border-border bg-bg p-4 shadow-sm
        ${isWinner ? "scale-110" : "opacity-90"}
      `}
    >
      {isWinner && (
        <Crown className="mb-2 text-yellow-400" size={28} />
      )}

      <div className="text-lg font-semibold text-text">
        #{rank}
      </div>

      <div className="mt-2 text-sm font-medium text-text">
        {user.userName}
      </div>

      <div className="text-xs text-text/60">
        {user.email}
      </div>

      <div className="mt-3 text-sm text-text">
        Score: <span className="font-semibold">{score}</span>
      </div>

      <div className="text-xs text-text/60">
        Time: {formatDuration(duration)}
      </div>
    </div>
  );
}

function TopThreePodium({ leaderboard }) {
  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="mb-8 grid grid-cols-3 gap-6 items-end">
      {/* 2nd */}
      {topThree[1] && (
        <PodiumCard
          rank={2}
          {...topThree[1]}
        />
      )}

      {/* 1st */}
      {topThree[0] && (
        <PodiumCard
          rank={1}
          {...topThree[0]}
        />
      )}

      {/* 3rd */}
      {topThree[2] && (
        <PodiumCard
          rank={3}
          {...topThree[2]}
        />
      )}
    </div>
  );
}

export default TopThreePodium;
