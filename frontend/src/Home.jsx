const Home = ({ setAuth }) => {
    const handleLogout = () => {
      localStorage.removeItem("token");
      setAuth(false);
    };
  
    return (
      <div>
        <h1>Welcome</h1>
        <button onClick={handleLogout}>Sign Out</button>
      </div>
    );
  };

  export default Home;