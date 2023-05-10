import React, { useState, useEffect } from "react";
import { client } from "../client";
import Sidebar from "./Sidebar";
import Private from "./Private";
import {useNavigate} from 'react-router-dom'
import MainChat from "./MainChat";
import Compass from "./Compass";

const Home = () => {
  const [user, setUser] = useState({});
  const [page, setPage] = useState("home") 
  const navigate = useNavigate();
  const [tab, setTab] = useState("add")
  const [chatting, setChatting] = useState()
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
    <div className="h-screen w-screen flex bg-[#313338] text-white">
      <Sidebar page={page} setPage={setPage} />
      <Private chatting={chatting} setChatting={setChatting} user={user && user} setUser={setUser}  />
      {page === "home" &&
      
      <MainChat chatting={chatting} setChatting={setChatting} user={user && user} tab={tab} setTab={setTab}/>
      }
      {page === "add" &&
      
      <MainChat chatting={chatting} setChatting={setChatting} user={user && user} tab={tab} setTab={setTab}/>
      }
      {page === "compass" &&
      
      <Compass user={user && user}/>
      }
    </div>
  );
};

export default Home;
