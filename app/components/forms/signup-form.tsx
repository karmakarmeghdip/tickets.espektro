"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Helper component for layout
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

// Define the form schema with Zod
const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string(),
    phoneNumber: z
      .string()
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    individualType: z.enum(["Student", "Alumni", "Visitor"]),
    department: z.string().optional(),
    course: z.string().optional(),
    graduationYear: z.string().optional(),
    rollNumber: z.string().optional(),
    idCardPhoto: z.instanceof(File).optional(),
    alumniDepartment: z.string().optional(),
    alumniCourse: z.string().optional(),
    alumniGraduationYear: z.string().optional(),
    address: z.string().optional(),
    district: z.string().optional(),
    city: z.string().optional(),
    pinCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.individualType === "Student") {
        return !!data.department && !!data.course && !!data.graduationYear && !!data.rollNumber;
      }
      return true;
    },
    {
      message: "All student fields are required",
      path: ["individualType"],
    }
  )
  .refine(
    (data) => {
      if (data.individualType === "Alumni") {
        return !!data.alumniDepartment && !!data.alumniCourse && !!data.alumniGraduationYear;
      }
      return true;
    },
    {
      message: "All alumni fields are required",
      path: ["individualType"],
    }
  )
  .refine(
    (data) => {
      if (data.individualType === "Visitor") {
        return (
          !!data.address &&
          !!data.district &&
          !!data.city &&
          !!data.pinCode &&
          /^\d{6}$/.test(data.pinCode)
        );
      }
      return true;
    },
    {
      message: "All visitor fields are required",
      path: ["individualType"],
    }
  );

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      individualType: "Student",
    },
  });

  const individualType = watch("individualType");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedFile(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);

    try {
      console.log("Registration attempt with:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const BottomGradient = () => {
    return (
      <>
        <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      </>
    );
  };

  return (
    <div className="w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to Espektro
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Sign up to get your pass and join the fest!
      </p>

      <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" type="text" {...register("name")} disabled={isLoading} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="you@example.com" type="email" {...register("email")} disabled={isLoading} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </LabelInputContainer>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="••••••••" type="password" {...register("password")} disabled={isLoading} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" placeholder="••••••••" type="password" {...register("confirmPassword")} disabled={isLoading} />
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" placeholder="1234567890" type="tel" {...register("phoneNumber")} disabled={isLoading} />
          {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>}
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="individualType">Individual Type</Label>
          <select
            id="individualType"
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background dark:bg-zinc-800 dark:text-neutral-50 shadow-input text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
            {...register("individualType")}
            disabled={isLoading}
          >
            <option value="Student">Student</option>
            <option value="Alumni">Alumni</option>
            <option value="Visitor">Visitor</option>
          </select>
          {errors.individualType && <p className="text-sm text-destructive">{errors.individualType.message}</p>}
        </LabelInputContainer>

        <AnimatePresence mode="wait">
          {individualType === "Student" && (
            <motion.div
              key="student-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 mb-4"
            >
              <h3 className="font-semibold text-lg text-neutral-800 dark:text-neutral-200">Student Information</h3>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <LabelInputContainer>
                  <Label htmlFor="department">Department</Label>
                  <select id="department" {...register("department")} disabled={isLoading} className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background dark:bg-zinc-800 dark:text-neutral-50 shadow-input text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600">
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EE">EE</option>
                    <option value="ME">ME</option>
                    <option value="MCA">MCA</option>
                  </select>
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="course">Course</Label>
                  <select id="course" {...register("course")} disabled={isLoading} className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background dark:bg-zinc-800 dark:text-neutral-50 shadow-input text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600">
                    <option value="">Select Course</option>
                    <option value="B. Tech">B. Tech</option>
                    <option value="M. Tech">M. Tech</option>
                    <option value="MCA">MCA</option>
                  </select>
                </LabelInputContainer>
              </div>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <LabelInputContainer>
                  <Label htmlFor="graduationYear">Year of Graduation</Label>
                  <select id="graduationYear" {...register("graduationYear")} disabled={isLoading} className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background dark:bg-zinc-800 dark:text-neutral-50 shadow-input text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600">
                    <option value="">Select Graduation Year</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                  </select>
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="rollNumber">Roll Number (11 digits)</Label>
                  <Input id="rollNumber" placeholder="12345678901" type="text" {...register("rollNumber")} disabled={isLoading} />
                </LabelInputContainer>
              </div>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="idCardPhoto">Upload ID Card Photo</Label>
                <Input
                  id="idCardPhoto"
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm px-3 py-2 border border-input rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring bg-transparent shadow-input placeholder:text-neutral-400 dark:placeholder:text-neutral-600 dark:text-neutral-50"
                  {...register("idCardPhoto")}
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
                {selectedFile && (
                  <div className="mt-2">
                    <Image src={selectedFile} alt="ID Card Preview" width={160} height={100} className="h-40 object-contain rounded-md" />
                  </div>
                )}
              </LabelInputContainer>
            </motion.div>
          )}

          {individualType === "Alumni" && (
            <motion.div
              key="alumni-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 mb-4"
            >
              <h3 className="font-semibold text-lg text-neutral-800 dark:text-neutral-200">Alumni Information</h3>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <LabelInputContainer>
                  <Label htmlFor="alumniDepartment">Department</Label>
                  <select id="alumniDepartment" {...register("alumniDepartment")} disabled={isLoading} className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background dark:bg-zinc-800 dark:text-neutral-50 shadow-input text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600">
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EE">EE</option>
                    <option value="ME">ME</option>
                    <option value="MCA">MCA</option>
                  </select>
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="alumniCourse">Course</Label>
                  <select id="alumniCourse" {...register("alumniCourse")} disabled={isLoading} className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background dark:bg-zinc-800 dark:text-neutral-50 shadow-input text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600">
                    <option value="">Select Course</option>
                    <option value="B. Tech">B. Tech</option>
                    <option value="M. Tech">M. Tech</option>
                    <option value="MCA">MCA</option>
                  </select>
                </LabelInputContainer>
              </div>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="alumniGraduationYear">Year of Graduation</Label>
                <select id="alumniGraduationYear" {...register("alumniGraduationYear")} disabled={isLoading} className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background dark:bg-zinc-800 dark:text-neutral-50 shadow-input text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600">
                  <option value="">Select Graduation Year</option>
                  {Array.from({ length: 27 }, (_, i) => 1999 + i).map((year) => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))}
                </select>
              </LabelInputContainer>
            </motion.div>
          )}

          {individualType === "Visitor" && (
            <motion.div
              key="visitor-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 mb-4"
            >
              <h3 className="font-semibold text-lg text-neutral-800 dark:text-neutral-200">Visitor Information</h3>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Enter your full address" type="text" {...register("address")} disabled={isLoading} />
              </LabelInputContainer>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <LabelInputContainer>
                  <Label htmlFor="district">District</Label>
                  <Input id="district" placeholder="Enter district" type="text" {...register("district")} disabled={isLoading} />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Enter city" type="text" {...register("city")} disabled={isLoading} />
                </LabelInputContainer>
              </div>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="pinCode">PIN Code (6 digits)</Label>
                <Input id="pinCode" placeholder="123456" type="text" {...register("pinCode")} disabled={isLoading} />
                {errors.pinCode && <p className="text-sm text-destructive">{errors.pinCode.message}</p>}
              </LabelInputContainer>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Sign up →"}
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
      <div className="text-center text-sm text-neutral-600 dark:text-neutral-300">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
          Sign in
        </Link>
      </div>
    </div>
  );
}