import express, { Router } from "express";
import { handleLogin } from "../controllers/loginController";

const router: Router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Handles user login.
 *     description: Use this route to log in a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: marvxyz1@gmail.com
 *               pwd:
 *                 type: string
 *                 example: 1111
 *     responses:
 *       200:
 *         description: Successful login.
 *       400:
 *         description: Invalid request body or credentials.
 */

router.post("/", handleLogin);

export default router;
