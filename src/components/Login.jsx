import React, { useState } from "react";
import bg from "../assets/login-bg.jpg";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Checkbox, IconButton, Snackbar } from "@mui/material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { client } from "../client";
import jwt_decode from "jwt-decode";
import { userQuery } from "../utils/data";
import { useEffect } from "react";
import validator from "validator";
import CloseIcon from "@mui/icons-material/Close";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
const bcrypt = require("bcryptjs");

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.p`
  font-size: 12px;
  margin-left: 8px;
`;
const Login = () => {
  const [age, setAge] = useState("");
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [show, setShow] = useState(false);
  const [showIn, setShowIn] = useState(false);
  const [newId, setNewId] = useState("");
  const [user, setUser] = useState();
  const [log, setLog] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [news, setNews] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [suffix, setSuffix] = useState("");
  const [type, setType] = useState("register");
  const [pass, setPass] = useState("password");
  const handleVisibility = () => {
    if (pass === "password") {
      setPass("text");
    } else {
      setPass("password");
    }
  };
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1900; year--) {
    years.push(year);
  }

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  async function generateSuffix(username) {
    while (true) {
      const suffix = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
      const userId = username + "#" + suffix;
      const result = await client.fetch(
        `*[_type == "user" && userId == $userId]`,
        { userId }
      );
      if (result.length === 0) {
        return suffix;
      }
    }
  }
  const handleCheck = (event) => {
    setIsChecked(event.target.checked);
  };

  function formatDateOfBirth(day, month, year) {
    const date = new Date(year, month - 1, day);
    return date.toISOString().substring(0, 10);
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const existingUser = await client.fetch(
      `*[_type == "user" && email == "${email}"]`
    );
    if (existingUser.length === 0) {
      setErrorMessage("No user found with this email address.");
      setOpen(true);
      return;
    }

    const passwordMatches = await bcrypt.compare(
      password,
      existingUser[0].password
    );
    if (!passwordMatches) {
      setErrorMessage("Incorrect password.");
      setOpen(true);
      return;
    }

    // Successful login, store user data in localStorage
    localStorage.setItem("user", JSON.stringify(existingUser[0]));
    navigate("/");
  };
  const handleFormSubmit = async (event) => {
    if (!validator.isEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      setOpen(true);
      return;
    }
    if (username.length < 4) {
      setErrorMessage("Username must be at least 4 characters long.");
      setOpen(true);
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      setOpen(true);
      return;
    }
    const existingUserWithEmail = await client.fetch(
      `*[_type == "user" && email == "${email}"]`
    );
    if (existingUserWithEmail.length > 0) {
      setErrorMessage("An account with this email address already exists.");
      return;
    }
    const suffix = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    const formattedUsername = username.replace(/\s+/g, "").toLowerCase();
    const userId = `${formattedUsername}#${suffix}`;
    const dob = formatDateOfBirth(day, month, year);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const doc = {
      _type: "user",
      _id: uuidv4(),
      userId: userId,
      userName: username,
      email: email,
      password: hashedPassword,
      dateOfBirth: dob,
      news: true,
    };

    client.createIfNotExists(doc).then(() => {
      // store user data in local storage
      const userData = {
        userId: userId,
        userName: username,
        email: email,
        dateOfBirth: dob,
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      navigate("/");
    });
  };

  useEffect(() => {
    if (user?.userId) {
      setShow(true);
    }
  }, [user]);
  useEffect(() => {
    if (user && user?.userId === undefined) {
      setShowIn(true);
    }
  }, [user]);
  const getMonthMenuItems = () => {
    const menuItems = [];

    for (let i = 0; i < 12; i++) {
      const monthName = monthNames[i];
      const value = (currentYear - 1900) * 10 + (i + 1);
      menuItems.push(
        <MenuItem key={value} value={value}>
          {monthName}
        </MenuItem>
      );
    }

    return menuItems;
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  return (
    <div
      className="h-screen flex text-white items-center justify-center w-screen bg-[#2F3136] object-cover"
      style={{ background: `url(${bg})`, backgroundSize: "cover" }}
    >
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={`${errorMessage}`}
        action={action}
      />
      {type === "register" && (
        <motion.div
          className="p-2 px-8 flex flex-col gap-5 bg-[#2F3136] rounded-md"
          initial={{ y: "-100vh" }} // initial position (off screen)
          animate={{ y: 0 }} // animate to this position (on screen)
          transition={{ type: "spring", stiffness: 120 }} // transition type and properties
        >
          <h1 className="text-2xl text-[#dddddd] w-full text-center p-4">
            Create an account
          </h1>
          <div className="flex flex-col">
            <p className="text-sm text-[gray] mb-2 font-bold">EMAIL</p>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="bg-[#1e1f22] p-2 rounded-sm md:w-[396px] w-full outline-none text-white"
              type="text"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-[gray] mb-2 font-bold">USERNAME</p>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="bg-[#1e1f22]  p-2 rounded-sm md:w-[396px] w-[100%] outline-none text-white"
              type="text"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-[gray] mb-2 font-bold">PASSWORD</p>
            <div className="relative">
              <input
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                className="bg-[#1e1f22] p-2 rounded-sm md:w-[396px] w-full outline-none text-white"
                type={pass}
              />
              <div className="absolute top-0 right-0 mr-4">
                <IconButton onClick={handleVisibility}>
                  {pass === "password" ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
                  )}
                </IconButton>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-[gray] mb-2 font-bold">DATE OF BIRTH</p>
            <div className="flex md:w-[396px] gap-3 w-full">
              <FormControl className="w-1/3 bg-[#1e1f22]">
                <InputLabel id="demo-simple-select-label">Month</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={month}
                  onChange={(event) => setMonth(event.target.value)}
                  label="Month"
                >
                  {getMonthMenuItems()}
                </Select>
              </FormControl>

              <FormControl className="w-1/3 bg-[#1e1f22]">
                <InputLabel id="demo-simple-select-label bg-[#1e1f22]">
                  Day
                </InputLabel>
                <Select
                  value={day}
                  onChange={(event) => setDay(event.target.value)}
                  labelId="demo-simple-select-label"
                  label="Day"
                  id="demo-simple-select"
                >
                  <MenuItem value={10}>1</MenuItem>
                  <MenuItem value={20}>2</MenuItem>
                  <MenuItem value={30}>3</MenuItem>
                  <MenuItem value={40}>4</MenuItem>
                  <MenuItem value={50}>5</MenuItem>
                  <MenuItem value={60}>6</MenuItem>
                  <MenuItem value={70}>7</MenuItem>
                  <MenuItem value={80}>8</MenuItem>
                  <MenuItem value={90}>9</MenuItem>
                  <MenuItem value={100}>10</MenuItem>
                  <MenuItem value={110}>11</MenuItem>
                  <MenuItem value={120}>12</MenuItem>
                  <MenuItem value={130}>13</MenuItem>
                  <MenuItem value={140}>14</MenuItem>
                  <MenuItem value={150}>15</MenuItem>
                  <MenuItem value={160}>16</MenuItem>
                  <MenuItem value={170}>17</MenuItem>
                  <MenuItem value={180}>18</MenuItem>
                  <MenuItem value={190}>19</MenuItem>
                  <MenuItem value={200}>20</MenuItem>
                  <MenuItem value={210}>21</MenuItem>
                  <MenuItem value={220}>22</MenuItem>
                  <MenuItem value={230}>23</MenuItem>
                  <MenuItem value={240}>24</MenuItem>
                  <MenuItem value={250}>25</MenuItem>
                  <MenuItem value={260}>26</MenuItem>
                  <MenuItem value={270}>27</MenuItem>
                  <MenuItem value={280}>28</MenuItem>
                  <MenuItem value={290}>29</MenuItem>
                  <MenuItem value={300}>30</MenuItem>
                  <MenuItem value={310}>31</MenuItem>
                </Select>
              </FormControl>
              <FormControl className="w-1/3 bg-[#1e1f22]">
                <InputLabel id="demo-simple-select-label">Year</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={year}
                  label="Year"
                  onChange={(event) => setYear(event.target.value)}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <Container className="md:w-[396px] w-full mt-2">
              <Checkbox
                checked={isChecked}
                value={news}
                onChange={handleCheck}
                color="primary"
              />
              <Label className="text-[gray] cursor-default text-[12px] text-sm">
                (Optional) It’s okay to send me emails with Discord updates,
                tips, and special offers. You can opt out at any time.
              </Label>
            </Container>
            <button
              onClick={handleFormSubmit}
              className={`w-full transition-[400ms] p-3 rounded-md mt-2
               bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            >
              Continue
            </button>
            <button
              onClick={() => {
                setType("login");
              }}
              className="hover:underline text-blue-400 my-2 text-[14px] cursor-pointer"
            >
              Already have an Account?
            </button>
            <p className="hover:underline text-[gray] my-2 text-[12px] cursor-pointer">
              By registering you agree to NexusChat's{" "}
              <span className="text-blue-400">Terms of Service</span> and{" "}
              <span className="text-blue-400">Privacy Policy</span>
            </p>
          </div>
        </motion.div>
      )}
      {type === "login" && (
        <motion.div
          className="p-2 px-8 flex flex-col gap-5 bg-[#2F3136] rounded-md"
          initial={{ y: "-100vh" }} // initial position (off screen)
          animate={{ y: 0 }} // animate to this position (on screen)
          transition={{ type: "spring", stiffness: 120 }} // transition type and properties
        >
          <h1 className="text-2xl text-[#dddddd] w-full text-center p-4">
            Login an account
          </h1>
          <div className="flex flex-col">
            <p className="text-sm text-[gray] mb-2 font-bold">EMAIL</p>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="bg-[#1e1f22] p-2 rounded-sm md:w-[396px] w-full outline-none text-white"
              type="text"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-[gray] mb-2 font-bold">PASSWORD</p>
            <div className="relative">
              <input
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                className="bg-[#1e1f22] p-2 rounded-sm md:w-[396px] w-full outline-none text-white"
                type={pass}
              />
              <div className="absolute top-0 right-0 mr-1">
                <IconButton onClick={handleVisibility}>
                  {pass === "password" ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
                  )}
                </IconButton>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <button
              onClick={handleLoginSubmit}
              className={`w-full transition-[400ms] p-3 rounded-md mt-2
               bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            >
              Continue
            </button>
            <button
              onClick={() => {
                setType("register");
              }}
              className="hover:underline text-blue-400 my-2 text-[14px] cursor-pointer"
            >
              Do not have an Account?
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Login;
