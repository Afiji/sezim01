import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HANDLE_TOKEN } from "../../redux/slice/tokenSlice";
import { Link } from "react-router-dom";
import { BASE_API } from "../../config";

import s from "./Auth.module.scss";

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.token);
  const [errors, setErrors] = useState({ errors: [] });
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  console.log(token);
  const handleValues = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const auth = async () => {
    const request = await fetch(`${BASE_API}` + "/auth/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const response = await request.json();
    if (response.token) {
      dispatch(HANDLE_TOKEN(response.token));
      localStorage.setItem("token", response.token);
      navigate("/");
    }
    // console.log(response);
    setErrors(response.errors ? { errors: response.errors } : { errors: [] });
  };
  console.log(errors.errors);

  const errorMessage = (arr, path) => {
    const errMes = arr.filter((el) => el.path === path);
    if (errMes.length > 1) {
      const combineMesses = errMes.reduce((acc, rec) => {
        const { msg } = rec;
        return [...acc, msg];
      }, []);
      return combineMesses.join(". ");
    } else {
      return errMes[0].msg;
    }
    // console.log(errMes);
    // return errMes[0].msg;
  };
  return (
    <>
      <div>
        <h2 className={s.header}>Auth</h2>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
          className={s.box}
        >
          <TextField
            id="standard-basic"
            label="Email"
            variant="standard"
            name="email"
            onChange={handleValues}
            error={errors.errors.some((error) => error.path === "email")}
            required
            helperText={
              errors.errors.some((error) => error.path === "email")
                ? errorMessage(errors.errors, "email")
                : "Please enter your email"
            }
          />
          <TextField
            id="standard-basic"
            label="Password"
            variant="standard"
            name="password"
            onChange={handleValues}
            error={errors.errors.some((error) => error.path === "password")}
            required
            helperText={
              errors.errors.some((error) => error.path === "password")
                ? errorMessage(errors.errors, "password")
                : "Please enter your security password"
            }
          />
          <Button variant="outlined" onClick={auth}>
            Enter
          </Button>
          <Link className={s.link} to="/reg">
            Don't have an account yet?
          </Link>
        </Box>
      </div>
    </>
  );
};

export default Auth;
