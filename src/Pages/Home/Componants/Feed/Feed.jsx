import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { FaThumbsUp, FaThumbsDown, FaComment, FaFlag } from "react-icons/fa";

const Feed = () => {
    const [posts, setPosts] = useState([]); // State to store posts
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axiosSecure.get("/posts");
                setPosts(response.data); // Set posts data
            } catch (error) {
                console.error("Error fetching posts:", error.response?.data?.message || error.message);
            }
        };

        fetchPosts();
    }, [axiosSecure]);

    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <div
                    key={post._id}
                    className="bg-white shadow-md rounded-lg p-4 max-w-2xl mx-auto"
                >
                    {/* Post Header */}
                    <div className="flex items-center gap-4 mb-4">
                        <img
                            src={post.user.photo}
                            alt="User"
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <p className="font-medium">{post.user.name}<span className=" mx-2 text-xs px-1 bg-green-200 rounded-full">{post.user.user_type}</span></p>
                            <p className="text-sm text-gray-500">
                                {new Date(post.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Post Content */}
                    {post.photo ? (
                        <img
                            src={post.photo}
                            alt="Post"
                            className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                    ) : (
                        <p className="text-gray-800 text-lg mb-4">{post.content}</p>
                    )}

                    {/* Post Actions */}
                    <div className="flex justify-between items-center border-t pt-4">
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500">
                                <FaThumbsUp />
                                <span>Upvote</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-600 hover:text-red-500">
                                <FaThumbsDown />
                                <span>Downvote</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 text-gray-600 hover:text-green-500">
                                <FaComment />
                                <span>Comment</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-600 hover:text-yellow-500">
                                <FaFlag />
                                <span>Report</span>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Feed;