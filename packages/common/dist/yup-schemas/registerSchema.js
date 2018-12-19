"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yup = require("yup");
exports.registerSchema = yup.object().shape({
    username: yup.string().min(3).max(30).matches(/^[a-zA-Z0-9]*$/, 'Only letters and numbers').required(),
    email: yup.string().email().required().min(5).max(500),
    password: yup.string().min(5).max(1000)
});
//# sourceMappingURL=registerSchema.js.map