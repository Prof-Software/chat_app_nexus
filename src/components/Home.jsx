import React, { useState, useEffect } from "react";
import { client } from "../client";
import Sidebar from "./Sidebar";
import Private from "./Private";
import {useNavigate} from 'react-router-dom'
import MainChat from "./MainChat";

const Home = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [tab, setTab] = useState("add")
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/login"); // redirect to login if user data is not available
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
  }, [navigate]);
  return (
    <div className="h-screen w-screen flex bg-[#2F3136] text-white">
      <Sidebar />
      <Private user={user && user} />
      <MainChat user={user && user} tab={tab} setTab={setTab}/>
    </div>
  );
};

export default Home;
