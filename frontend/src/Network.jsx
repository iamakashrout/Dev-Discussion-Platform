import Navbar from "./components/NavBar";

// const Network = () => {
//   return (
//     <>
//       <Navbar />
//       <div className="page-container">
//         <h2>Welcome to Network Page</h2>
//       </div>
//     </>
//   );
// };

// export default Network;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
const BASE_URL = "http://localhost:5000";

const Network = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    

    useEffect(() => {
        // Retrieve the userId of the logged-in user from localStorage
        const userId = localStorage.getItem("userId");
        console.log("User ID from localStorage:", userId);  // Log to check

        if (!userId) {
            setError("User is not logged in.");
            setLoading(false);
            return;
        }

        // Fetching the list of friends from the backend using the userId
        axios.get(`${BASE_URL}/user/${userId}/friends`)
            .then((response) => {
                setFriends(response.data);  // Set the friends list to state
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);  // Set the error message if something goes wrong
                setLoading(false);
            });
    }, []);  // Empty array to only run once on mount

    // Render a loading message or the actual friends list
    if (loading) {
        return <div>Loading friends...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Your Friends List</h1>
            {friends.length === 0 ? (
                <p>You don't have any friends yet.</p>
            ) : (
                <ul>
                    {friends.map((friend) => (
                        <li key={friend._id}>
                            <img src={friend.picturePath} alt={friend.name} width={50} height={50} />
                            <p>{friend.name}</p>
                            <p>Location: {friend.location}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Network;
