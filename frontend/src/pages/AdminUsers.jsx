import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://olx-clone-zg79.onrender.com/api/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    }
  };

  const toggleBlockUser = async (id) => {
    try {
      const res = await axios.patch(
        `https://olx-clone-zg79.onrender.com/api/auth/users/${id}/block`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchUsers();
    }
  }, []);

  if (!user || user.role !== "admin") {
    return <h1>Access Denied: Admin only</h1>;
  }

  return (
    <div className="admin-page">
      <h1>Manage Users</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((singleUser) => (
            <tr key={singleUser._id}>
              <td>{singleUser.name}</td>
              <td>{singleUser.email}</td>
              <td>{singleUser.role}</td>
              <td>{singleUser.isBlocked ? "Blocked" : "Active"}</td>
              <td>
                {singleUser.role === "admin" ? (
                  "Admin"
                ) : (
                  <>
                    <button onClick={() => toggleBlockUser(singleUser._id)}>
                      {singleUser.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;