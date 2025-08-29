import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { useGroupChatStore } from "../../store/useGroupChatStore";
import toast from "react-hot-toast";

export default function JoinGroup() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { setSelectedGroup } = useGroupChatStore();

  useEffect(() => {
    const join = async () => {
      try {
        const res =await axiosInstance.post(`/groups/join/${token}`);
        setSelectedGroup(res.data);
        toast.success("Joined group successfully 🎉");
        navigate("/");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to join group");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    join();
  }, [token, navigate]);

  if (loading) return <div className="p-6">Joining group...</div>;

  return null;
}
