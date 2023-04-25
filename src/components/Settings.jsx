import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { Divider } from "@mui/material";
const userprofile = [
  "My Account",
  "Profiles",
  "Privacy & Safety",
  "Authorized Apps",
  "Devices",
  "Connections",
  "Friend Requests",
];
function TabContent({ activeTab }) {
  switch (activeTab) {
    case "My Account":
      return <div className="p-6">
        My Account
      </div>;
    case "Profiles":
      return <div>Profiles content</div>;
    case "Privacy & Safety":
      return <div>Privacy & Safety content</div>;
    case "Authorized Apps":
      return <div>Authorized Apps content</div>;
    case "Devices":
      return <div>Devices content</div>;
    case "Connections":
      return <div>Connections content</div>;
    case "Friend Requests":
      return <div>Friend Requests content</div>;
    default:
      return null;
  }
}

const Settings = ({ close, open }) => {
  const [activeTab, setActiveTab] = useState("My Account");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.keyCode === 27) {
        close();
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [open, close]);

  return (
    <motion.div
      className="bg-[#313338] items-center flex"
      style={{ height: "100vh", width: "100vw" }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
    >
      <div className="w-[477px] bg-[#2b2d31] h-full flex justify-end">
        <div className="flex w-[40%] flex-col pt-[4.25rem] gap-1 text-[#9c9c9c] mr-2">
          <h4 className="text-[13px] px-2 text-[#696969] font-sans font-bold">
            USER SETTINGS
          </h4>
          {userprofile.map((tab) => (
            <h4
              key={tab}
              className={`text-[15px] px-2 rounded-md py-1 hover:bg-[#ffffff0c] hover:text-[#bdbdbd]  font-sans font-semibold cursor-pointer ${
                activeTab === tab ? "bg-[#ffffff1e] text-white" : ""
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </h4>
          ))}
          <Divider />
        </div>
      </div>
      <div className="flex h-full w-[49%]">
        <TabContent activeTab={activeTab} />
      </div>
      <div className="flex flex-col items-center justify-center absolute text-[#9d9d9d] gap-2 top-[9%] right-[17.5%]">
        <button className="   border border-[#9d9d9d]  rounded-full p-2 ">
          <AiOutlineClose fontSize={20} onClick={close} />
        </button>
        ESC
      </div>
    </motion.div>
  );
};

export default Settings;
