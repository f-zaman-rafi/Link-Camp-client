import React, { useState, useEffect } from "react";
import Loading from "../../Loading/Loading";
import useAdminUsers from "../../../Hooks/Admin/useAdminUsers/useAdminUsers";
import useUpdateUserStatus from "../../../Hooks/Admin/useUpdateUserStatus/useUpdateUserStatus";
import { FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";

const UserList = () => {
    const { users: fetchedUsers, isLoading, isError } = useAdminUsers();
    const { updateUserStatus } = useUpdateUserStatus();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // For modal
    const [newStatus, setNewStatus] = useState(""); // For editing status

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

    return (
        <div className="py-10">
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>User ID</th>
                            <th>Status</th>
                            <th>More Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <img
                                                    src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                                                    alt="Avatar Tailwind CSS Component"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">
                                                <p>{user.name}</p>
                                            </div>
                                            <div className="text-sm opacity-50">{user.userType}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <p className="w-1/2">{user.user_id}</p>
                                    <br />
                                    <span className="badge badge-ghost badge-sm w-auto mx-auto">{user.department}</span>
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <span className="w-1/2">{user.verify}</span>
                                        <FaEdit
                                            className="text-red-500 cursor-pointer"
                                            onClick={() => handleEditClick(user)}
                                        />
                                    </div>
                                </td>
                                <th>
                                    <button className="btn btn-ghost btn-xs">details</button>
                                </th>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

export default UserList;