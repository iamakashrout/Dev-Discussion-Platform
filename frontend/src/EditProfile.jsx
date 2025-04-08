import { useEffect, useState } from "react";
import { Typography, Button, Box, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "./config";
import "./EditProfile.css";

const EditProfile = () => {
    const navigate = useNavigate();
    // const { emailid } = useParams(); 

    const emailid = localStorage.getItem("emailid"); 

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
                setFormData({
                    name: data.name || "",
                    location: data.location || "",
                    phone: data.phone || "",
                });
            } catch (err) {
                console.error(err);
            }
        };

        fetchUser();
    }, [emailid]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${BASE_URL}/user/edit/${emailid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to update profile");

            navigate(`/profile/${emailid}`); // Redirect to profile page after saving
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div className="edit-profile-container">
            <Box className="edit-profile-card">
                <Typography variant="h5" className="edit-profile-title">
                    Edit Profile
                </Typography>

                <Box className="edit-field">
                    <Typography>Name</Typography>
                    <TextField
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                    />
                </Box>

                <Box className="edit-field">
                    <Typography>Location</Typography>
                    <TextField
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                    />
                </Box>

                <Box className="edit-field">
                    <Typography>Phone</Typography>
                    <TextField
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                    />
                </Box>

                <Box className="button-group">
                    <Button
                        sx={{ background: "green", color: "white", marginRight: "10px" }}
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                    <Button
                        sx={{ background: "gray", color: "white" }}
                        onClick={() => navigate(`/profile/${emailid}`)}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

export default EditProfile;
