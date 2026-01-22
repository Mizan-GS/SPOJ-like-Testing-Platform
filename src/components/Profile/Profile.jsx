import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import EditProfile from './EditProfile'

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const profile = user?.profile || {};
  const avatarInitial =
    (user?.userName || user?.email || "U")[0].toUpperCase();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    api
      .get("/users/me")
      .then((res) => {
        const payload = res.data?.data || res.data;
        setUser(payload);
        localStorage.setItem("currentUser", JSON.stringify(payload));
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🔹 Plug your update API here later
      // await api.put("/users/me", user.profile);

      localStorage.setItem("currentUser", JSON.stringify(user));
      setIsEditing(false);
    } catch {
      setError("Failed to update profile");
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm(
      'Are you sure you want to delete your profile? This action cannot be undone.'
    );
    if (!ok) return;
    setDeleting(true);
    try {
      const res = await api.delete('/users/me');
      const msg = res?.data?.message || 'Profile deleted';
      toast.success(msg);
      // clear auth state
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAuthenticated');
      } catch (e) {}
      navigate('/');
    } catch (err) {
      const em = err?.response?.data?.message || err.message || 'Failed to delete profile';
      toast.error(em);
    } finally {
      setDeleting(false);
    }
  };

  if (!user && !loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 w-2xls:mx-auto flex items-center justify-center">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">

        <div className="bg-purple-500 px-6 py-8 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white">
            <span className="text-3xl font-semibold text-white">
              {avatarInitial}
            </span>
          </div>
          <div className="text-white">
            <h2 className="text-2xl font-semibold">
              {profile.firstName || user.userName}
            </h2>
            <p className="text-sm opacity-90">{user.email}</p>
          </div>
        </div>

       
        {!isEditing ? (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-500">First Name</label>
                <input value={profile.firstName || ""} disabled className=" w-full rounded-lg border-none px-3 py-2 " />
              </div>

              <div>
                <label className="text-sm text-gray-500">Last Name</label>
                <input value={profile.lastName || ""} disabled className="mt-1 w-full rounded-lg border-none px-3 py-2" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Username</label>
                <input value={user.userName} disabled className="mt-1 w-full rounded-lg border-none px-3 py-2" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Email</label>
                <input value={user.email} disabled className="mt-1 w-full rounded-lg border-none px-3 py-2 " />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500">Bio</label>
              <p className="mt-1 text-gray-700">{profile.bio || 'No bio provided.'}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-500">Avatar URL</label>
                <p className="mt-1 text-gray-700 break-words">{profile?.avatar?.url || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Avatar PublicId</label>
                <p className="mt-1 text-gray-700">{profile?.avatar?.publicId || '-'}</p>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-between items-center pt-4">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => navigate('/dashboard')} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100">← Back</button>
                <button type="button" onClick={handleDelete} disabled={deleting} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60">{deleting ? 'Deleting...' : 'Delete Profile'}</button>
              </div>

              <div>
                <button type="button" onClick={() => setIsEditing(true)} className="px-6 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600">Edit Profile</button>
              </div>
            </div>
          </div>
        ) : (
          <EditProfile user={user} onCancel={() => setIsEditing(false)} onSave={(payload) => {
            setUser(payload)
            try { localStorage.setItem('currentUser', JSON.stringify(payload)) } catch {}
            setIsEditing(false)
          }} />
        )}
      </div>
    </div>
  );
}
