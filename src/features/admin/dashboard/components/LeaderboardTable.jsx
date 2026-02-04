// import { formatDuration } from "../../../../hooks/utils/time";

function LeaderboardTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border text-text/70">
          <tr className=" text-text/70">
            <th className="py-2 text-center">Rank</th>
            <th className="text-left pl-25">User</th>
            <th className="text-left">Score</th>
            <th className="text-left">Duration</th>
          </tr>
        </thead>

        <tbody>
          {data.filter((row)=>row.userName!=="Deleted User").slice(0,8).map((row, i) => (
            <tr
              key={i}
              className="border-b border-border/50 hover:bg-bg/50 transition"
            >
              <td className="py-2 font-medium ml-5 text-center">
                {i + 1}
              </td>
              <td>
                <div className="font-medium text-left pl-25">
                  {row.userName}
                </div>
                <div className="text-sm text-text/60 text-left pl-25">
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
