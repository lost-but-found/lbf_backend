import express, { Router } from "express";

import { handleNewUser } from "../controllers/registerController";
const upload = require("../middleware/multer");

const router: Router = express.Router();

router.post("/", upload.single("photo"), handleNewUser);

export default router;
