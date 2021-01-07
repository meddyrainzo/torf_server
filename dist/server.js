"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const configs_1 = require("./configs");
const { port } = configs_1.serverConfig;
const app = express_1.default();
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
//# sourceMappingURL=server.js.map