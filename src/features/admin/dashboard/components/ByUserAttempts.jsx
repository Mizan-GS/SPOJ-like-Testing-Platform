import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUserAnalytics } from "../../../../services/admin.api";
import UserAccordionRow from "./UserAccordionRow";

function ByUserAttempts() {
  const [users, setUsers] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUserAnalytics();
        const filtered = (res.data.data).filter(
          (u) => u.totalTestAttempts > 0
          );

          setUsers(filtered);

      } catch {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const PAGE_SIZE = 5;
const [page, setPage] = useState(1);

const totalPages = Math.ceil(users.length / PAGE_SIZE);

const paginatedUsers = users.slice(
  (page - 1) * PAGE_SIZE,
  page * PAGE_SIZE
);

  if (loading) {
    return <p className="text-text">Loading users...</p>;
  }

  return (
    <div className="space-y-3">
      {paginatedUsers.map((user) => (
     <UserAccordionRow
     key={user.userId}
     user={user}
     isOpen={expandedUserId === user.userId}
     onToggle={() =>
          setExpandedUserId(
          expandedUserId === user.userId ? null : user.userId
          )
     }
     />
     ))}

     <div className="flex items-center justify-between pt-4">
  <p className="text-sm text-text/60">
    Page {page} of {totalPages || 1}
  </p>

  <div className="flex gap-2">
    <button
      disabled={page === 1}
      onClick={() => setPage((p) => p - 1)}
      className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
    >
      Prev
    </button>

    <button
      disabled={page === totalPages || totalPages === 0}
      onClick={() => setPage((p) => p + 1)}
      className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
    >
      Next
    </button>
  </div>
</div>


    </div>
  );
}

export default ByUserAttempts;
