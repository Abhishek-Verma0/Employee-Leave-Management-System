const { z } = require("zod");

const leaveSchema = z.object({
    
    fromDate: z.string().min(1, "From date is required"),
    toDate: z.string().min(1, "To date is required"),
    reason: z
        .string()
        .min(5, "Reason must be at least 5 characters")
        .max(500, "Reason cannot exceed 500 characters"),
});

module.exports = { leaveSchema };
