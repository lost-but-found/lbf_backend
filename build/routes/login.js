"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loginController_1 = require("../controllers/loginController");
const router = express_1.default.Router();
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
router.post("/", loginController_1.handleLogin);
exports.default = router;
//# sourceMappingURL=login.js.map