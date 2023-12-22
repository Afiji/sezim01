import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import s from "./Profile.module.scss";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CLEAR_TOKEN } from "../../redux/slice/tokenSlice";
import axios from "axios";

const Profule = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", avatar: "" });
  const { token } = useSelector((state) => state.token);
  const { todos } = useSelector((state) => state.todos);
  const fileInputRef = React.useRef();

  const [isEditing, setIsEditing] = useState(null); // 'name', 'email', 'password' или null
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPassword, setEditedPassword] = useState("");

  const startEditing = (field) => {
    setIsEditing(field);
    if (field === "name") setEditedName(user.name);
    if (field === "email") setEditedEmail(user.email);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {};
      if (isEditing === "name") payload.name = editedName;
      if (isEditing === "email") payload.email = editedEmail;
      if (isEditing === "password") payload.password = editedPassword;

      const response = await axios.patch(
        "https://sezim01-api.onrender.com/user/edit-profile",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser((prev) => ({ ...prev, ...response.data.updatedUser }));
      setIsEditing(null);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(todos);

  const handleLogout = () => {
    dispatch(CLEAR_TOKEN());
    navigate("/auth");
    // console.log("User logged out");
  };

  console.log(user);
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          "https://sezim01-api.onrender.com/user/upload-avatar",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser((prev) => ({ ...prev, avatar: response.data.avatarPath }));
        // localStorage.setItem("avatar", `http://localhost:5057/${user.avatar}`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleClickAvatar = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "https://sezim01-api.onrender.com/user/get-user",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();
        setUser({
          name: result.name,
          email: result.email,
          avatar: result.avatar,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, [token]);

  const completedTasks = todos.filter((el) => el.status === true);
  const inProgressTasks = todos.filter((el) => el.status === false);

  return (
    <>
      <IconButton onClick={handleLogout} className={s.logoutButton}>
        <ExitToAppIcon />
      </IconButton>

      <div className={s.container}>
        {/* <div className={s.header}> */}

        {/* </div> */}
        <h1>Ваш профиль</h1>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleAvatarChange}
        />
        <IconButton onClick={handleClickAvatar}>
          <Avatar
            className={s.avatar}
            alt="profile photo"
            src={
              user.avatar
                ? `https://sezim01-api.onrender.com/user/${user.avatar}`
                : localStorage.getItem("avatar")
            }
            sx={{ width: 200, height: 200 }}
          />
        </IconButton>
        <div className={s.profile}>
          <div className={s.userInfo}>
            {isEditing === "name" ? (
              <form onSubmit={handleEditSubmit}>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <button type="submit">Сохранить</button>
                <button onClick={() => setIsEditing(null)}>Отмена</button>
              </form>
            ) : (
              <h2 onClick={() => startEditing("name")}>Имя: {user.name}</h2>
            )}

            {isEditing === "email" ? (
              <form onSubmit={handleEditSubmit}>
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                />
                <button type="submit">Сохранить</button>
                <button onClick={() => setIsEditing(null)}>Отмена</button>
              </form>
            ) : (
              <h2 onClick={() => startEditing("email")}>Email: {user.email}</h2>
            )}

            {isEditing === "password" ? (
              <form onSubmit={handleEditSubmit}>
                <input
                  type="password"
                  value={editedPassword}
                  onChange={(e) => setEditedPassword(e.target.value)}
                />
                <button type="submit">Сохранить</button>
                <button onClick={() => setIsEditing(null)}>Отмена</button>
              </form>
            ) : (
              <h2 onClick={() => startEditing("password")}>Пароль: ••••••••</h2>
            )}

            {/* <h2>{user.name}</h2>
            <h2>{user.email}</h2> */}
          </div>

          <div>
            <h2>Статистика</h2>
            <div className={s.statistics}>
              <div>
                <p>Общее количество</p>
                <p>{todos.length}</p>
              </div>
              <div>
                <p>В процессе выполнения</p>
                <p>{inProgressTasks.length}</p>
              </div>
              <div>
                <p>Выполненные</p>
                <p>{completedTasks.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profule;
