import { z } from "zod";

export const deckSchema = z.object({
  name: z.string().min(3, "Name must be atleast 3 characters").max(50),
});
export type DeckSchema = z.infer<typeof deckSchema>;

export const cardSchema = z.object({
  frontCard: z.string().nonempty("front card content is required").max(160, {
    message: "front card must not exceed 160 characters.",
  }),
  backCard: z.string().nonempty("back card content is required").max(300, {
    message: "back card must not exceed 300 characters.",
  }),
});
export type CardSchema = z.infer<typeof cardSchema>;

export const loginSchema = z.object({
  username: z
    .string()
    .min(6, {
      message: "username must be at least 6 characters.",
    })
    .max(20, {
      message: "username must not exceed 20 characters.",
    }),
  password: z
    .string()
    .min(5, {
      message: "Password must be at least 5 characters.",
    })
    .max(100, {
      message: "Password must not exceed 100 characters.",
    }),
});
export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .nonempty("name is required")
    .min(5, {
      message: "name must be at least 5 characters.",
    })
    .max(20, {
      message: "name must not exceed 20 characters.",
    }),
  username: z
    .string()
    .nonempty("username is required")
    .min(6, {
      message: "username must be at least 6 characters.",
    })
    .max(20, {
      message: "username must not exceed 20 characters.",
    }),
  password: z
    .string()
    .nonempty("password is required")
    .min(5, {
      message: "password must be at least 5 characters.",
    })
    .max(100, {
      message: "password must not exceed 100 characters.",
    }),
});
export type RegisterSchema = z.infer<typeof registerSchema>;

export const feedbackSchema = z.object({
  type: z.coerce
    .number({ message: "Please select a feedback type" })
    .int()
    .min(0)
    .max(3),
  content: z
    .string()
    .nonempty("message is required")
    .min(10, {
      message: "message must be at least 10 characters.",
    })
    .max(200, {
      message: "message must not be longer than 200 characters.",
    }),
});

export type FeedbackSchema = z.infer<typeof feedbackSchema>;
