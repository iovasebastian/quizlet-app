import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RequireAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return null;
};

export default RequireAuth;
