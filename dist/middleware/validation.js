"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const formatZodErrors = (error) => error.issues.map((issue) => ({
    field: issue.path.join('.') || 'body',
    message: issue.message,
}));
const validateBody = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: 'Payload inválido',
                details: formatZodErrors(result.error),
            });
        }
        req.body = result.data;
        next();
    };
};
exports.validateBody = validateBody;
