import { useState, useEffect, useRef } from "react";
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
  TextField,
  IconButton,
  InputAdornment
} from "@mui/material";
import { Mic, MicOff } from "@mui/icons-material";

import BASE_URL from "./config";
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const currentUserId = localStorage.getItem("userId");
  const emailid = localStorage.getItem("emailid");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/user/${emailid}/getusers`);
        const data = await response.json();
        const filteredUsers = data.filter(user => user._id !== currentUserId);
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

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

    setConnectedUsers((prev) =>
      prev.some((f) => f._id === friendId)
        ? prev.filter((f) => f._id !== friendId)
        : [...prev, users.find((user) => user._id === friendId)]
    );

    try {
      const response = await fetch(`${BASE_URL}/user/${emailid}/${friendId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to update friend list: ${result.message || response.statusText}`);
      }

      fetchConnectedUsers();
    } catch (error) {
      console.error("Error toggling friend status:", error);
      fetchConnectedUsers();
    }
  };

  // Voice Search Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let transcript = event.results[0][0].transcript;
        transcript = transcript.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ""); // remove punctuation
        setSearchTerm(transcript);
        setListening(false);
      };

      recognitionRef.current.onerror = (err) => {
        console.error("Voice recognition error:", err);
        setListening(false);
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }
  }, []);

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) return;

    if (!listening) {
      recognitionRef.current.start();
      setListening(true);
    } else {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Box
          sx={{
            flex: 2,
            p: 3,
            pt: 18,
            borderRadius: 4,
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
            background: "linear-gradient(135deg, #1e3c72, #6a1b9a)",
            color: "#fff",
            height: "700px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h4" align="center" sx={{ fontWeight: "bold", mb: 4 }}>
            All Users
          </Typography>

          <Box mb={3} display="flex" flexDirection="column" alignItems="center">
            <label
              htmlFor="search-input"
              style={{
                marginBottom: "8px",
                fontWeight: "bold",
                fontSize: "18px",
                color: "#fff",
              }}
            >
              Search Users
            </label>
            <TextField
              id="search-input"
              type="text"
              placeholder="Type a name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{
                backgroundColor: "#fff",
                borderRadius: "20px",
                maxWidth: "400px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
                boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleVoiceSearch}
                      sx={{
                        backgroundColor: "#8e24aa",
                        color: "#fff",
                        width: 36,
                        height: 36,
                        borderRadius: "50%", // Makes it a circle
                        "&:hover": {
                          backgroundColor: "#7b1fa2",
                        },
                      }}
                      >
                      {listening ? <MicOff color="error" /> : <Mic />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress sx={{ color: "#ff7eb3" }} />
              </Box>
            ) : filteredUsers.length > 0 ? (
              <Grid container spacing={4}>
                {filteredUsers.map((user) => (
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
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.4)",
                        },
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
                            "&:hover": {
                              background: "linear-gradient(135deg, #6a1b9a, rgb(159, 67, 105))",
                            },
                          }}
                          onClick={() => handleToggleFriend(user._id)}
                        >
                          {connectedUsers.some((f) => f._id === user._id) ? "Unfollow" : "Follow"}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="h6" align="center" sx={{ color: "#fff", fontWeight: "bold", width: "100%" }}>
                {searchTerm ? "No users match your search." : "No users found."}
              </Typography>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            p: 3,
            pt: 18,
            borderRadius: 4,
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
            background: "linear-gradient(135deg, #6a1b9a, #1e3c72)",
            color: "#fff",
            height: "700px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 3 }}>
            Connected Users
          </Typography>

          <Box sx={{ flex: 1, overflowY: "auto" }}>
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
      </Box>
    </>
  );
};

export default UserList;