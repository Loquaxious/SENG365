"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
exports.default = () => {
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.json());
    require('../app/routes/users.server.routes.js')(app);
    require('../app/routes/converstations.server.routes.js')(app);
    return app;
};
//# sourceMappingURL=express.js.map