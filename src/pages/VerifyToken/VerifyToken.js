import React, { useEffect, useState } from "react";
import s from "./VerifyToken.module.scss";
import { useParams, useNavigate } from "react-router-dom";
import { HANDLE_TOKEN } from "../../redux/slice/tokenSlice";
import { useDispatch } from "react-redux";
import { notification } from "antd";

const VerifyToken = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [verified, setVerified] = useState(false);
  // const params = useParams();

  console.log(token);

  async function verifyToken() {
    dispatch(HANDLE_TOKEN(token));
  }

  useEffect(() => {
    if (token) {
      verifyToken().then(() => {
        {
          setVerified(true);
          notification.success({
            message: "Registration Successful",
            description: "You have successfully registered!",
            duration: 2,
          });
          setTimeout(() => {
            navigate("/auth");
          }, 3000);
        }
      });
    }
  }, [token, navigate]);

  return (
    <div className={s.container}>
      {verified ? (
        <h1 className={s.header}>Почта успешно подтверждена</h1>
      ) : (
        <>
          <div className={s.text}>
            <h1>Проверьте вашу почту</h1>
            <p>
              Мы отправили вам письмо со ссылкой для подтверждения вашей
              электронной почты. Пожалуйста, проверьте вашу почту и перейдите по
              ссылке для активации аккаунта.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default VerifyToken;
