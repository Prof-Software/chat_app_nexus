import React, { useState, useEffect } from "react";
import { client } from "../client";
import Sidebar from "./Sidebar";
import Private from "./Private";

const Home = () => {
  const [user, setUser] = useState({});
  const history = useHistory();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      history.push("/login"); // redirect to login if user data is not available
    } else {
      const { userId } = userData;
      client
        .fetch(`*[_type == "user" && userId == "${userId}"]`)
        .then((data) => {
          if (data.length > 0) {
            setUser(data[0]);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [history]);
  return (
    <div className="h-screen w-screen flex bg-[#2F3136] text-white">
      <Sidebar />
      <Private user={user && user} />
    </div>
  );
};

export default Home;
