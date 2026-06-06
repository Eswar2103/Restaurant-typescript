import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";
import { useState } from "react";
import { signOut } from "../services/apiAuth";

function Logout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit() {
    setIsLoading(true);
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
      toast.error("Failed to logout...");
    }
    setIsLoading(false);
  }

  return (
    <>
      {user && (
        <button
          className="border-none rounded-xl bg-blue-500 hover:bg-blue-600 cursor-pointer px-3 py-1 text-white font-bold"
          onClick={onSubmit}
          disabled={isLoading}
        >
          Logout
        </button>
      )}
    </>
  );
}

export default Logout;
