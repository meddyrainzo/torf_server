"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverConfig = void 0;
const dotenv_1 = require("dotenv");
dotenv_1.config();
var serverConfig_1 = require("./serverConfig");
Object.defineProperty(exports, "serverConfig", { enumerable: true, get: function () { return __importDefault(serverConfig_1).default; } });
//# sourceMappingURL=index.js.map