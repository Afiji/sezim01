// версия с aws
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import s from "./Profile.module.scss";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CLEAR_TOKEN } from "../../redux/slice/tokenSlice";
import axios from "axios";
import AWS from "aws-sdk";
import { BASE_API } from "../../config";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();

const Profule = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", avatar: "" });
  const { token } = useSelector((state) => state.token);
  const { todos } = useSelector((state) => state.todos);
  const fileInputRef = React.useRef();

  const [isEditing, setIsEditing] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPassword, setEditedPassword] = useState("");

  const handleLogout = () => {
    dispatch(CLEAR_TOKEN());
    navigate("/auth");
  };

  const handleUploadToS3 = (file) => {
    const uploadParams = {
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
      Key: `profile-images/${Date.now()}-${file.name}`,
      Body: file,
      ACL: "public-read",
    };

    return s3.upload(uploadParams).promise();
  };

  const handleDeleteFromS3 = (fileKey) => {
    const deleteParams = {
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
      Key: fileKey,
    };

    return s3.deleteObject(deleteParams).promise();
  };

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
        `${BASE_API}/user/edit-profile`,
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

  console.log(user);
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          `${BASE_API}/user/upload-avatar`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Обновление состояния пользователя новым URL аватара.
        setUser((prev) => ({ ...prev, avatar: response.data.avatarPath }));
      } catch (error) {
        console.error("Ошибка при загрузке файла:", error);
      }
    }
  };

  const handleDeleteAvatar = async () => {
    const fileKey = user.avatar.split("/").pop(); // Получаем ключ файла из URL
    try {
      await handleDeleteFromS3(fileKey);
      await deleteUserAvatar();
    } catch (error) {
      console.error("Ошибка при удалении файла:", error);
    }
  };

  const updateUserAvatar = async (avatarUrl) => {
    try {
      const response = await axios.patch(
        `${BASE_API}/user/edit-profile`,
        { avatar: avatarUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser((prev) => ({
        ...prev,
        avatar: response.data.updatedUser.avatar,
      }));
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
    }
  };

  const deleteUserAvatar = async () => {
    try {
      await axios.delete(`${BASE_API}/user/delete-avatar`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser((prev) => ({ ...prev, avatar: "" }));
    } catch (error) {
      console.error("Ошибка при удалении аватара пользователя:", error);
    }
  };

  const handleClickAvatar = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BASE_API}/user/get-user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

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
        <h1>Ваш профиль</h1>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleAvatarChange}
        />
        <IconButton onClick={() => fileInputRef.current.click()}>
          <Avatar
            className={s.avatar}
            alt="Profile Photo"
            src={user.avatar}
            sx={{ width: 200, height: 200 }}
          />
        </IconButton>
        <button onClick={handleDeleteAvatar}>Удалить аватар</button>
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
