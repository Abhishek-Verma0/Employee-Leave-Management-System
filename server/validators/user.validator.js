const { z } = require("zod");

const updateUserRoleSchema = z.object({
    role: z.enum(["employee", "manager", "admin"], {
        errorMap: () => ({
            message: "Role must be one of: employee, manager, admin",
        }),
    }),
});

module.exports = { updateUserRoleSchema };