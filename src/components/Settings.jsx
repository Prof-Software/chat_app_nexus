import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Slider,
  Typography,
} from "@mui/material";
import { SiGuilded } from "react-icons/si";
import { BsImageFill } from "react-icons/bs";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { client } from "../client";
import { getCroppedImg, getRotatedImage } from "./canvasUtils";
import { getOrientation } from "get-orientation/browser";
import Cropper from "react-easy-crop";
import edit from "../assets/edit.png";
import Boost from "../assets/Boost.jsx";
import imageUrlBuilder from "@sanity/image-url";

import {
  BlockPicker,
  ChromePicker,
  GithubPicker,
  HuePicker,
  PhotoshopPicker,
  SketchPicker,
  SwatchesPicker,
  TwitterPicker,
} from "react-color";

const builder = imageUrlBuilder(client);

const userprofile = [
  "My Account",
  "Profiles",
  "Privacy & Safety",
  "Authorized Apps",
  "Devices",
  "Connections",
  "Friend Requests",
];

const ORIENTATION_TO_ANGLE = {
  3: 180,
  6: 90,
  8: -90,
};
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
          <div>{children}</div>
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
function TabContent({ activeTab, user, setActiveTab, timeElapsed }) {
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
  const [imageSrc, setImageSrc] = React.useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [color, setColor] = useState("#000000");
  const [isOpen, setIsOpen] = useState(false);
  function handleChangeColor(newColor) {
    setColor(newColor.hex);
  }
  function handleOpen() {
    if (isOpen === true) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  const cancelImage = () => {
    setImageSrc(null);
    handleAniClose();
  };
  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      console.log("donee", { croppedImage });
      setCroppedImage(croppedImage);
      setShowNotification(true);
      setImageSrc(null);
      handleAniClose();
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, rotation]);

  const onClose = useCallback(() => {
    setCroppedImage(null);
  }, []);
  const handleResetChanges = () => {
    // Reset changes made to profile picture
    setCroppedImage(null);
    setShowNotification(false);
  };

  const handleSaveChanges = () => {
    // Save changes made to profile picture to Sanity
    setShowNotification(false);
  };

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
    if (croppedImage) {
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const filename = "cropped-image.png";
      const file = new File([blob], filename, { type: blob.type });

      const uploadedImage = await client.assets.upload("image", file);

      const imageUrl = uploadedImage.url;

      client
        .patch(id)
        .set({ image: imageUrl })
        .commit()
        .then((result) => console.log("User image updated"))
        .catch((error) => console.error("Error updating user image:", error));
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
  const handleImageChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile.type === "image/png" ||
      selectedFile.type === "image/svg" ||
      selectedFile.type === "image/jpeg" ||
      selectedFile.type === "image/tiff"
    ) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(selectedFile);
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
                    <div className="text-[#a1a1a1] text-[13px]">USERNAME</div>
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
                    <div className="text-[#a1a1a1] text-[13px]">EMAIL</div>
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
                    <div className="text-[#a1a1a1] text-[13px]">
                      PHONE NUMBER
                    </div>
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
        <div className="p-6 ml-3 pt-[4.2rem] w-full overflow-auto">
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
              <div className="mt-4 gap-5 flex">
                <div className="w-[50%]">
                  <div className="flex flex-col mb-4">
                    <div className="text-[#bbbbbb] text-[13px] font-sans font-bold">
                      AVATAR
                    </div>
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
                              <div> Select An Image </div>
                              <IconButton onClick={handleAniClose}>
                                <AiOutlineClose />
                              </IconButton>
                            </div>
                            <div className=" flex gap-4">
                              <div className="h-[192px] relative text-[#bbbbbb] hover:text-[white] transition-all flex flex-col items-center justify-center bg-[#232428] w-[196px]">
                                <input
                                  onChange={handleImageChange}
                                  type="file"
                                  className="absolute top-0 left-0 h-full w-full opacity-0 cursor-pointer"
                                />
                                <div className="h-[128px] text-white flex items-center justify-center w-[128px] rounded-full bg-[#5865f2]">
                                  <AddPhotoAlternateIcon
                                    className="ml-2"
                                    fontSize="large"
                                  />
                                </div>
                                <div className=" text-[15px] mt-3 font-sans font-bold">
                                  Upload Image
                                </div>
                              </div>
                              <AnimatePresence>
                                {imageSrc && (
                                  <motion.div
                                    className="fixed h-screen w-screen top-0 left-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className=" bg-[#313338]  p-3">
                                      <div className="mb-3 text-lg">
                                        Edit Image
                                      </div>
                                      <div className="flex w-[500px] bg-[#3e3e3e] rounded-md  h-[400px] relative flex-col gap-3">
                                        <Cropper
                                          className="object-cover"
                                          image={imageSrc}
                                          crop={crop}
                                          zoom={zoom}
                                          aspect={3 / 3}
                                          onCropChange={setCrop}
                                          onCropComplete={onCropComplete}
                                          onZoomChange={setZoom}
                                          cropShape="round"
                                          showGrid={false}
                                          zoomSpeed={3}
                                        />
                                      </div>
                                      <div className="w-full flex gap-5 p-3 mt-3 items-center">
                                        <BsImageFill fontSize={24} />
                                        <Slider
                                          value={zoom}
                                          min={1}
                                          max={3}
                                          step={0.1}
                                          onChange={(e, zoom) => setZoom(zoom)}
                                        />
                                        <BsImageFill fontSize={35} />
                                      </div>
                                      <Divider />
                                      <div className="w-full mt-3 flex justify-between">
                                        <button
                                          className="text-sm p-1 px-2 rounded-md"
                                          onClick={cancelImage}
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          className="text-sm bg-[#5865f2] p-1 px-2 rounded-md"
                                          onClick={showCroppedImage}
                                        >
                                          Apply
                                        </button>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <div className="h-[192px] text-[#bbbbbb] hover:text-[white] transition-all flex flex-col items-center justify-center bg-[#232428] w-[196px]">
                                <div className="h-[128px] text-white flex items-center justify-center w-[128px] rounded-full bg-[#5865f2]">
                                  GIF
                                </div>
                                <div className=" text-[15px] mt-3 font-sans font-bold">
                                  Choose GIF
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <Divider />
                  <div className="mb-6"></div>
                  <div className="mb-4 mt-4 premiumFeatureBorder">
                    <div className="flex flex-col premium mt-4">
                      <div className="text-[#bbbbbb] flex items-center gap-2 text-base">
                        Avatar Decoration
                        <Boost />
                      </div>
                      <div className="text-[#bbbbbb] flex items-center gap-2 text-[13px] font-sans">
                        Available on Turbo through 5/10
                      </div>
                      <button className="text-[13px] text-center outline-none mr-5 w-full p-3 px-4 bg-[#5865f2] mt-3 rounded-md">
                        Change Decoration
                      </button>
                    </div>
                  </div>
                  <div className="mt-3"></div>
                  <Divider />
                  <div className="py-3 relative w-full">
                    <div className="text-[#bbbbbb] mb-2 text-[13px] font-sans font-bold">
                      Banner Color
                    </div>
                    <button
                      className="w-[67px] h-[48px] rounded-md"
                      onClick={handleOpen}
                      style={{ backgroundColor: color }}
                    />
                    <div className="absolute z-50 top-0 right-0">
                      {isOpen && (
                        <SketchPicker
                          className=""
                          color={color}
                          onChange={handleChangeColor}
                        />
                      )}
                    </div>
                    <Divider />
                  </div>
                </div>

                <div className="w-[50%]">
                  <div className="text-[#bbbbbb] mb-4 text-[13px] font-sans font-bold">
                    PREVIEW
                  </div>
                  <div className="relative w-[360px] pb-3 bg-[#232428] rounded-md">
                    <div
                      className="w-[360px] h-[60px] rounded-md"
                      style={{ backgroundColor: color }}
                    ></div>
                    {croppedImage ? (
                      <img
                        className="h-[85px] border-[4px] border-[#232428] absolute top-[5%] left-[5%] rounded-full w-[85px]"
                        src={croppedImage}
                        alt=""
                      />
                    ) : user.image ? (
                      <img
                        className="h-[85px] border-[4px] border-[#232428] absolute top-[5%] left-[5%] rounded-full w-[85px]"
                        src={user.image}
                        alt=""
                      />
                    ) : (
                      <div className="bg-[#5865f2] w-[85px] h-[85px] border-[4px] border-[#232428] absolute top-[5%] left-[5%] flex items-center justify-center rounded-full">
                        <SiGuilded fontSize={40} className="mt-2" />
                      </div>
                    )}

                    <div className="mt-14 bg-[#111214] rounded-lg w-[90%] mx-auto p-3">
                      <div className="text-xl mb-2">{user?.userId}</div>
                      <Divider />
                      <div className="mt-2">
                        <div className="text-[#dfdfdf] mb-2 text-[12px] font-sans font-bold">
                          ABOUT ME
                        </div>
                        <div className="text-[#a9a9a9] mb-4 text-[12px] font-sans font-bold">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Facere, perspiciatis!
                        </div>
                        <div className="text-[#dfdfdf] mb-2 text-[12px] font-sans font-bold">
                          CUSTOMIZING MY PROFILE
                        </div>
                        <div className="p-3 flex items-center">
                          <div className="bg-[#3c45a5] flex items-center justify-center rounded-md p-2">
                            <img
                              className="h-[48px] w-[48px]"
                              src={edit}
                              alt=""
                            />
                          </div>
                          <div className="flex px-5 flex-col">
                            <div className="text-[#dfdfdf] text-[16px]">
                              User Profile
                            </div>
                            <div className="text-[15px]">
                              {formatTime(timeElapsed)} elapsed
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="contained"
                          className="w-full"
                          color="success"
                          onClick={() => {
                            setShowNotification(!showNotification);
                          }}
                        >
                          {" "}
                          Example Button
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <AnimatePresence>
              {showNotification && (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: "20%" }}
                  className="bg-[#111214] flex p-3 items-center justify-between"
                  exit={{
                    y: "100%",
                    opacity: 0,
                    transition: {
                      duration: 0.3,
                      ease: "easeInOut",
                    },
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <h2>Careful! -- you have unsaved changes!</h2>
                  <div className="flex items-center gap-5">
                    <button onClick={handleResetChanges}>Reset</button>
                    <button
                      onClick={() => {
                        saveChanges(user?._id);
                      }}
                      className="hover:bg-[#105028] transition-all p-2 px-4 rounded-sm bg-[#248046]"
                      variant="contained"
                      style={{ color: "white", fontSize: "14px" }}
                    >
                      Save Changes
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
  const [timeElapsed, setTimeElapsed] = useState(0);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeElapsed((prevElapsedTime) => prevElapsedTime + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

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
      className="bg-[#313338] items-center flex cursor-default"
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
          timeElapsed={timeElapsed}
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
