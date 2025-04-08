// import { useEffect, useState } from "react";
// import BASE_URL from "./config";

// const ProfilePage = () => {
//     const emailid = localStorage.getItem("emailid");
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const response = await fetch(`${BASE_URL}/user/${emailid}`);
//                 if (!response.ok) throw new Error("User not found");
                
//                 const data = await response.json();
//                 setUser(data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUser();
//     }, [emailid]);

//     if (loading) return <div className="flex justify-center items-center h-screen"><p className="text-xl text-gray-400 animate-pulse">Loading...</p></div>;
//     if (error) return <div className="flex justify-center items-center h-screen"><p className="text-lg text-red-500">{error}</p></div>;

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
//             <div className="relative bg-gray-800/80 backdrop-blur-md shadow-xl rounded-3xl p-8 w-96 text-center border border-gray-700 hover:shadow-2xl transition-transform duration-500 hover:scale-105">
//                 {/* Profile Image */}
//                 <div className="flex justify-center">
//                     <img 
//                         src={user.picturePath || "https://via.placeholder.com/150"} 
//                         alt="Profile" 
//                         className="w-28 h-28 rounded-full border-4 border-gray-700 shadow-lg transform transition duration-500 hover:scale-110 hover:shadow-xl hover:shadow-indigo-500/50"
//                     />
//                 </div>
                
//                 {/* User Name & Email */}
//                 <h2 className="text-2xl font-semibold mt-4 text-gray-100">{user.name}</h2>
//                 <p className="text-gray-400 text-sm">{user.emailid}</p>

//                 {/* Info Section */}
//                 <div className="mt-6 space-y-3">
//                     <p className="text-gray-300 text-lg flex items-center justify-center gap-2">
//                         <span className="text-xl">📞</span> <span>{user.phone || "N/A"}</span>
//                     </p>
//                     <p className="text-gray-300 text-lg flex items-center justify-center gap-2">
//                         <span className="text-xl">📍</span> <span>{user.location || "N/A"}</span>
//                     </p>
//                 </div>

//                 {/* Subtle Glow Effect */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent rounded-3xl blur-xl"></div>
//             </div>
//         </div>
//     );
// };

// export default ProfilePage;


import { useEffect, useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import BASE_URL from "./config";

const ProfilePage = () => {
    const emailid = localStorage.getItem("emailid");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${BASE_URL}/user/${emailid}`);
                if (!response.ok) throw new Error("User not found");
                
                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [emailid]);

    if (loading) return <div className="loading-screen">Loading...</div>;
    if (error) return <div className="error-screen">{error}</div>;

    const getInitial = (name) => name ? name.charAt(0).toUpperCase() : "?";

    return (
        <div className="profile-container">
            <div className="profile-card">
                <Box className="avatar-container">
                    {user.picturePath ? (
                        <img 
                            src={user.picturePath} 
                            alt="Profile" 
                            className="avatar"
                            style={{ borderRadius: '50%', objectFit: 'cover' }}
                        />
                    ) : (
                        <div className="avatar avatar-placeholder" style={{
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {getInitial(user.name)}
                        </div>
                    )}
                    <Typography className="user-name">{user.name}</Typography>
                </Box>
                
                <Box className="email-container">
                    <Typography className="email-label">Email</Typography>
                    <Typography className="email-text">{user.emailid}</Typography>
                </Box>
                
                <Box className="details-container">
                    <Box className="details-item">
                        <span className="icon">📍</span> 
                        <span>{user.location || "Not specified"}</span>
                    </Box>
                    <Box className="details-item">
                        <span className="icon">📞</span> 
                        <span>{user.phone || "Not specified"}</span>
                    </Box>
                </Box>
                
                <Box className="button-container">
                    <Button className="edit-button" sx={{
                        color: 'white',
                        textTransform: 'none',
                        fontWeight: '600',
                        border: 'none'
                    }}>
                        Edit Profile
                    </Button>
                </Box>
            </div>
        </div>
    );
};

export default ProfilePage;