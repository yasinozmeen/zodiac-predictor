"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = exports.validateEmail = exports.formatDate = void 0;
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};
exports.formatDate = formatDate;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};
exports.generateId = generateId;
//# sourceMappingURL=index.js.map