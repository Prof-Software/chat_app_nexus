import React, { useEffect, useRef, useState } from "react";
import { Divider, IconButton } from "@mui/material";
import { FaUserFriends } from "react-icons/fa";
import { IoMdHelpCircle } from "react-icons/io";
import { BsFillChatRightFill, BsFillReplyFill } from "react-icons/bs";
import { RiChatNewFill, RiChatNewLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { MdAddReaction, MdAllInbox, MdDelete, MdInbox } from "react-icons/md";
import { client, urlFor } from "../client";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import {
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineGif,
  AiOutlineMore,
  AiOutlinePlus,
  AiOutlineSearch,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { SiGuilded, SiNuke } from "react-icons/si";
import { FiMoreHorizontal, FiMoreVertical } from "react-icons/fi";
import moment from "moment";
import At from "../assets/At";
import { format, isToday, isYesterday } from "date-fns";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import wupmus from '../assets/wupmus.svg'
// Define some variants for the motion animation
const sidebarVariants = {
  open: {
    x: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  closed: {
    x: "100%",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};
const MainChat = ({ user, tab, setTab, chatting }) => {
  const [active, setActive] = useState("");
  const [frndreq, setFrndreq] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [imageAsset, setImageAsset] = useState();
  const [loading, setLoading] = useState(false);
  const pickerContainerRef = useRef(null);
  const [isVoiceTyping, setIsVoiceTyping] = useState(false);
  const messageContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [spoiler, setSpoiler] = useState(false);
  const [msgSpoiler, setMsgSpoiler] = useState(true);
  const [spoilerRemoved, setSpoilerRemoved] = useState(false);
  const [hover, setHover] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState([]);
  const apiKey = "11nlisRA1etJWpPEQ940bZz5VOgstqwa";
  const [openGif, setOpenGif] = useState(false);
  const [selectedGif, setSelectedGif] = useState(null);
  const [userprofile, setUserprofile] = useState(true);

  const searchGifs = async () => {
    const response = await axios.get(
      `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=50`
    );
    setGifs(response.data.data);
  };

  const handleGifClick = (gifUrl) => {
    setSelectedGif(gifUrl);
  };

  const handleSearch = async () => {
    const newGifs = await searchGifs(apiKey, query);
    setGifs(newGifs);
  };

  const handleDelete = (messageId) => {
    // Remove the message from the messages state array
    // setMessages((messages) =>
    //   messages.filter((message) => message?._id !== messageId)
    // );

    // Send a delete request to the server to remove the message from the backend
    client
      .patch(messageId)
      .set({ message: "Message Deleted" })
      .commit()
      .catch((error) => {
        console.error(`Failed to delete message with ID ${messageId}`, error);
        // If the delete request fails, add the message back to the messages state array
        setMessages((messages) => [...messages, message]);
      });
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [hoverState, setHoverState] = useState({});

  const handleSpoilerClick = (messageId) => {
    setMessages((messages) =>
      messages.map((message) =>
        message?._id === messageId ? { ...message, spoiler: false } : message
      )
    );
    setSpoilerRemoved(true);
  };

  const scrollToBottom = () => {
    const parentContainer = messagesEndRef.current?.closest(".overflow-auto");
    const lastChild = parentContainer?.lastElementChild;
    lastChild?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  useEffect(() => {
    if (!spoilerRemoved && !hover) {
      scrollToBottom();
    }
    setSpoilerRemoved(false);
    setHover(false);
  }, [messages]);
  const handleHover = (messageId, isHovered) => {
    setMessages((messages) =>
      messages.map((message) =>
        message?._id === messageId ? { ...message, hover: isHovered } : message
      )
    );
    setAnchorEl(false);
    setHover(true);
  };

  // console.log(messages)

  const imageRef = useRef(null);
  useEffect(() => {
    setContainerWidth(imageRef?.current ? imageRef?.current?.offsetWidth : 0);
  }, [imageRef?.current]);

  const setVisibilty = () => {
    if (spoiler === false) {
      setSpoiler(true);
    } else {
      setSpoiler(false);
    }
  };
  const sortedMessages = messages.sort((a, b) =>
    b._createdAt.localeCompare(a._createdAt)
  );

  const groupedMessages = {};

  messages.forEach((message) => {
    const date = new Date(message._createdAt);
    const dateStr = format(date, "MMM dd");
    if (!groupedMessages[dateStr]) {
      groupedMessages[dateStr] = [];
    }
    groupedMessages[dateStr].push(message);
  });

  const sortedKeys = Object.keys(groupedMessages).sort((a, b) => {
    // if a or b is "Today", set it to the current date
    if (a === "Today") a = moment().format("MMM DD");
    if (b === "Today") b = moment().format("MMM DD");

    // if a or b is "Yesterday", set it to yesterday's date
    if (a === "Yesterday") a = moment().subtract(1, "days").format("MMM DD");
    if (b === "Yesterday") b = moment().subtract(1, "days").format("MMM DD");

    // compare the dates in descending order
    return moment(b, "MMM DD").diff(moment(a, "MMM DD"));
  });

  useEffect(() => {
    const fetchMessages = async () => {
      const query = `*[_type == "message" && (sender == "${user?._id}" && receiver == "${chatting?._id}" || sender == "${chatting?._id}" && receiver == "${user?._id}") && !defined(deleted)] | order(timestamp asc)`;
      const result = await client.fetch(query);
      setMessages(result);
    };

    if (user && chatting) {
      fetchMessages();
    }

    const subscription = client
      .listen(
        `*[_type == "message" && (sender == "${user?._id}" && receiver == "${chatting?._id}" || sender == "${chatting?._id}" && receiver == "${user?._id}") && !defined(deleted)]`
      )
      .subscribe((result) => {
        console.log("New message received:", result.result);
        if (result.result?._createdAt && !result.result.deleted) {
          // check if _createdAt exists
          setMessages((prevMessages) => [...prevMessages, result.result]);
        }
      });

    return () => subscription.unsubscribe();
  }, [user, chatting]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        message: message,
        image: imageAsset && imageAsset,
        spoiler: spoiler,
        sender: user?._id,
        receiver: chatting?._id,
        timestamp: moment().toISOString(),
        gif: selectedGif && selectedGif,
      };

      try {
        await client.create({
          _type: "message",
          ...newMessage,
        });
        setMessage("");
        setImageAsset(null);
        setOpenGif(false);
        setSelectedGif(null);

        const date = new Date(message._createdAt);
        const dateStr = format(date, "MMM dd");
        if (!groupedMessages[dateStr]) {
          groupedMessages[dateStr] = [];
        }
        groupedMessages[dateStr].push(message);
        messageContainerRef.current.scrollIntoView({ behavior: "smooth" });
        setMessages([...messages, { ...newMessage, isSentByMe: true }]);

        setImageAsset(null);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    const fetchFriends = async () => {
      const query = `*[_type == "friendRequest" && (sender._ref == "${user?._id}" || receiver._ref == "${user?._id}") && status == "accepted"] {
        _id,
        status,
        sender->{
          _id,
          userName,
          userId,
          image,
        },
        receiver->{
          _id,
          userName,
          userId,
          image,
        }
      }`;
      const acceptedRequests = await client.fetch(query);
      setFriends(acceptedRequests);
    };
    fetchFriends();
  }, [user?._id]);

  const handleOnline = () => {};
  const handleAll = () => {
    setActive("all");
    setTab("all");
  };
  const handlePending = () => {
    setActive("pending");
    setTab("pending");
  };
  const handleAdd = () => {
    setActive("add");
    setTab("add");
  };

  useEffect(() => {
    const fetchFriendRequests = async () => {
      const outgoingRequests = await client.fetch(
        `*[_type == "friendRequest" && sender._ref == "${user?._id}" && status == "pending"]{
            _id,
            receiver->{name, userId},
            sentAt
        }`
      );
      const incomingRequests = await client.fetch(
        `*[_type == "friendRequest" && receiver._ref == "${user?._id}" && status == "pending"]{
            _id,
            sender->{name, userId},
            sentAt
        }`
      );
      setFriendRequests([...outgoingRequests, ...incomingRequests]);
    };
    fetchFriendRequests();
  }, [user?._id]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
      setWrongImageType(false);
      setLoading(true);
      client.assets
        .upload("image", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Upload failed:", error.message);
        });
    } else {
      setLoading(false);
      setWrongImageType(true);
    }
  };

  const cancelFriendRequest = (request) => {
    client
      .delete(request?._id)
      .then(() => {
        // Remove the request from the pendingRequests array
        setFriendRequests(friendRequests.filter((r) => r?._id !== request?._id));
        // Show a success message
        setSnackbarMessage("Friend request canceled");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        // Show an error message
        setSnackbarMessage(`Error: ${error.message}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };
  const acceptFriendRequest = async (requestId) => {
    try {
      // Send a PATCH request to update the friend request status
      const response = await client
        .patch(requestId)
        .set({ status: "accepted" })
        .commit();
      setSnackbarMessage("Friend request Accepted");
      setSnackbarOpen(true);
      // Update the friend requests state to remove the accepted request
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request?._id !== requestId)
      );

      // Add the accepted friend to the friends state
      // setFriends((prevFriends) => [
      //   ...prevFriends,
      //   response.result.sender._ref === user?._id
      //     ? response.result.receiver
      //     : response.result.sender,
      // ]);
    } catch (error) {
      console.error("Failed to accept friend request:", error.message);
    }
  };

  const sendFriendRequest = () => {
    if (!frndreq) return;

    // Find the user by userId
    client
      .fetch(`*[_type == "user" && userId == "${frndreq}"]`)
      .then((data) => {
        if (data.length > 0) {
          const receiver = data[0];

          // Create the friend request document
          const friendRequest = {
            _type: "friendRequest",
            sender: {
              _type: "reference",
              _ref: user?._id, // Reference to the current user document
            },
            receiver: {
              _type: "reference",
              _ref: receiver?._id, // Reference to the receiver user document
            },
            status: "pending",
            sentAt: new Date().toISOString(),
          };

          // Save the friend request to the database
          client
            .create(friendRequest)
            .then(() => {
              setFrndreq("");
              setSnackbarMessage("Friend Request Sent Successfully");
              setSnackbarSeverity("success");
              setSnackbarOpen(true);
            })
            .catch((error) => {
              setSnackbarMessage(`Error: ${error.message}`);
              setSnackbarSeverity("error");
              setSnackbarOpen(true);
            });
        } else {
          setSnackbarMessage("User not found");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      })
      .catch((error) => {
        setSnackbarMessage(`Error: ${error.message}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnackbarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div className="w-full h-[100vh]">
      {chatting ? (
        <div className="flex flex-col">
          <div className="h-[48px] p-2 flex justify-between">
            <div className="text-[1.15rem] flex items-center gap-3 ml-5">
              <span className="text-[gray]">
                <At />
              </span>{" "}
              {chatting.userName}
            </div>
            <div
              onClick={() => {
                setUserprofile(!userprofile);
              }}
              className="text-[1.15rem] text-[gray] flex items-center gap-3 ml-5"
            >
              <CgProfile fontSize={30} />
            </div>
          </div>
          <Divider />
          <div className="h-[100vh] flex flex-col">
            <div
              ref={messagesEndRef}
              className="h-[90vh]  w-[full] overflow-auto"
            >
              <div className="">
                <div className="mt-5 flex flex-col pl-4">
                  {chatting?.image ? (
                    <img
                      className="h-[80px] rounded-full w-[80px]"
                      src={chatting?.image}
                      alt=""
                    />
                  ) : (
                    <div className="h-[80px] flex items-center justify-center rounded-full bg-[#5865f2] w-[80px]">
                      <SiGuilded fontSize={40} className="text-white" />
                    </div>
                  )}
                  <h1 className="text-3xl mt-3 font-bold font-sans">
                    {chatting?.userName}
                  </h1>
                  <p className="text-base mt-3 text-[#b1b1b1]">
                    This is the beginning of your direct message history with{" "}
                    <span className="text-[#e2dfdf] font-sans font-bold">
                      {chatting?.userName}
                    </span>
                    .
                  </p>
                  <div className="mt-6 flex gap-4 items-center">
                    <p className="text-sm text-[#b1b1b1]">
                      No servers in common
                    </p>
                    <button className="text-sm bg-[#4e5058] py-1 px-3 rounded-sm hover:bg-[#666] transition-all">
                      Remove Friend
                    </button>
                    <button className="text-sm bg-[#4e5058] py-1 px-3 rounded-sm hover:bg-[#666] transition-all">
                      Block
                    </button>
                  </div>
                </div>
                <div className="flex">
                  <div
                    className={`flex flex-col ${
                      userprofile ? "w-[70%]" : "w-full"
                    }`}
                  >
                    {sortedKeys.reverse().map((dateStr) => (
                      <div key={dateStr} className="gap-4 w-full flex flex-col">
                        <div className="my-4 text-[white] flex items-center justify-center w-full font-bold text-center">
                          <div className="w-[98%] m-auto relative">
                            <div className="absolute h-[10px] bottom-[-18px] w-full">
                              <Divider />
                            </div>
                            <p className="absolute right-[48%] top-[0%] px-3 bg-[#313338] text-[12px] text-[gray]">
                              {dateStr}
                            </p>
                          </div>
                        </div>
                        {groupedMessages[dateStr]
                          .reverse()
                          .map((message, index) => (
                            <div
                              className={` my-5 ${
                                message.deleted === true && "hidden"
                              } py-4 flex flex-col bg-[#313338] pl-4 hover:bg-[#2e3035] relative `}
                              key={index}
                              onMouseEnter={() =>
                                handleHover(message?._id, true)
                              }
                              onMouseLeave={() =>
                                handleHover(message?._id, false)
                              }
                            >
                              <div className="flex relative ">
                                {message.hover && (
                                  <div className="absolute top-[-25px] rounded-sm border border-[#1c1d20] right-[10%] bg-[#303237]">
                                    <button className=" p-1 px-3 text-[gray] hover:bg-[#ffffff18] hover:text-white">
                                      <MdAddReaction fontSize={25} />
                                    </button>
                                    <button className=" p-1 px-3 text-[gray] hover:bg-[#ffffff18] hover:text-white">
                                      <BsFillReplyFill fontSize={25} />
                                    </button>
                                    <button
                                      onClick={handleClick}
                                      className=" p-1 px-3 text-[gray] hover:bg-[#ffffff18] hover:text-white"
                                    >
                                      <FiMoreHorizontal fontSize={25} />
                                    </button>
                                    <Menu
                                      id="basic-menu"
                                      anchorEl={anchorEl}
                                      open={open}
                                      onClose={handleClose}
                                    >
                                      {message.sender === user?._id ? (
                                        <MenuItem
                                          className="text-[red]"
                                          onClick={() => {
                                            handleDelete(message?._id);
                                          }}
                                        >
                                          Delete Message
                                        </MenuItem>
                                      ) : (
                                        <MenuItem
                                          className="text-[red]"
                                          onClick={handleClose}
                                        >
                                          Report Message
                                        </MenuItem>
                                      )}
                                    </Menu>
                                  </div>
                                )}
                                {message.sender === user?._id ? (
                                  <div className="absolute top-0">
                                    {user?.image ? (
                                      <img
                                        className="h-[40px] rounded-full w-[40px]"
                                        src={user?.image}
                                        alt=""
                                      />
                                    ) : (
                                      <div className="h-[40px] flex items-center justify-center rounded-full bg-[#5865f2] w-[40px]">
                                        <SiGuilded
                                          fontSize={20}
                                          className="text-white"
                                        />
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="absolute top-0">
                                    {chatting?.image ? (
                                      <img
                                        className="h-[40px] rounded-full w-[40px]"
                                        src={chatting?.image}
                                        alt=""
                                      />
                                    ) : (
                                      <div className="h-[40px] flex items-center justify-center rounded-full bg-[#5865f2] w-[40px]">
                                        <SiGuilded
                                          fontSize={20}
                                          className="text-white"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                                <div className="flex items-center gap-2 absolute top-0 ml-[48px]">
                                  {message.sender === user?._id
                                    ? user?.userName
                                    : chatting?.userName}
                                  <p className={`text-[#929292] text-[13px]`}>
                                    {moment(message._createdAt).format(
                                      "MM/DD/YYYY hh:mm a"
                                    )}
                                  </p>
                                </div>
                              </div>

                              <div
                                className={`text-[16px] text-justify max-w-[50%] mt-6 text-[#dbdee1] font-sans flex flex-col ml-[48px] rounded-md`}
                              >
                                {message?.message}
                                {message?.image && (
                                  <div className="mt-3 ">
                                    <div className="">
                                      {message?.spoiler !== true ? (
                                        <div className="h-[350px] w-[350px] ">
                                          <img
                                            ref={imageRef}
                                            src={message.image.url}
                                            className="object-cover  w-[350px] h-[350px] bg-black rounded-md"
                                            alt=""
                                          />
                                        </div>
                                      ) : (
                                        <div
                                          className="h-[350px] w-[350px]  flex items-center justify-center rounded-md"
                                          style={{
                                            backgroundImage: `url(${message.image.url})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            maxHeight: "350px",
                                            backgroundColor: "black",
                                            borderRadius: "0.375rem",
                                          }}
                                        >
                                          {message.spoiler === true && (
                                            <div className="h-full w-full flex items-center justify-center backdrop-blur-3xl rounded-md">
                                              <button
                                                onClick={() =>
                                                  handleSpoilerClick(
                                                    message?._id
                                                  )
                                                }
                                                className="bg-black px-4 p-2 text-xl rounded-full"
                                              >
                                                SPOILER
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                {message?.gif && (
                                  <div className="mt-3 ">
                                    <div className="h-[350px]">
                                      <img
                                        ref={imageRef}
                                        src={message.gif}
                                        className="object-cover h-[350px] bg-black rounded-md"
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                  <AnimatePresence>
                    {userprofile && (
                      <motion.div
                        className="w-[23%] h-[100vh] top-0 mt-[49px] absolute right-0 bg-[#232428]"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={sidebarVariants}
                      >
                        <div className="relative">
                          {chatting?.banner ? (
                            <div
                              className="w-full h-[120px]"
                              style={{ backgroundColor: chatting?.banner }}
                            ></div>
                          ) : (
                            <div
                              className="w-full h-[120px]"
                              style={{ backgroundColor: "#5d64f4" }}
                            ></div>
                          )}
                          {chatting?.image ? (
                            <img
                              src={chatting?.image}
                              className="h-[100px] w-[100px] rounded-full absolute top-[50%] left-[5%] border-[4px] border-[#232428]"
                              alt=""
                            />
                          ) : (
                            <div className="bg-[#5865f2]  text-white w-[100px] h-[100px] flex items-center justify-center rounded-full  absolute top-[50%] left-[5%] border-[4px] border-[#232428]">
                              <SiGuilded fontSize={40} className="mt-2" />
                            </div>
                          )}
                        </div>
                        <div className="bg-[#111214] rounded-md w-[90%] mx-auto mt-[60px] p-2 text-lg">
                          <h1 className="mb-3">{chatting?.userId}</h1>
                          <Divider />
                          <p className="font-sans text-[12px] mt-3 text-[#b9b9b9] font-bold">
                            NEXUS MEMBER SINCE
                          </p>
                          <p className="text-[12px] mb-3 text-[#ffffff]">
                            {moment(chatting?._createdAt).format(
                              "MMM DD, YYYY"
                            )}
                          </p>
                          <Divider />
                          <p className="font-sans text-[12px] mt-3 text-[#b9b9b9] font-bold">
                            NOTE
                          </p>
                          <p className="text-[11px] mb-3 text-[#c3c3c3]">
                            Click to add note
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div></div>
            </div>
            <div
              className={`${
                userprofile ? "w-[70%]" : "w-[100%]"
              } mb-16 flex flex-col p-2`}
            >
              <div className={`w-[90%]   bg-[#] bg-none m-auto rounded-t-md`}>
                {imageAsset ? (
                  <div className="ml-2  p-2 mt-4">
                    <div className="relative max-w-[180px]">
                      <div className="flex flex-col relative mb-3">
                        <img
                          src={imageAsset?.url}
                          alt="uploaded-pic"
                          className={`max-h-[180px]  mb-3 object-cover bg-black rounded-md  max-w-[180px]`}
                        />
                        {spoiler === true && (
                          <div className="w-full backdrop-blur-xl absolute top-0 rounded-md h-full flex items-center justify-center">
                            <button
                              onClick={() => setSpoiler(!spoiler)}
                              className="bg-black text-white px-4 p-1 text-base rounded-full"
                            >
                              SPOILER
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="absolute top-[-1rem] bg-[#313338] shadow-md rounded-md right-[-1rem]">
                        <button
                          type="button"
                          className=" p-1 text-[#b63434] rounded-full text-xl cursor-pointer outline-none  transition-all duration-500 ease-in-out"
                          onClick={() => setImageAsset(null)}
                        >
                          <MdDelete />
                        </button>
                        <button
                          type="button"
                          className=" p-1 text-[#ffffff] rounded-full text-xl cursor-pointer outline-none  transition-all duration-500 ease-in-out"
                          onClick={() => setImageAsset(null)}
                        >
                          <AiOutlineEdit />
                        </button>
                        <button
                          type="button"
                          className=" p-1 text-[#ffffff] rounded-full text-xl cursor-pointer outline-none  transition-all duration-500 ease-in-out"
                          onClick={setVisibilty}
                        >
                          <AiOutlineEye />
                        </button>
                      </div>
                    </div>
                    <Divider />
                  </div>
                ) : (
                  ""
                )}
                {selectedGif ? (
                  <div className="ml-2  p-2 mt-4">
                    <div className="relative max-w-[180px]">
                      <div className="flex flex-col relative mb-3">
                        <img
                          src={selectedGif}
                          alt="uploaded-pic"
                          className={`max-h-[180px]  mb-3 object-cover bg-black rounded-md  max-w-[180px]`}
                        />
                      </div>
                      <div className="absolute top-[-1rem] bg-[#313338] shadow-md rounded-md right-[-1rem]">
                        <button
                          type="button"
                          className=" p-1 text-[#b63434] rounded-full text-xl cursor-pointer outline-none  transition-all duration-500 ease-in-out"
                          onClick={() => setSelectedGif(null)}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                    <Divider />
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div
                className={`${
                  userprofile ? "w-[100%]" : "w-[90%]"
                } relative m-auto`}
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      // Enter key
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`Message @${chatting?.userName}`}
                  className={`bg-[#383a40] pl-12 ${
                    !imageAsset ? "rounded-md" : "rounded-b-md"
                  } outline-none p-3 text-lg h-full w-full `}
                  name=""
                  id=""
                />
                <div className="p-[2px] cursor-pointer absolute top-[26%] ml-3 bg-[#b5bac1] text-[#383a40] rounded-full">
                  <input
                    type="file"
                    multiple
                    name="upload-image"
                    onChange={uploadImage}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input">
                    <AiOutlinePlus />
                  </label>
                </div>
                <div
                  onClick={() => {
                    setOpenGif(!openGif);
                  }}
                  className="p-[2px] cursor-pointer absolute right-0 top-[26%] mr-3 bg-[#b5bac1] text-[#383a40] rounded-sm"
                >
                  <AiOutlineGif fontSize={20} />
                </div>
                {openGif && (
                  <div className="absolute top-[-420px] right-0 h-[400px] rounded-md w-[400px] bg-[#1e1e1e]">
                    <input
                      type="text"
                      value={query}
                      className="bg-black"
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <button onClick={searchGifs}>Search</button>

                    <div className="flex gap-3 flex-wrap h-[90%] overflow-auto items-center justify-center">
                      {gifs.map((gif) => (
                        <img
                          key={gif.id}
                          src={gif.images.fixed_height.url}
                          alt={gif.title}
                          onClick={() =>
                            handleGifClick(gif.images.fixed_height.url)
                          }
                          className={
                            selectedGif === gif.images.fixed_height.url
                              ? "border-2 border-blue-500"
                              : ""
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message={`${snackbarMessage}`}
            action={action}
          />
          <div className="h-[48px] p-3 flex items-center justify-between">
            <div className="flex items-center">
              <button className="flex px-2 items-center gap-2 cursor-default border-r border-r-[#555555]">
                <FaUserFriends fontSize={20} className="text-[gray]" />
                Friends
              </button>
              <button
                onClick={() => {
                  setActive("online");
                }}
                className={`flex ${
                  active === "online" && "bg-[#ffffff20] text-white rounded-md"
                } hover:bg-[#ffffff0d] px-2 text-[#828282] items-center gap-2 mx-3`}
              >
                Online
              </button>
              <button
                onClick={handleAll}
                className={`flex ${
                  tab === "all" && "bg-[#ffffff20] text-white rounded-md"
                } hover:bg-[#ffffff0d] px-2 text-[#828282] items-center gap-2 mx-3`}
              >
                All
              </button>
              <button
                onClick={handlePending}
                className={`flex ${
                  tab === "pending" && "bg-[#ffffff20] text-white rounded-md"
                } hover:bg-[#ffffff0d] px-2 text-[#828282] items-center gap-2 mx-3`}
              >
                Pending
              </button>
              <button
                onClick={() => {
                  setActive("Blocked");
                }}
                className={`flex ${
                  active === "Blocked" && "bg-[#ffffff20] text-white rounded-md"
                } hover:bg-[#ffffff0d] px-2 text-[#828282] items-center gap-2 mx-3`}
              >
                Blocked
              </button>
              <button
                onClick={handleAdd}
                className={`flex ${
                  tab === "add"
                    ? "bg-[#2f3136] text-[#34aa5f] rounded-md"
                    : "text-[white]"
                } px-2 bg-[#248046] rounded-md  items-center gap-2 mx-3`}
              >
                Add Friend
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-[#a2a2a2] px-3 border-r border-r-[#555555]">
                <RiChatNewFill fontSize={25} />
              </button>
              <button className="text-[#a2a2a2]">
                <MdInbox fontSize={25} />
              </button>
              <button className="text-[#349f5c]">
                <IoMdHelpCircle fontSize={25} />
              </button>
            </div>
          </div>
          <Divider />
          <div className="w-full h-full flex">
            {tab === "add" && (
              <div className="flex flex-col w-[70%]">
                <div className="w-full p-6">
                  <h1 className="text-base uppercase">Add Friend</h1>
                  <p className="text-sm mt-2 text-[#959595]">
                    You can add a friend by their Nexus Tag. Its Case Sensitive
                  </p>
                  <div className="relative">
                    <input
                      value={frndreq}
                      onChange={(e) => {
                        setFrndreq(e.target.value);
                      }}
                      className="w-[90%] focus:shadow placeholder:font-sans focus:shadow-blue-400 outline-none my-2 bg-[#1e1f22] p-3 rounded-md"
                      placeholder="Enter a Username#0000"
                      type="text"
                      name=""
                      id=""
                    />
                    <button
                      onClick={sendFriendRequest}
                      className={`text-[13px] px-4 outline-none ${
                        !frndreq && "opacity-40"
                      } absolute top-[22%] right-[12%] bg-[#5865f2] p-[0.47rem] rounded-md`}
                    >
                      Send Friend Request
                    </button>
                  </div>
                </div>
                <Divider />
                <div className="w-full flex flex-col h-full items-center justify-center">
                    <img src={wupmus} alt="" />
                    <p className="text-[gray] mt-8 mb-16">Bluno is waiting on friends. You don't have to though!</p>
                </div>
              </div>
            )}
            {tab === "all" && (
              <div className="flex flex-col w-[70%]">
                <div className="w-full p-6">
                  <div className="relative">
                    <input
                      className="w-[100%] focus:shadow placeholder:font-sans focus:shadow-blue-400 outline-none my-2 bg-[#1e1f22] px-2 p-[0.28rem] rounded-md"
                      placeholder="Search"
                      type="text"
                      name=""
                      id=""
                    />
                    <button
                      className={`text-[13px] px-4 outline-none ${
                        !frndreq && "opacity-40"
                      } absolute top-[13%] right-[0.5%] p-[0.47rem] rounded-md`}
                    >
                      <AiOutlineSearch fontSize={20} />
                    </button>
                  </div>

                  <div className="mt-6">
                    <div className="">
                      <div className=" px-5">
                        <h3 className="text-[12px] mb-2 text-[#b4b4b4]">
                          ALL FRIENDS
                        </h3>
                      </div>

                      <Divider />
                      <div className="">
                        {friends?.map((friend) => (
                          <div key={friend?._id}>
                            {friend.receiver.userId === user?.userId ? (
                              <div className="flex items-center gap-4 justify-between hover:bg-[#ffffff2e] py-2 px-4 rounded-lg">
                                <div className="flex items-center gap-4">
                                  <div className="h-[32px] w-[32px] flex items-center justify-center bg-[#5865f2] rounded-full">
                                    <SiGuilded />
                                  </div>
                                  <div>
                                    <p>{friend.sender.userName}</p>
                                    <p className="text-[12px] text-[#9a9a9a]">
                                      Offline
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-3">
                                  <button
                                    // onClick={() => cancelFriendRequest(request)}
                                    className="bg-[#1b1b1b] p-2 flex items-center justify-center rounded-full hover:bg-[#1b1b1b76]"
                                  >
                                    <BsFillChatRightFill fontSize={17} />
                                  </button>
                                  <button
                                    // onClick={() => cancelFriendRequest(request)}
                                    className="bg-[#1b1b1b] p-2 flex items-center justify-center rounded-full hover:bg-[#1b1b1b76]"
                                  >
                                    <FiMoreVertical fontSize={17} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-4 justify-between hover:bg-[#ffffff2e] py-2 px-4 rounded-lg">
                                <div className="flex items-center gap-4">
                                  <div className="h-[32px] w-[32px] flex items-center justify-center bg-[#5865f2] rounded-full">
                                    <SiGuilded />
                                  </div>
                                  <div>
                                    <p>{friend.receiver.userName}</p>
                                    <p className="text-[12px] text-[#9a9a9a]">
                                      Offline
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-3">
                                  <button
                                    //  onClick={() => cancelFriendRequest(request)}
                                    className="bg-[#1b1b1b] p-2 flex items-center justify-center rounded-full hover:bg-[#1b1b1b76]"
                                  >
                                    <BsFillChatRightFill fontSize={17} />
                                  </button>
                                  <button
                                    //  onClick={() => cancelFriendRequest(request)}
                                    className="bg-[#1b1b1b] p-2 flex items-center justify-center rounded-full hover:bg-[#1b1b1b76]"
                                  >
                                    <FiMoreVertical fontSize={17} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div></div>
              </div>
            )}
            {tab === "pending" && (
              <div className="flex flex-col w-[70%]">
                <div className="w-full p-6">
                  <div className="relative">
                    <input
                      className="w-[100%] focus:shadow placeholder:font-sans focus:shadow-blue-400 outline-none my-2 bg-[#1e1f22] px-2 p-[0.28rem] rounded-md"
                      placeholder="Search"
                      type="text"
                      name=""
                      id=""
                    />
                    <button
                      className={`text-[13px] px-4 outline-none ${
                        !frndreq && "opacity-40"
                      } absolute top-[13%] right-[0.5%] p-[0.47rem] rounded-md`}
                    >
                      <AiOutlineSearch fontSize={20} />
                    </button>
                  </div>

                  <div className="mt-6">
                    <div className="">
                      <div className=" px-5">
                        <h3 className="text-[12px] mb-2 text-[#b4b4b4]">
                          PENDING
                        </h3>
                      </div>
                      <Divider />
                      <div className="mt-3">
                        {friendRequests.map((request) => (
                          <div key={request?._id}>
                            {request?.sender && (
                              <div className="flex items-center gap-4 justify-between hover:bg-[#ffffff2e] py-2 px-4 rounded-lg">
                                <div className="flex items-center gap-4">
                                  <div className="h-[32px] w-[32px] flex items-center justify-center bg-[#9c9c9c] rounded-full">
                                    <SiGuilded />
                                  </div>
                                  <div>
                                    <p>{request.sender.userId}</p>
                                    <p className="text-[12px] text-[#9a9a9a]">
                                      Incoming Friend Request
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-4">
                                  <button
                                    onClick={() => cancelFriendRequest(request)}
                                    className="bg-[#1b1b1b] p-1 rounded-full hover:bg-[#1b1b1b76]"
                                  >
                                    <AiOutlineClose fontSize={20} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      acceptFriendRequest(request?._id)
                                    }
                                    className="bg-[#1b1b1b] p-1 rounded-full hover:bg-[#1b1b1b76]"
                                  >
                                    <AiOutlineCheck fontSize={20} />
                                  </button>
                                </div>
                              </div>
                            )}
                            {request?.receiver && (
                              <div className="flex items-center gap-4 justify-between hover:bg-[#ffffff2e] py-2 px-4 rounded-lg">
                                <div className="flex items-center gap-4">
                                  <div className="h-[32px] w-[32px] flex items-center justify-center bg-[#9c9c9c] rounded-full">
                                    <SiGuilded />
                                  </div>
                                  <div>
                                    <p>{request.receiver.userId}</p>
                                    <p className="text-[12px] text-[#9a9a9a]">
                                      Outgoing Friend Request
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => cancelFriendRequest(request)}
                                  className="bg-[#1b1b1b] p-1 rounded-full hover:bg-[#1b1b1b76]"
                                >
                                  <AiOutlineClose fontSize={20} />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div></div>
              </div>
            )}
            <div className="w-[30%] h-[100vh] flex flex-col  p-3 border-l border-l-[rgb(255,255,255,0.12)]">
              <h1 className="text-lg font-sans font-bold text-[#f3f3f3]">
                Active Now
              </h1>
              <div className="w-full text-center mt-6">
                <h3 className="text-base">It's quiet for now...</h3>
                <p className="text-sm text-[#979797]">
                  When a friend starts an activity-like playing a game or
                  hanging out on voice-we'll show it here!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainChat;
