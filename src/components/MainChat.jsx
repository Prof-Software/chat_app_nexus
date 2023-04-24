import React, { useEffect, useState } from "react";
import { Divider, IconButton } from "@mui/material";
import { FaUserFriends } from "react-icons/fa";
import { IoMdHelpCircle } from "react-icons/io";
import { RiChatNewFill, RiChatNewLine } from "react-icons/ri";
import { MdAllInbox, MdInbox } from "react-icons/md";
import { client } from "../client";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import {
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineSearch,
} from "react-icons/ai";
import { SiGuilded } from "react-icons/si";
import moment from "moment";
const MainChat = ({ user, tab, setTab }) => {
  const [active, setActive] = useState("");
  const [frndreq, setFrndreq] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([])
  const handleOnline = () => {};
  const handleAll = () => {};
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

  const cancelFriendRequest = (request) => {
    client
      .delete(request._id)
      .then(() => {
        // Remove the request from the pendingRequests array
        setFriendRequests(friendRequests.filter((r) => r._id !== request._id));
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
        .set({ status: 'accepted' })
        .commit();
        setSnackbarMessage("Friend request Accepted");
        setSnackbarOpen(true);
      // Update the friend requests state to remove the accepted request
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
  
      // Add the accepted friend to the friends state
      // setFriends((prevFriends) => [
      //   ...prevFriends,
      //   response.result.sender._ref === user?._id
      //     ? response.result.receiver
      //     : response.result.sender,
      // ]);
    } catch (error) {
      console.error('Failed to accept friend request:', error.message);
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
              _ref: user._id, // Reference to the current user document
            },
            receiver: {
              _type: "reference",
              _ref: receiver._id, // Reference to the receiver user document
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
            onClick={() => {
              setActive("All");
            }}
            className={`flex ${
              active === "All" && "bg-[#ffffff20] text-white rounded-md"
            } hover:bg-[#ffffff0d] px-2 text-[#828282] items-center gap-2 mx-3`}
          >
            All
          </button>
          <button
            onClick={handlePending}
            className={`flex ${
              active === "pending" && "bg-[#ffffff20] text-white rounded-md"
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
              active === "add"
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
                  onClick={sendFriendRequest}
                  className={`text-[13px] px-4 outline-none ${
                    !frndreq && "opacity-40"
                  } absolute top-[13%] right-[0.5%] p-[0.47rem] rounded-md`}
                >
                  <AiOutlineSearch fontSize={20} />
                </button>
              </div>

              <div className="mt-6">
                <div className=" px-5">
                  <h3 className="text-[12px] mb-2 text-[#b4b4b4]">PENDING</h3>
                  <Divider />
                  <div className="mt-3">
                    {friendRequests.map((request) => (
                      <div key={request._id}>
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
                                onClick={() => acceptFriendRequest(request._id)}
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
        <div className="w-[30%] flex flex-col  p-3 border-l border-l-[rgb(255,255,255,0.12)]">
          <h1 className="text-lg font-sans font-bold text-[#f3f3f3]">
            Active Now
          </h1>
          <div className="w-full text-center mt-6">
            <h3 className="text-base">It's quiet for now...</h3>
            <p className="text-sm text-[#979797]">
              When a friend starts an activity-like playing a game or hanging
              out on voice-we'll show it here!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainChat;
