function AttemptsTable({ attempts }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border text-text/70">
          <tr className="text-left">
            <th className="py-2">Assessment</th>
            <th>Score</th>
            <th>Status</th>
            <th>Started</th>
            <th>Completed</th>
          </tr>
        </thead>

        <tbody>
          {attempts.map((a) => (
            <tr
              key={a.attemptId}
              className="border-b border-border/50"
            >
              <td className="py-2">
                <p className="font-medium text-text">
                  {a.assessment.title}
                </p>
                <p className="text-xs text-text/60">
                  {a.assessment.description}
                </p>
              </td>

              <td className="text-text font-medium">
                {a.score}%
              </td>

              <td className="text-text">
                {a.status}
              </td>

              <td className="text-text/70">
                {new Date(a.startedAt).toLocaleString()}
              </td>

              <td className="text-text/70">
                {new Date(a.completedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttemptsTable;
