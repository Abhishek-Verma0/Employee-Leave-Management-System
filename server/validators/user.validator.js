const { z } = require("zod");

const updateUserRoleSchema = z.object({
    role: z.enum(["employee", "manager", "admin"], {
        error: "Role must be one of: employee, manager, admin",
    }),
});

module.exports = { updateUserRoleSchema };