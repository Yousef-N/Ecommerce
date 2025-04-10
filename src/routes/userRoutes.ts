import express from "express";
import { login, register } from "../services/userService"; 
const router = express.Router();

router.post("/register", async (request, response) => {
  try {  const { firstName, lastName, email, password } = request.body;
  const { data, statusCode } = await register({
    firstName,
    lastName,
    email,
    password,
  });
    response.status(statusCode).send(data);
  }
  catch (err) {
    response.status(500).send("something went wrong ");
}
});

router.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body
    const { data, statusCode } =
      await login({
        email,
        password
      });
    response.status(statusCode).send(data);
  }catch (err) {
    response.status(500).send("something went wrong ");
}

});

export default router;
