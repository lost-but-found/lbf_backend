import { any, object, string, TypeOf } from "zod";

export const registerUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    deviceToken: string({
      required_error: "Device Token is required",
    }),
    password: string({
      required_error: "Name is required",
    }).min(6, "Password too short - should be 6 chars minimum"),
    // passwordConfirmation: string({
    //   required_error: "passwordConfirmation is required",
    // }),
    phone: string({
      required_error: "Phone is required",
    }).min(10, "Phone too short - should be 10 chars minimum"),
    // photo: string({
    //   required_error: "Photo is required",
    // }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
  }),
  //   .refine((data) => data.password === data.passwordConfirmation, {
  //     message: "Passwords do not match",
  //     path: ["passwordConfirmation"],
  //   }),
  // file: object({
  //   fieldname: string({
  //     required_error: "fieldname is required",
  //   }),
  //   originalname: string({
  //     required_error: "originalname is required",
  //   }),
  //   encoding: string({
  //     required_error: "encoding is required",
  //   }),
  //   mimetype: string({
  //     required_error: "mimetype is required",
  //   }),
  //   buffer: any({
  //     required_error: "buffer is required",
  //   }),
  // })
  //   .refine((data) => data.mimetype.includes("image"), {
  //     message: "File must be an image",
  //     path: ["mimetype"],
  //   })
  //   .refine((data) => data.fieldname === "photo", {
  //     message: "File must be a photo",
  //     path: ["fieldname"],
  //   }),
});

export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    password: string({
      required_error: "Password is required",
    }),
  }),
});

export const requestEmailOTPSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
  }),
});

export const verifyEmailOTPSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    token: string({
      required_error: "Token is required",
    }),
  }),
});

export const requestPhoneOTPSchema = object({
  body: object({
    phone: string({
      required_error: "Phone is required",
    }),
  }),
});

export const verifyPhoneOTPSchema = object({
  body: object({
    phone: string({
      required_error: "Phone is required",
    }),
    token: string({
      required_error: "Token is required",
    }),
  }),
});

export type RegisterUserInput = Omit<
  TypeOf<typeof registerUserSchema>,
  "body.passwordConfirmation"
>;

export type VerifyEmailOTPInput = TypeOf<typeof verifyEmailOTPSchema>;
