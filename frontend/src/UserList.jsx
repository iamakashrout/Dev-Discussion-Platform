import { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CssBaseline,
  CircularProgress,
  GlobalStyles,
} from "@mui/material";

import  BASE_URL from "./config"; 
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in user ID from localStorage
  const currentUserId = localStorage.getItem("userId");
  const emailid = localStorage.getItem("emailid");
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/user/${emailid}/getusers`);
        const data = await response.json();
        
        // Filter out the logged-in user
        const filteredUsers = data.filter(user => user._id !== currentUserId);
        
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    
    
    // const fetchConnectedUsers = async () => {
    //   try {
    //     const response = await fetch(${BASE_URL}/user/${currentUserId}/friends);
    //     const data = await response.json();
    //     setConnectedUsers(data);
    //   } catch (error) {
    //     console.error("Error fetching connected users:", error);
    //   }
    // };

    fetchUsers();
    fetchConnectedUsers();
  }, [currentUserId]);


  const fetchConnectedUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/${emailid}/friends`);
      const data = await response.json();
      setConnectedUsers(data);
    } catch (error) {
      console.error("Error fetching connected users:", error);
    }
  };


  const handleToggleFriend = async (friendId) => {
    if (!currentUserId) {
      console.error("User ID not found in localStorage");
      return;
    }
  
    // Optimistic UI Update (Update State First)
    setConnectedUsers((prev) =>
      prev.some((f) => f._id === friendId)
        ? prev.filter((f) => f._id !== friendId) // Remove friend from state
        : [...prev, users.find((user) => user._id === friendId)] // Add friend to state
    );
  
    try {
      const response = await fetch(`${BASE_URL}/user/${emailid}/${friendId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
  
      const result = await response.json();
      console.log("API Response:", response.status, result);
  
      if (!response.ok) {
        throw new Error(`Failed to update friend list: ${result.message || response.statusText}`);
      }
  
      // Fetch latest connected users from backend (optional)
      fetchConnectedUsers();
    } catch (error) {
      console.error("Error toggling friend status:", error);
      // Revert UI change if API call fails
      fetchConnectedUsers();
    }
  };
  

  return (
    <>
      <CssBaseline />
      <GlobalStyles
        styles={{
          "html, body": {
            height: "100%",
            margin: 0,
            padding: 0,
            overflowY: "auto",
            background: "linear-gradient(135deg, #1e3c72, #6a1b9a)",
            color: "#fff",
            scrollBehavior: "smooth",
          },
          "::-webkit-scrollbar": { width: "10px" },
          "::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
          },
          "::-webkit-scrollbar-thumb": {
            background: "linear-gradient(135deg, #ff7eb3, #6a1b9a)",
            borderRadius: "10px",
          },
          "::-webkit-scrollbar-thumb:hover": {
            background: "linear-gradient(135deg, #6a1b9a, #ff7eb3)",
          },
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          maxWidth: "1400px",
          mx: "auto",
          mt: 5,
          p: 4,
          gap: 3,
        }}
      >
        {/* Users List */}
        <Box
          sx={{
            flex: 2,
            p: 3,
            borderRadius: 4,
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
            background: "linear-gradient(135deg, #1e3c72, #6a1b9a)",
            color: "#fff",
            maxHeight: "600px",
            overflowY: "auto",
          }}
        >
          <Typography variant="h4" align="center" sx={{ fontWeight: "bold", mb: 4 }}>
            All Users
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress sx={{ color: "#ff7eb3" }} />
            </Box>
          ) : users.length > 0 ? (
            <Grid container spacing={4}>
              {users.map((user) => (
                <Grid item xs={12} sm={6} md={4} key={user._id}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      p: 3,
                      borderRadius: 3,
                      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      "&:hover": { transform: "scale(1.05)", boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.4)" },
                    }}
                  >
                    <Avatar
                      src={user.picturePath || "https://via.placeholder.com/100"}
                      alt={user.name}
                      sx={{ width: 100, height: 100, mb: 2, border: "4px solid #fff" }}
                    />
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
                        {user.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#ddd", mb: 2 }}>
                        {user.location || "Unknown Location"}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          background: "linear-gradient(135deg, #ff7eb3, #6a1b9a)",
                          color: "#fff",
                          fontWeight: "bold",
                          px: 4,
                          py: 1,
                          borderRadius: "20px",
                          "&:hover": { background: "linear-gradient(135deg, #6a1b9a,rgb(159, 67, 105))" },
                        }}
                        onClick={() => handleToggleFriend(user._id)}
                      >
                      {connectedUsers.some(f => f._id === user._id) ? "Unfollow" : "Follow"}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="h5" align="center" sx={{ color: "#fff", fontWeight: "bold", width: "100%" }}>
              No users found.
            </Typography>
          )}
        </Box>

        {/* Connected Users List */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 4,
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
            background: "linear-gradient(135deg, #6a1b9a, #1e3c72)",
            color: "#fff",
            maxHeight: "600px",
            overflowY: "auto",
          }}
        >
          <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 3 }}>
            Connected Users
          </Typography>
          {connectedUsers.length > 0 ? (
            connectedUsers.map((user) => (
              <Box
                key={user._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  mb: 2,
                  borderRadius: 3,
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  "&::-webkit-scrollbar": { width: "3px" },
                  "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.1)", borderRadius: "10px" },
                  "&::-webkit-scrollbar-track": { background: "transparent" },
                  }}
              >
                <Avatar src={user.picturePath || "https://via.placeholder.com/50"} sx={{ width: 50, height: 50, mr: 2 }} />
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#fff" }}>
                  {user.name}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body1" align="center" sx={{ color: "#ddd" }}>
              No connections yet.
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default UserList;
