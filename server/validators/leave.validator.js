const { z } = require("zod");

const leaveSchema = z.object({
    leaveType: z.string().min(1, "Leave type is required"),
    fromDate: z.string().min(1, "From date is required"),
    toDate: z.string().min(1, "To date is required"),
    reason: z
        .string()
        .min(5, "Reason must be at least 5 characters")
        .max(500, "Reason cannot exceed 500 characters"),
});

const updateLeaveStatusSchema = z.object({
    status: z.enum(
        ["pending", "approved", "rejected"],
        {
            error: "Status must be pending, approved, or rejected"
        }
    )
});

module.exports = { leaveSchema, updateLeaveStatusSchema };
