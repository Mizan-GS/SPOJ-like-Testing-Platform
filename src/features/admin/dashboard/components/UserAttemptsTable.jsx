function UserAttemptsTable({ attempts }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border">
          <tr className="text-left text-text/70">
            <th className="py-2">Test</th>
            <th>Category</th>
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
                {a.test.title}
              </td>
              <td className="text-text/70">
                {a.test.category}
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

export default UserAttemptsTable;
