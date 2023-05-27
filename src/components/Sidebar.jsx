import React, { useEffect, useState } from "react";
import { SiGuilded } from "react-icons/si";
import {
  AiFillCamera,
  AiFillCompass,
  AiFillDelete,
  AiOutlinePlus,
} from "react-icons/ai";
import Divider from "@mui/material/Divider";
import { AnimatePresence, motion } from "framer-motion";
import Joined from "./Joined";
import { TextField } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import { client } from "../client";

const Sidebar = ({ servers, page, setPage, user,setUser }) => {
  const [open, setOpen] = useState(false);
  const [creatingServer, setCreatingServer] = useState(false);
  const [height, setHeight] = useState("558px");
  const [value, setValue] = useState("")
  const [serverIcon, setServerIcon] = useState(null);
  const [icon, setIcon] = useState(null)
  // useEffect(() => {
  //   const deleteDocument = async () => {
  //     try {
  //       // Use the Sanity client to delete the document
  //       await client.delete('4e3695de-b946-47cd-9777-ab86bfb6d300');
  //       console.log('Document deleted successfully.');
  //     } catch (error) {
  //       console.error('Error deleting document:', error);
  //     }
  //   };

  //   deleteDocument();
  // }, []);
  
  const uploadImage = (e) => {
    const selectedFile = e.target.files[0];
    // uploading asset to sanity
    if (
      selectedFile.type === "image/png" ||
      selectedFile.type === "image/svg" ||
      selectedFile.type === "image/jpeg" ||
      selectedFile.type === "image/gif" ||
      selectedFile.type === "image/tiff"
    ) {
      client.assets
        .upload("image", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((document) => {
          setServerIcon(document)
        })
        .catch((error) => {
          console.log("Upload failed:", error.message);
        });
    } else {
      console.log("error")
    }
  };

  const handleCreate = async () => {
    if (!value || !serverIcon) {
      alert('Please choose a server name and icon.');
      return;
    }
  
    try {
      const serverId = uuidv4();
  
      // Create the server document in the Sanity backend
      const server = await client.create({
        _id: serverId,
        _type: 'server',
        name: value,
        icon: serverIcon,
      });
  
      console.log('Server created:', server);
  
      // Create a channel referring to the newly created server
      const channelId = uuidv4();
      const channel = await client.create({
        _id: channelId,
        _type: 'channel',
        name: 'general',
        server: {
          _type: 'reference',
          _ref: serverId,
        },
      });
  
      console.log('Channel created:', channel);
  
      // Patch the user to join the newly created server
      const updatedUser =  client
        .patch(user._id)
        .append('joinedServers', [
          {
            _type: 'reference',
            _ref: serverId,
          },
        ]).commit().then(()=>{
          window.location.reload()
        });
  
      console.log('User updated:', updatedUser);
  
      // Additional logic to handle server creation success
  
    } catch (error) {
      console.error('Error creating server:', error);
      // Additional logic to handle server creation error
    }
  };
  
  
  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCreateServer = () => {
    setCreatingServer(true);
    setHeight("380px");

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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h1 className="text-xl">Create a server</h1>
                  <p className="text-base mt-2 text-[gray]">
                    Your server is where you and your friends hang out. Make
                    yours and start talking.
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full relative h-full"
                >
                  <div className="mb-6">
                    <h1 className="text-xl">
                      {creatingServer
                        ? "Customize your Server"
                        : "Server Created"}
                    </h1>
                    <p className="text-base mt-2 text-[gray]">
                      {creatingServer
                        ? "Give your server a personality with a name and icon. You can always change it later"
                        : "Your server has been created successfully."}
                    </p>
                  </div>
                  <div className="w-full flex items-center justify-center mt-4 flex-col">
                    <div className="h-[80px] relative w-[80px] mb-3 border-dashed border text-white flex items-center justify-center border-[white] rounded-full">
                      
                      {serverIcon ? (
                        <img
                          className="object-cover w-full h-full rounded-full"
                          src={serverIcon.url}
                          alt="Server Icon"
                        />
                      ) : (
                        <>
                          <label
                            htmlFor="icon-input"
                            className="cursor-pointer"
                          >
                            <AiFillCamera fontSize={34} />
                          </label>
                          <input
                            type="file"
                            id="icon-input"
                            className="hidden"
                            onChange={uploadImage}
                          />
                        </>
                      )}
                      {
                        <div className="absolute top-0 right-0">
                          {serverIcon && (
                            <button
                              onClick={() => setServerIcon(null)}
                              className="w-full h-full p-1 rounded-full bg-[red]"
                            >
                              <AiFillDelete fontSize={16} />
                            </button>
                          )}
                        </div>
                      }
                    </div>
                    <div className="w-full mx-3">
                      <TextField
                        label="Server Name"
                        value={value}
                        onChange={(e)=>setValue(e.target.value)}
                        variant="filled"
                        className="w-full border-4"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full absolute bottom-[-20px]">
                    <motion.button
                      className="mt-3  rounded-md  px-3 p-2 flex items-center justify-center"
                      onClick={handleGoBack}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      Go Back
                    </motion.button>
                    <motion.button
                      className="mt-3  bg-[#5865f2] rounded-md  px-3 p-2 flex items-center justify-center"
                      onClick={handleCreate}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      Create
                    </motion.button>
                  </div>
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
