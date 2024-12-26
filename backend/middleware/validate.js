// middleware/validate.js
const Joi = require('joi');

// Validation schemas
const schemas = {
    // Study Plan validation
    studyPlan: Joi.object({
        title: Joi.string().required().min(3).max(100)
            .messages({
                'string.empty': 'Title is required',
                'string.min': 'Title must be at least 3 characters',
                'string.max': 'Title cannot exceed 100 characters'
            }),
        description: Joi.string().optional().max(500)
            .messages({
                'string.max': 'Description cannot exceed 500 characters'
            }),
        tasks: Joi.array().items(
            Joi.object({
                taskName: Joi.string().required().min(3).max(100)
                    .messages({
                        'string.empty': 'Task name is required',
                        'string.min': 'Task name must be at least 3 characters',
                        'string.max': 'Task name cannot exceed 100 characters'
                    }),
                priority: Joi.string().valid('Low', 'Medium', 'High').default('Medium')
                    .messages({
                        'any.only': 'Priority must be Low, Medium, or High'
                    }),
                dueDate: Joi.date().min('now').optional()
                    .messages({
                        'date.min': 'Due date cannot be in the past'
                    }),
                isCompleted: Joi.boolean().default(false)
            })
        ).min(1).messages({
            'array.min': 'At least one task is required'
        })
    }),

    // User registration validation
    userRegistration: Joi.object({
        email: Joi.string().email().required()
            .messages({
                'string.email': 'Please provide a valid email address',
                'string.empty': 'Email is required'
            }),
        password: Joi.string().min(6).required()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
            .messages({
                'string.min': 'Password must be at least 6 characters',
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                'string.empty': 'Password is required'
            })
    })
};

// Validation middleware
const validateRequest = (schemaName) => {
    return (req, res, next) => {
        const schema = schemas[schemaName];
        if (!schema) {
            return res.status(500).json({ message: 'Internal server error - Invalid schema' });
        }

        const { error, value } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.context.key,
                message: detail.message
            }));
            return res.status(400).json({ 
                message: 'Validation error',
                errors 
            });
        }

        req.validatedData = value;
        next();
    };
};

module.exports = validateRequest;