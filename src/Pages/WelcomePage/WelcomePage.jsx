import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const WelcomePage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [photo, setPhoto] = useState(null);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const onSubmit = async (data) => {
        try {
            let photoUrl = null;
            if (photo) {
                const formData = new FormData();
                formData.append('photo', photo);

                const photoResponse = await axiosSecure.post('/user/upload-photo', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                photoUrl = photoResponse.data.photoUrl;
                console.log('Photo uploaded:', photoUrl);
            }

            // Update the user's name
            const response = await axiosSecure.patch('/user/name', { name: data.name });
            console.log(response.data.message);
            navigate('/');
        } catch (error) {
            console.error("Error:", error.response?.data?.message || error.message);
            alert(error.response?.data?.message || "Failed to update name or upload photo");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
            <div className="text-center bg-white shadow-lg rounded-lg p-10 max-w-md w-full">
                <p className="text-7xl font-caveat text-red-500 mb-2">Welcome to</p>
                <p className="text-5xl font-caveat text-red-500 mb-6"> LinkCamp!</p>
                <p className="text-sm text-gray-600 mb-4">Enter your name and upload a profile photo to get started:</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="text"
                        placeholder="Your Name"
                        {...register('name', { required: 'Name is required' })}
                        className={`input input-bordered w-full mb-4 px-4 py-2 text-lg rounded-lg border-2 ${errors.name ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:border-red-500`}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mb-4">{errors.name.message}</p>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="file-input file-input-bordered w-full mb-4"
                    />
                    <button
                        type="submit"
                        className="btn bg-red-500 text-white px-6 py-2 rounded-lg text-lg hover:bg-red-600 transition duration-300"
                    >
                        Next
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WelcomePage;