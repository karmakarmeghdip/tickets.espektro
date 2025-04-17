import * as z from "zod";

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Common schema fields for all user types
const commonUserFields = {
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  individualType: z.enum(["Student", "Alumni", "Visitor"], {
    required_error: "Please select an individual type",
  }),
};

// Student specific fields
const studentFields = {
  department: z.enum(["CSE", "IT", "ECE", "EE", "ME", "MCA"], {
    required_error: "Please select a department",
  }),
  course: z.enum(["B. Tech", "M. Tech", "MCA"], {
    required_error: "Please select a course",
  }),
  graduationYear: z.enum(["2026", "2027", "2028", "2029"], {
    required_error: "Please select a graduation year",
  }),
  rollNumber: z
    .string()
    .regex(/^[0-9]{11}$/, "Roll number must be 11 digits"),
  idCardPhoto: z.any().optional(),
};

// Alumni specific fields
const alumniFields = {
  department: z.enum(["CSE", "IT", "ECE", "EE", "ME", "MCA"], {
    required_error: "Please select a department",
  }),
  course: z.enum(["B. Tech", "M. Tech", "MCA"], {
    required_error: "Please select a course",
  }),
  graduationYear: z
    .string()
    .regex(/^(199\d|20[0-2]\d)$/, "Please enter a valid graduation year between 1990-2025"),
};

// Visitor specific fields
const visitorFields = {
  address: z.string().min(5, "Address must be at least 5 characters"),
  district: z.string().min(2, "District must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  pinCode: z.string().regex(/^[0-9]{6}$/, "PIN code must be 6 digits"),
};

// Base signup schema
const signupBaseObjectSchema = z.object({
  ...commonUserFields,
});

// Base signup schema with password confirmation validation
export const signupBaseSchema = signupBaseObjectSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

// Dynamic schema based on individual type
export const getSignupSchema = (individualType: string | null) => {
  // Define the refinement function separately for clarity
  const passwordConfirmationRefinement = (
    data: z.infer<typeof signupBaseObjectSchema> & { confirmPassword?: string }
  ) => data.password === data.confirmPassword;
  const refinementOptions = {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  };

  if (!individualType) {
    // Return the base schema with refinement if no type is provided
    return signupBaseObjectSchema.refine(
      passwordConfirmationRefinement,
      refinementOptions
    );
  }

  switch (individualType) {
    case "Student":
      return signupBaseObjectSchema
        .extend({ ...studentFields })
        .refine(passwordConfirmationRefinement, refinementOptions);
    case "Alumni":
      return signupBaseObjectSchema
        .extend({ ...alumniFields })
        .refine(passwordConfirmationRefinement, refinementOptions);
    case "Visitor":
      return signupBaseObjectSchema
        .extend({ ...visitorFields })
        .refine(passwordConfirmationRefinement, refinementOptions);
    default:
      // Return the base schema with refinement for unknown types
      return signupBaseObjectSchema.refine(
        passwordConfirmationRefinement,
        refinementOptions
      );
  }
};

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupBaseSchema>;