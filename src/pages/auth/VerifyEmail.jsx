import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

const VerifyEmail = ({ path, title }) => {
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token) {
          toast.error('Verification token not found');
          navigate('/login', { replace: true });
          return;
        }

        // Call backend to verify email
        const response = await api.post('/auth/verify-email', { token });
        
        if (response.status === 200) {
          toast.success('Email verified successfully! Please login.');
          navigate(`/${path}?verified=true`, { replace: true });
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Email verification failed or expired');
        navigate(`/${path}?verified=false`, { replace: true });
      }
    };

    verifyEmail();
  }, [token, navigate, path]);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>{title}</h2>
      <p>Processing your verification...</p>
    </div>
  );
};

export default VerifyEmail;
