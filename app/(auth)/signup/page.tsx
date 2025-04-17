import { Metadata } from "next";
import SignupForm from "@/app/components/forms/signup-form";
import { ShineBorder } from "@/app/components/magicui/shine-border";

export const metadata: Metadata = {
  title: "Sign up | Espektro",
  description: "Create your Espektro account",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-gray-900 dark:to-slate-900">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-900 p-8 shadow-xl w-full max-w-lg">
          <ShineBorder
            className="absolute inset-0"
            shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          />
          <SignupForm />
        </div>
      </div>
    </div>
  );
}