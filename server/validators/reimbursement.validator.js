const { z } = require("zod");

const reimbursementSchema = z.object({
    amount: z.coerce
        .number()
        .positive("Amount must be greater than 0"),
    expenseDate: z
        .string()
        .min(1, "Expense date is required"),
    description: z
        .string()
        .min(5, "Description must be at least 5 characters")
        .max(500, "Description cannot exceed 500 characters"),
});

const updateReimbursementStatusSchema = z.object({
    status: z.enum(
        ["pending", "approved", "rejected"],
        {
            error: "Status must be pending, approved, or rejected"
        }
    )
});
module.exports = { reimbursementSchema, updateReimbursementStatusSchema };
