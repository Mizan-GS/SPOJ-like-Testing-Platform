function AttemptsTable({ attempts }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border">
          <tr className="text-left text-text/70">
            <th className="py-2">User</th>
            <th>Email</th>
            <th>Score</th>
            <th>Status</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>

        <tbody>
          {attempts.map((a) => (
            <tr
              key={a.attemptId}
              className="border-b border-border/50"
            >
              <td className="py-2 font-medium text-text">
                {a.user.userName}
              </td>
              <td className="text-text/70">
                {a.user.email}
              </td>
              <td className="text-text">
                {a.score}
              </td>
              <td className="text-text">
                {a.status}
              </td>
              <td className="text-text/70">
                {new Date(a.startTime).toLocaleString()}
              </td>
              <td className="text-text/70">
                {new Date(a.endTime).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttemptsTable;
