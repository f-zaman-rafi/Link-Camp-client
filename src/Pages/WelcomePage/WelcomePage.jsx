import React, { useState } from 'react';
import { useForm } from 'react-hook-form'; // For handling form state and validation.
import { useNavigate } from 'react-router-dom'; // For programmatic navigation.
import useAxiosSecure from '../../Hooks/useAxiosSecure'; // Custom hook for making authenticated HTTP requests.
import Loading from '../Loading/Loading'; // Component to display a loading state.

/**
 * WelcomePage component: Allows new users to enter their name and upload a profile photo.
 * This is likely shown after a user successfully signs up for the first time.
 */
const WelcomePage = () => {
    // Initialize react-hook-form for managing the form state.
    const { register, handleSubmit, formState: { errors } } = useForm();
    // State to store the selected profile photo file.
    const [photo, setPhoto] = useState(null);
    // State to manage the loading state during API calls.
    const [isLoading, setIsLoading] = useState(false);
    // Hook to get the navigate function for routing.
    const navigate = useNavigate();
    // Custom hook instance for making secure API requests.
    const axiosSecure = useAxiosSecure();

    /**
     * handlePhotoChange: Updates the 'photo' state with the selected file.
     * @param {ChangeEvent<HTMLInputElement>} e - The change event from the file input.
     */
    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    // Display a loading indicator if data is being processed.
    if (isLoading) return <Loading />;

    /**
     * onSubmit: Handles the form submission.
     * It uploads the photo (if selected) and updates the user's name on the server.
     * Finally, it navigates the user to the home page.
     * @param {object} data - The form data containing the user's name.
     */
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            let photoUrl = null;
            // Check if a photo has been selected for upload.
            if (photo) {
                const formData = new FormData();
                formData.append('photo', photo);

                // Post the photo to the server for upload.
                const photoResponse = await axiosSecure.post('/user/upload-photo', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                photoUrl = photoResponse.data.photoUrl;
                console.log('Photo uploaded:', photoUrl);
                // Consider storing the photoUrl in user context or state if needed later.
            }

            // Update the user's name on the server using a PATCH request.
            await axiosSecure.patch('/user/name', { name: data.name });

            // Redirect the user to the home page after successful update.
            navigate('/');

        } catch (error) {
            // Log any errors that occur during the process.
            console.error("Error:", error.response?.data?.message || error.message);
            // Display an alert to the user indicating the failure.
            alert(error.response?.data?.message || "Failed to update name or upload photo");
        } finally {
            // Ensure that the loading state is reset regardless of success or failure.
            setIsLoading(false);
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
                        // Register the input field with react-hook-form and apply validation rules.
                        {...register('name', { required: 'Name is required' })}
                        className={`input input-bordered w-full mb-4 px-4 py-2 text-lg rounded-lg border-2 ${errors.name ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:border-red-500`}
                    />
                    {/* Display error message if the 'name' field is invalid. */}
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
                        // Disable the button while loading.
                        disabled={isLoading}
                        className={`btn text-white px-6 py-2 rounded-lg text-lg transition duration-300 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                            }`}
                    >
                        {/* Display 'Loading...' when isLoading is true, otherwise display 'Next'. */}
                        {isLoading ? 'Loading...' : 'Next'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WelcomePage;