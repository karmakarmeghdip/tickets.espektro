import { Metadata } from "next";
import Image from "next/image";
import LoginForm from "@/app/components/forms/login-form";
import { ShineBorder } from "@/app/components/magicui/shine-border";

export const metadata: Metadata = {
  title: "Login - Espektro Ticketing System",
  description: "Login to your Espektro account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-gray-900 dark:to-slate-900">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="flex w-full max-w-4xl flex-col md:flex-row lg:flex-row">
          {/* Left section - Illustration */}
          <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-10 rounded-l-lg">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-6">Welcome to Espektro</h1>
              <p className="text-white/90 mb-8">Sign in to access your tickets and manage your event experience.</p>
              <div className="relative w-full h-64">
                <Image 
                  src="/logo.png" 
                  alt="Login illustration"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
          
          {/* Right section - Login form */}
          <div className="relative w-full md:w-1/2 bg-white dark:bg-slate-900 shadow-xl rounded-lg md:rounded-l-none md:rounded-r-lg overflow-hidden">
            <ShineBorder
              className="absolute inset-0"
              shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
            />
            <div className="flex items-center justify-center p-4 md:p-8 h-full">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}