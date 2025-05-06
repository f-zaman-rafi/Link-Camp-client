// import useAxiosSecure from "./useAxiosSecure";
// import useUserInfo from "./useUserInfo";

// const useSignedInUserInfo = () => {
//   const axiosSecure = useAxiosSecure();
//   const { refetch } = useUserInfo();

//   const getUserInfo = async (email) => {
//     const res = await axiosSecure.get(`/user/${email}`);
//     await refetch();
//     return res.data;
//   };

//   return { getUserInfo };
// };

// export default useSignedInUserInfo;
