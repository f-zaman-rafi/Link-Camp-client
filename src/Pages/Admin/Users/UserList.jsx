import React from 'react';
import Loading from '../../Loading/Loading';
import useAdminUsers from '../../../Hooks/Admin/useAdminUsers/useAdminUsers';
import useUpdateUserStatus from '../../../Hooks/Admin/useUpdateUserStatus/useUpdateUserStatus';

const UserList = () => {
    const { users, isLoading, isError } = useAdminUsers();
    const { mutate: updateUserStatus } = useUpdateUserStatus();

    if (isLoading) return <Loading />;
    if (isError) return <p>Getting error...</p>;

    // Handle change of verification status
    const handleStatusChange = (id, newStatus) => {
        updateUserStatus({ id, verify: newStatus });
    };

    return (
        <div className="py-10">
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>User ID</th>
                            <th>Status</th>
                            <th>More Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Render each user */}
                        {
                            users.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                    <img
                                                        src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                                                        alt="Avatar Tailwind CSS Component" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold"><p>{user.name}</p></div>
                                                <div className="text-sm opacity-50">{user.userType}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <p>{user.user_id}</p>
                                        <br />
                                        <span className="badge badge-ghost badge-sm">{user.department}</span>
                                    </td>
                                    <td>
                                        {/* Status Dropdown */}
                                        <select
                                            className="select select-bordered"
                                            value={user.verify}
                                            onChange={(e) => handleStatusChange(user._id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="blocklisted">Blocklisted</option>
                                        </select>
                                    </td>
                                    <th>
                                        <button className="btn btn-ghost btn-xs">details</button>
                                    </th>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
