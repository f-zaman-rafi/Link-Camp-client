import React, { useEffect, useState } from "react";
import useAdminUsers from "../../Hooks/Admin/useAdminUsers/useAdminUsers";
import useUpdateUserStatus from "../../Hooks/Admin/useUpdateUserStatus/useUpdateUserStatus";
import Loading from "../../Pages/Loading/Loading";
import toast from "react-hot-toast";
import { FaEdit, FaSort } from "react-icons/fa";

const AdminDashboard = () => {
    const { users: fetchedUsers, isLoading, isError } = useAdminUsers();
    const { updateUserStatus } = useUpdateUserStatus();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [sortOrder, setSortOrder] = useState("asc"); // Ascending or Descending

    useEffect(() => {
        setUsers(fetchedUsers);
    }, [fetchedUsers]);

    if (isLoading) return <Loading />;
    if (isError) return <p>Getting error...</p>;

    const handleEditClick = (user) => {
        setSelectedUser(user); // Open modal with selected user
        setNewStatus(user.verify); // Pre-fill current status
    };

    const handleUpdateStatus = async () => {
        try {
            await updateUserStatus({ id: selectedUser._id, verify: newStatus });
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === selectedUser._id ? { ...user, verify: newStatus } : user
                )
            );
            toast.success("User status updated successfully!");
            setSelectedUser(null); // Close modal
        } catch (error) {
            toast.error("Failed to update user status.");
            console.error("Error updating user status:", error.response?.data || error.message);
        }
    };

    const handleSortByStatus = () => {
        const statusOrder = ["pending", "blocklisted", "approved"];
        const sortedUsers = [...users].sort((a, b) => {
            const aIndex = statusOrder.indexOf(a.verify);
            const bIndex = statusOrder.indexOf(b.verify);
            return sortOrder === "asc" ? aIndex - bIndex : bIndex - aIndex;
        });
        setUsers(sortedUsers);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sort order
    };

    return (
        <div className="w-full h-screen ">
            {/* Main Content */}
            <div className="flex-1 p-4">
                {/* Dashboard Section */}
                <div>
                    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="card bg-blue-400 shadow-md p-4">
                            <h2 className="text-lg font-bold">Students</h2>
                            <p className="text-2xl">
                                {users.filter((user) => user.userType === "student" && user.verify === "approved").length}
                            </p>
                        </div>
                        <div className="card bg-blue-400 shadow-md p-4">
                            <h2 className="text-lg font-bold">Teachers</h2>
                            <p className="text-2xl">
                                {users.filter((user) => user.userType === "teacher" && user.verify === "approved").length}
                            </p>
                        </div>
                        <div className="card bg-blue-400 shadow-md p-4">
                            <h2 className="text-lg font-bold">Blacklisted</h2>
                            <p className="text-2xl">
                                {users.filter((user) => user.verify === "blocklisted").length}
                            </p>
                        </div>
                        <div className="card bg-blue-400 shadow-md p-4">
                            <h2 className="text-lg font-bold">Admins</h2>
                            <p className="text-2xl">
                                {users.filter((user) => user.userType === "admin" && user.verify === "approved").length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Members Section */}
                <div className="mt-8">
                    <h1 className="text-xl font-bold mb-4">Members<sub className="bg-blue-200 px-2 py-1 mx-2 rounded-full text-sm">{users.filter((user) => user.verify !== "blocklisted").length}</sub></h1>
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>ID</th>
                                <th>
                                    <div className="flex items-center gap-2">
                                        Status
                                        <FaSort
                                            className="cursor-pointer text-gray-500"
                                            onClick={handleSortByStatus}
                                        />
                                    </div>
                                </th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="flex flex-col space-y-1">
                                            <span>{user.email}</span>
                                            <span
                                                className={`px-2 py-[1px] text-xs rounded w-min ${user?.userType === "student"
                                                    ? "bg-green-200"
                                                    : user?.userType === "teacher"
                                                        ? "bg-red-200"
                                                        : "bg-gray-300"
                                                    }`}
                                            >
                                                {user?.userType}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="flex flex-col">
                                        <span>{user.user_id}</span>
                                        <span>{user.department}</span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2/5">{user.verify}</span>
                                            <FaEdit
                                                className="text-red-600"
                                                onClick={() => handleEditClick(user)}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <button className="btn btn-error btn-sm">Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {selectedUser && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Edit Status</h3>
                        <select
                            className="select select-bordered w-full mt-4"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="blocklisted">Blocklisted</option>
                        </select>
                        <div className="modal-action">
                            <button className="btn btn-neutral" onClick={handleUpdateStatus}>
                                OK
                            </button>
                            <button className="btn btn-error" onClick={() => setSelectedUser(null)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;