const { z } = require("zod");

const leaveSchema = z.object({
    leaveType: z.string().min(1, "Leave type is required"),

    fromDate: z.string().min(1, "From date is required"),

    toDate: z.string().min(1, "To date is required"),

    reason: z
        .string()
        .min(5, "Reason must be at least 5 characters")
        .max(500, "Reason cannot exceed 500 characters"),
})
.refine((data) => {
    return new Date(data.toDate) >= new Date(data.fromDate);
}, {
    message: "To date cannot be before from date",
    path: ["toDate"],
});

module.exports = { leaveSchema };