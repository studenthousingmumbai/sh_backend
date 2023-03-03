"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const available_beds_1 = __importDefault(require("./available-beds"));
const students_in_appartment_1 = __importDefault(require("./students-in-appartment"));
const students_on_floor_1 = __importDefault(require("./students-on-floor"));
const router = (0, express_1.Router)();
router.post('/available-beds', ...available_beds_1.default);
router.post('/students-in-appartment', ...students_in_appartment_1.default);
router.post('/students-on-floor', ...students_on_floor_1.default);
exports.default = router;
