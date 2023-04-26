import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { SiGuilded } from "react-icons/si";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { client } from "../client";
const userprofile = [
  "My Account",
  "Profiles",
  "Privacy & Safety",
  "Authorized Apps",
  "Devices",
  "Connections",
  "Friend Requests",
];
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
function TabContent({ activeTab, user, setActiveTab }) {
  const username = user?.userId?.split("#")[0];
  const discriminator = user?.userId?.split("#")[1];
  const [localPart, domain] = user?.email?.split("@");
  const [showMaskedEmail, setShowMaskedEmail] = useState(true);
  const toggleShowEmail = () => {
    setShowMaskedEmail(!showMaskedEmail);
  };
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState();
  const [fields, setFields] = useState();
  const [category, setCategory] = useState();
  const [imageAsset, setImageAsset] = useState();
  const [input, setInput] = useState(false);
  const [newName, setNewName] = useState("");
  const [newId, setNewId] = useState("");
  const [newAbout, setNewAbout] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [followerData, setFollowerData] = useState([]);
  const [cropImg, setCropImg] = useState(false)
  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };

  const handleAniClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setOpen(false);
      setIsAnimating(false);
    }, 100); // set the timeout to match the duration of the animation
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const saveChanges = async (id) => {
    if (newName) {
      client
        .patch(id)
        .set({ userName: newName })
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
    if (profileImage) {
      client
        .patch(id)
        .set({ image: profileImage?.url })
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
    if (coverImage) {
      await client
        .patch(id)
        .set({
          cover: {
            _type: "reference",
            _ref: coverImage._id,
          },
        })
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
    if (newAbout) {
      client
        .patch(id)
        .setIfMissing({ about: newAbout })
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
    if (newId) {
      const query = `*[userId == "${newId}"]`;
      client
        .fetch(query)
        .then((result) => {
          // If a user with the new ID already exists, display an error message
          if (result.length > 0) {
            alert("The user ID you entered is already taken.");
          } else {
            // If the new ID is available, make the patch request to update the user's ID
            client
              .patch(id)
              .set({ userId: newId })
              .commit()
              .then(() => {
                window.history.replaceState(
                  null,
                  null,
                  `/user-profile/${newId}`
                );
                window.location.reload();
              });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };
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
          setProfileImage(document);
        })
        .catch((error) => {
          console.log("Upload failed:", error.message);
        });
    } else {
      console.log("first");
    }
  };

  switch (activeTab) {
    case "My Account":
      return (
        <div className="p-6 ml-3 pt-[4.2rem]">
          <h3 className="text-lg">My Account</h3>
          <div className="w-[660px] relative rounded-md mt-4 h-[398px] bg-[#1e1f22]">
            <div className="w-full h-[100px] rounded-t-md bg-[#b181bb]"></div>
            <div className="bg-[#5865f2] absolute top-[16%] left-[4%] border-[6px] border-[#1e1f22] w-[100px] h-[100px] my-2 flex items-center justify-center rounded-full">
              <SiGuilded className="mt-2" fontSize={55} />
            </div>
            <div className="ml-[8.7rem] flex items-center justify-between">
              <h2 className="text-xl mt-3 flex items-center">
                <span className="text-2xl" style={{ color: "white" }}>
                  {username}
                </span>
                <span
                  className="font-sans font-bold"
                  style={{ color: "#9c9c9c" }}
                >
                  #{discriminator}
                </span>
              </h2>
              <button
                onClick={() => setActiveTab("Profiles")}
                className="text-[13px] mr-5 p-2 px-3 bg-[#5865f2] mt-3 rounded-lg"
              >
                Edit User Profile
              </button>
            </div>
            <div className="bg-[#2b2d31] w-[94%] h-[50%] p-4 mt-10 mx-auto">
              <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <p className="text-[#a1a1a1] text-[13px]">USERNAME</p>
                    <div className="flex">
                      <span className="" style={{ color: "white" }}>
                        {username}
                      </span>
                      <span className="font-sans" style={{ color: "#9c9c9c" }}>
                        #{discriminator}
                      </span>
                    </div>
                  </div>
                  <button className="bg-[#4e5058] p-1 px-3 rounded-md text-sm">
                    Edit
                  </button>
                </div>
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <p className="text-[#a1a1a1] text-[13px]">EMAIL</p>
                    <div className="flex gap-3">
                      {showMaskedEmail
                        ? localPart.replace(/./g, "*") + "@" + domain
                        : user?.email}
                      <button
                        className="text-[12px] text-blue-400"
                        onClick={toggleShowEmail}
                      >
                        {showMaskedEmail ? "Reveal" : "Hide"}
                      </button>
                    </div>
                  </div>
                  <button className="bg-[#4e5058] p-1 px-3 rounded-md text-sm">
                    Edit
                  </button>
                </div>
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <p className="text-[#a1a1a1] text-[13px]">PHONE NUMBER</p>
                    <div className="flex">
                      You haven't added a phone number yet.
                    </div>
                  </div>
                  <button className="bg-[#4e5058] p-1 px-3 rounded-md text-sm">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    case "Profiles":
      return (
        <div className="p-6 ml-3 pt-[4.2rem] w-full">
          <h3 className="text-lg">Profiles</h3>
          <Box sx={{ width: "100%" }}>
            <Box
              className=""
              sx={{ borderBottom: 1, borderColor: "divider", width: "full" }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="User Profile" {...a11yProps(0)} />
                <Tab label="Server Profiles" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <div className="mt-4 flex">
                <div className="w-[50%]">
                  <div className="flex flex-col">
                    <p className="text-[#bbbbbb] text-[13px] font-sans font-bold">
                      AVATAR
                    </p>
                    <button
                      onClick={() => {
                        setOpen(!open);
                      }}
                      className="text-[13px] outline-none mr-5 w-[120px] p-1 px-3 bg-[#5865f2] mt-3 rounded-md"
                    >
                      Change Avatar
                    </button>
                    <AnimatePresence>
                      {open && (
                        <motion.div
                          className="fixed h-screen w-screen top-0 left-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          onAnimationComplete={handleAnimationComplete}
                          onClick={handleAniClose}
                        >
                          <motion.div
                            className="bg-[#313338] p-4 pb-10 rounded-md items-center flex-col flex"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex w-full items-center justify-between mb-4 text-lg">
                              <h1> Select An Image </h1>
                              <IconButton onClick={handleAniClose}>
                                <AiOutlineClose />
                              </IconButton>
                            </div>
                            <div className=" flex gap-4">
                              <div className="h-[192px] relative text-[#bbbbbb] hover:text-[white] transition-all flex flex-col items-center justify-center bg-[#232428] w-[196px]">
                                <input
                                  onChange={uploadImage}
                                  type="file"
                                  className="absolute top-0 left-0 h-full w-full opacity-0 cursor-pointer"
                                />
                                <div className="h-[128px] text-white flex items-center justify-center w-[128px] rounded-full bg-[#5865f2]">
                                  <AddPhotoAlternateIcon
                                    className="ml-2"
                                    fontSize="large"
                                  />
                                </div>
                                <p className=" text-[15px] mt-3 font-sans font-bold">
                                  Upload Image
                                </p>
                              </div>
                              <div className="h-[192px] text-[#bbbbbb] hover:text-[white] transition-all flex flex-col items-center justify-center bg-[#232428] w-[196px]">
                                <div className="h-[128px] text-white flex items-center justify-center w-[128px] rounded-full bg-[#5865f2]">
                                  GIF
                                </div>
                                <p className=" text-[15px] mt-3 font-sans font-bold">
                                  Choose GIF
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="w-[50%]">
                  <p className="text-[#bbbbbb] text-[13px] font-sans font-bold">
                    PREVIEW
                  </p>
                </div>
              </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              Item Two
            </TabPanel>
          </Box>
        </div>
      );
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

const Settings = ({ close, open, user }) => {
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
        <TabContent
          setActiveTab={setActiveTab}
          user={user}
          activeTab={activeTab}
        />
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
