// import { useEffect, useState } from "react";
// import { Typography, Button, Box } from "@mui/material";
// import BASE_URL from "./config";
// import "./ProfilePage.css";
// import { useNavigate } from "react-router-dom";
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

//     if (loading) return <div className="loading-screen">Loading...</div>;
//     if (error) return <div className="error-screen">{error}</div>;

//     const getInitial = (name) => name ? name.charAt(0).toUpperCase() : "?";

//     const handleEditProfile = () => {
//         const navigate = useNavigate();
//         navigate("/edit-profile");
//     };

//     return (
//         <div className="profile-container">
//             <div className="profile-card">
//                 <Box className="avatar-container">
//                     {user.picturePath ? (
//                         <img 
//                             src={user.picturePath} 
//                             alt="Profile" 
//                             className="avatar"
//                             style={{ borderRadius: '50%', objectFit: 'cover' }}
//                         />
//                     ) : (
//                         <div className="avatar avatar-placeholder" style={{
//                             borderRadius: '50%',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center'
//                         }}>
//                             {getInitial(user.name)}
//                         </div>
//                     )}
//                     <Typography className="user-name">{user.name}</Typography>
//                 </Box>
                
//                 <Box className="email-container">
//                     <Typography className="email-label">Email</Typography>
//                     <Typography className="email-text">{user.emailid}</Typography>
//                 </Box>
                
//                 <Box className="details-container">
//                     <Box className="details-item">
//                         <span className="icon">📍</span> 
//                         <span>{user.location || "Not specified"}</span>
//                     </Box>
//                     <Box className="details-item">
//                         <span className="icon">📞</span> 
//                         <span>{user.phone || "Not specified"}</span>
//                     </Box>
//                 </Box>
                
//                 <Box className="button-container">
//                     <Button 
//                         className="edit-button" 
//                         sx={{
//                             color: 'white',
//                             textTransform: 'none',
//                             fontWeight: '600',
//                             border: 'none'
//                         }}
//                         onClick={handleEditProfile}
//                     >
//                         Edit Profile
//                     </Button>
//                 </Box>
//             </div>
//         </div>
//     );
// };

// export default ProfilePage;

import { useEffect, useState } from "react";
import { Typography, Button, Box, TextField } from "@mui/material";
import {useNavigate} from "react-router-dom";
import BASE_URL from "./config";
import "./ProfilePage.css";

const ProfilePage = () => {
    const navigate = useNavigate();
    const emailid = localStorage.getItem("emailid");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        phone: "",
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${BASE_URL}/user/${emailid}`);
                if (!response.ok) throw new Error("User not found");

                const data = await response.json();
                setUser(data);
                setFormData({
                    name: data.name || "",
                    location: data.location || "",
                    phone: data.phone || "",
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [emailid]);

    const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

    const handleEdit = () => {
        navigate(`/editprofile/${emailid}`);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: user.name,
            location: user.location,
            phone: user.phone,
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${BASE_URL}/user/${emailid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to update user details");

            const updatedUser = await response.json();
            setUser(updatedUser);
            setIsEditing(false);
        } catch (err) {
            console.error(err.message);
        }
    };

    if (loading) return <div className="loading-screen">Loading...</div>;
    if (error) return <div className="error-screen">{error}</div>;

    return (
        <div className="profile-container">
            <div className="profile-card">
                {/* Adjusted Avatar Position */}
                <Box className="avatar-container" sx={{ marginTop: "4rem" }}>
                    {user.picturePath ? (
                        <img
                            src={user.picturePath}
                            alt="Profile"
                            className="avatar"
                            style={{ borderRadius: "50%", objectFit: "cover" }}
                        />
                    ) : (
                        <div
                            className="avatar avatar-placeholder"
                            style={{
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2rem",
                                fontWeight: "bold",
                            }}
                        >
                            {getInitial(user.name)}
                        </div>
                    )}
                </Box>

                {/* User Info & Edit Fields */}
                <Box className="details-container">
                    {/* Name Field */}
                    <Box className="details-item">
                        <span className="icon">👤</span>
                        {isEditing ? (
                            <TextField
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                            />
                        ) : (
                            <span>{user.name || "Not specified"}</span>
                        )}
                    </Box>

                    {/* Email Field (Non-editable) */}
                    <Box className="details-item">
                        <span className="icon">📧</span>
                        <span>{user.emailid}</span>
                    </Box>

                    {/* Location Field */}
                    <Box className="details-item">
                        <span className="icon">📍</span>
                        {isEditing ? (
                            <TextField
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                            />
                        ) : (
                            <span>{user.location || "Not specified"}</span>
                        )}
                    </Box>

                    {/* Phone Field */}
                    <Box className="details-item">
                        <span className="icon">📞</span>
                        {isEditing ? (
                            <TextField
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                            />
                        ) : (
                            <span>{user.phone || "Not specified"}</span>
                        )}
                    </Box>
                </Box>

                {/* Edit / Save Buttons */}
                <Box className="button-container">
                    {isEditing ? (
                        <>
                            <Button
                                className="save-button"
                                sx={{
                                    background: "green",
                                    color: "white",
                                    marginRight: "10px",
                                }}
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                            <Button
                                className="cancel-button"
                                sx={{
                                    background: "gray",
                                    color: "white",
                                }}
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button
                            className="edit-button"
                            sx={{
                                background: "purple",
                                color: "white",
                                textTransform: "none",
                                fontWeight: "600",
                                border: "none",
                            }}
                            onClick={handleEdit}
                        >
                            Edit Profile
                        </Button>
                    )}
                </Box>
            </div>
        </div>
    );
};

export default ProfilePage;
