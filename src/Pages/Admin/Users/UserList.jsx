import React from 'react';
import Loading from '../../Loading/Loading';
import useAdminUsers from '../../../Hooks/Admin/useAdminUsers/useAdminUsers';

const UserList = () => {

    const { users, isLoading, isError } = useAdminUsers();

    if (isLoading) return <Loading />
    if (isError) return <p>getting error...</p>

    return (
        <div className='py-10'>
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
                        {/* row 1 */}
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
                                    <td>{user.verify}</td>
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

