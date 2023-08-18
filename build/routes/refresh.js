"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/refreshTokenController');
router.get('/', refreshTokenController.handleRefreshToken);
module.exports = router;
//# sourceMappingURL=refresh.js.map