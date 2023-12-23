import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { notification } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import s from "./Register.module.scss";
import { BASE_API } from "../config";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { token } = useSelector((state) => state.token);
  const [errors, setErrors] = useState({ errors: [] });
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = () => {
    // console.log(values);
    if (!errors.errors) {
      notification.success({
        message: "Registration Successful",
        description: "You have successfully registered!",
        duration: 2,
      });
    }
  };

  const handleValues = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const register = async () => {
    handleSubmit();
    const request = await fetch(`${BASE_API}` + "/register/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const response = await request.json();
    if (response.token) {
      navigate("/email/verify-email");
    }
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

  // errorMessage(errors.errors, "name");

  return (
    <>
      <div>
        <h2 className={s.header}>Register</h2>

        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
          className={s.box}
          // onSubmit={handleSubmit}
        >
          <TextField
            id="standard-basic"
            label="Name"
            variant="standard"
            name="name"
            onChange={handleValues}
            error={errors.errors.some((error) => error.path === "name")}
            required
            helperText={
              errors.errors.some((error) => error.path === "name")
                ? errorMessage(errors.errors, "name")
                : "Please enter your name"
            }
          />
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
                : "Please сhoose and enter your security password"
            }
          />
          <Button variant="outlined" onClick={register}>
            Register
          </Button>
          <Link className={s.link} to="/auth">
            Already have an account?
          </Link>
        </Box>
      </div>
    </>
  );
};

export default Register;
