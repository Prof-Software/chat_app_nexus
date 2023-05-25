import React, { useState } from "react";
import { SiGuilded } from "react-icons/si";
import { AiFillCompass, AiOutlinePlus } from "react-icons/ai";
import Divider from "@mui/material/Divider";
import { AnimatePresence, motion } from "framer-motion";
import Joined from "./Joined";

const Sidebar = ({ servers, page, setPage, user }) => {
  const [open, setOpen] = useState(false);
  const [creatingServer, setCreatingServer] = useState(false);
  const [height, setHeight] = useState("558px");

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCreateServer = () => {
    setCreatingServer(true);
    setHeight("300px");

    // Perform any necessary actions for server creation
  };

  const handleGoBack = () => {
    setCreatingServer(false);
    setHeight("558px");
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setCreatingServer(false);
    setHeight("558px");
  };

  const dialogVariants = {
    open: {
      opacity: 1,
      height,
      transition: {
        duration: 0.3,
      },
    },
    closed: {
      opacity: 0,
      height: "558px",
      transition: {
        duration: 0.3,
      },
    },
  };
  return (
    <div className="h-full flex flex-col w-[72px] bg-[#1e1f22]">
      <button
        onClick={() => {
          setPage("home");
        }}
        className="px-3 my-3 flex items-center justify-center relative w-[72px]"
      >
        <div
          className={`${
            page === "home" ? "bg-[#5865f2]" : "bg-[#393a3d]"
          } flex items-center transition-all duration-75 justify-center p-[0.65rem] ${
            page === "home" ? "rounded-xl" : "rounded-full"
          } hover:bg-[#5865f2] page:bg-[#4b59c6]`}
        >
          <SiGuilded fontSize={25} />
        </div>
        {page === "home" && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 bottom-0 w-[7px] bg-transparent border-r-4 border-l-white transform origin-right rounded-md"
          ></motion.div>
        )}
      </button>
      {user.joinedServers &&
        user.joinedServers.map((serverRef) => {
          return (
            <Joined
              page={page}
              setPage={setPage}
              key={serverRef?._key}
              serverRef={serverRef}
            />
          );
        })}
      <div className="w-[50%] mx-auto h-[1.4px] bg-[#393a3d]" />
      <button
        onClick={handleOpenDialog}
        className="px-3 my-2 flex items-center justify-center relative w-[72px]"
      >
        <div
          className={`${
            page === "add"
              ? "bg-[#23a559] text-white"
              : "bg-[#393a3d] text-[#23a559]"
          } flex items-center transition-all duration-75 justify-center p-[0.65rem] ${
            page === "add" ? "rounded-xl" : "rounded-full"
          } hover:bg-[#23a559] hover:text-white page:bg-[#23a559]`}
        >
          <AiOutlinePlus fontSize={25} />
        </div>
        {page === "add" && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 bottom-0 w-[7px] bg-transparent border-r-4 border-l-white transform origin-right rounded-md"
          ></motion.div>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            key="dialog"
            className="fixed h-screen w-screen top-0 left-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseDialog}
          >
            <motion.div
              className="bg-[#313338] p-4 pb-10 text-center rounded-md w-[440px] items-center flex-col flex"
              variants={dialogVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={(e) => e.stopPropagation()}
            >
              {!creatingServer ? (
                <motion.div initial={{opacity: 0}} animate={{opacity:1}} exit={{opacity:0}}>
                  <h1 className="text-xl">Create a server</h1>
                  <p className="text-base mt-2 text-[gray]">
                    Your server is where you and your friends hang out. Make yours and start talking.
                  </p>
                  <motion.button
                    className="mt-3 border-[#4a4a4a] w-full rounded-md border p-2 flex items-center justify-center"
                    onClick={handleCreateServer}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    Create my own
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div initial={{opacity: 0}} animate={{opacity:1}} exit={{opacity:0}}>
                  <h1 className="text-xl">{creatingServer ? "Creating..." : "Server Created"}</h1>
                  <p className="text-base mt-2 text-[gray]">
                    {creatingServer ? "Please wait while the server is being created." : "Your server has been created successfully."}
                  </p>
                  <motion.button
                    className="mt-3 border-[#4a4a4a] w-full rounded-md border p-2 flex items-center justify-center"
                    onClick={handleGoBack}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    Go Back
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => {
          setPage("compass");
        }}
        className="px-3 my-2 flex items-center justify-center relative w-[72px]"
      >
        <div
          className={`${
            page === "compass"
              ? "bg-[#23a559] text-white"
              : "bg-[#393a3d] text-[#23a559]"
          } flex items-center transition-all duration-75 justify-center p-[0.65rem] ${
            page === "compass" ? "rounded-xl" : "rounded-full"
          } hover:bg-[#23a559] hover:text-white page:bg-[#23a559]`}
        >
          <AiFillCompass fontSize={25} />
        </div>
        {page === "compass" && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 bottom-0 w-[7px] bg-transparent border-r-4 border-l-white transform origin-right rounded-md"
          ></motion.div>
        )}
      </button>
    </div>
  );
};

export default Sidebar;
