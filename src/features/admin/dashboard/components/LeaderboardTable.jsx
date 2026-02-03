import { formatDuration } from "../../../../hooks/utils/time";

function LeaderboardTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border text-text/70">
          <tr>
            <th className="py-2">Rank</th>
            <th>User</th>
            <th>Score</th>
            <th>Duration</th>
          </tr>
        </thead>

        <tbody>
          {data.slice(0,8).map((row, i) => (
            <tr
              key={i}
              className="border-b border-border/50"
            >
              <td className="py-2 font-medium">
                {i + 1}
              </td>
              <td>
                <div className="font-medium">
                  {row.userName}
                </div>
                <div className="text-xs text-text/60">
                  {row.email}
                </div>
              </td>
              <td className="font-semibold">
                {row.score}
              </td>
              <td className="text-text/70">
                {(row.duration / 60000).toFixed(2)} min
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default LeaderboardTable;
