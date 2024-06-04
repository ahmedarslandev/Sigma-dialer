import express from "express";
import dotenv from "dotenv";
import authRoutes from "../controllers/auth.routes.js";
import portalRoutes from "../controllers/portal.routes.js";
import loopStatesRoutes from "../controllers/loop-states.routes.js";
import fetchCallerIdsRoutes from "../controllers/fetch-callerId.routes.js";
import { userModel } from "../models/models.js";
import jwt from "jsonwebtoken";

dotenv.config();

const router = express.Router();

/* GET home page. */
router.get("/sign-up", (req, res, next) => {
  res.render("signUp", { title: "Express" });
});
router.get("/", (req, res, next) => {
  res.render("addCallerId", { title: "Express" });
});
router.get("/new-password", (req, res, next) => {
  res.render("newPassword", { title: "Express" });
});
router.get("/sign-in", (req, res, next) => {
  res.render("signIn", { title: "Express" });
});

router.get("/profile/details", async (req, res, next) => {
  const encryptedToken = req.cookies.token;
  if (!encryptedToken) {
    return res.send("User not logged in");
  }
  const { id } = jwt.verify(encryptedToken, process.env.JWT_TOKEN_SECRET);
  const user = await userModel.findById(id).populate("callerIds");
  if (!user) {
    return res.send("User not found");
  }
  res.render("profile", { user: user });
});

router.use("/auth", authRoutes);
router.use("/portals", portalRoutes);
router.use("/", loopStatesRoutes);
router.use("/", fetchCallerIdsRoutes);

export default router;
