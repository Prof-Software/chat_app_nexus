import React, { useState, useEffect } from "react";
import { client } from "../client";
import Sidebar from "./Sidebar";
import Private from "./Private";
import { useNavigate } from "react-router-dom";
import MainChat from "./MainChat";
import Compass from "./Compass";
import ServerChat from "./ServerChat";
import CreateServer from "./CreateServer";

const Home = () => {
  const [user, setUser] = useState({});
  const [page, setPage] = useState("home");
  const navigate = useNavigate();
  const [tab, setTab] = useState("add");
  const [chatting, setChatting] = useState();
  const [channel, setChannel] = useState("")
  const [serverData, setServerData] = useState(null);
  const [currentChannel, setCurrentChannel] = useState("general");
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
      <Sidebar user={user && user} page={page} setPage={setPage} />
      <Private
        currentChannel={currentChannel}
        setCurrentChannel={setCurrentChannel}
        page={page}
        serverData={serverData && serverData}
        chatting={chatting}
        setChatting={setChatting}
        user={user && user}
        setUser={setUser}
      />
      {page === "home" && (
        <MainChat
          chatting={chatting}
          setChatting={setChatting}
          user={user && user}
          tab={tab}
          setTab={setTab}
        />
      )}
      {page === "add" && (
        <CreateServer
          chatting={chatting}
          setChatting={setChatting}
          user={user && user}
          tab={tab}
          setTab={setTab}
        />
      )}
      {page === "compass" && <Compass user={user && user} />}
      {page !== "home" && page !== "add" && page !== "compass" && (
        <ServerChat currentChannel={currentChannel} serverData={serverData && serverData} setServerData={setServerData} page={page} user={user && user} />
      )}
    </div>
  );
};

export default Home;
