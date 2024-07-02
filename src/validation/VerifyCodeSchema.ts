import * as z from "zod";

const VerifyCodeSchema = z.object({
    code: z.string().length(6, "Code must be 6 characters long"),
});

export default VerifyCodeSchema;
