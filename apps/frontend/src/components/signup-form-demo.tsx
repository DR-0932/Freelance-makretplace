"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation'
import { signupUser } from "@/lib/api";

export default function SignupFormDemo() {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "freelancer"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null)

    try {
      await signupUser(formData);
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role: "freelancer" | "client") => {
    setFormData((prev) => ({ ...prev, role }));
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to Freelance platform
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Create account to get Started
      </p>
      {error && (
        <p className="mt-4 rounded-md bg-red-50 p-2.5 text-sm text-red-500 border border-red-200 dark:bg-red-950/50 dark:border-red-800">
          {error}
        </p>
      )}

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label>I want to join as a</Label>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => handleRoleSelect("freelancer")}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl border p-3 text-sm font-medium transition-all",
                formData.role === "freelancer"
                  ? "border-emerald-500 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
                  : "border-neutral-200 bg-neutral-50/50 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-zinc-900 dark:text-neutral-400"
              )}
            >
              <span className="font-semibold">Freelancer</span>
              <span className="text-xs text-neutral-500 font-normal">Work on projects</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("client")}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl border p-3 text-sm font-medium transition-all",
                formData.role === "client"
                  ? "border-emerald-500 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
                  : "border-neutral-200 bg-neutral-50/50 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-zinc-900 dark:text-neutral-400"
              )}
            >
              <span className="font-semibold">Client</span>
              <span className="text-xs text-neutral-500 font-normal">Hire talent</span>
            </button>
          </div>
        </LabelInputContainer>

        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Tyler" type="text" required onChange={handleChange} />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Durden" type="text" required onChange={handleChange} />
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="projectmayhem@fc.com" type="email" required onChange={handleChange} />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" required minLength={8} onChange={handleChange} />
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign up →"}
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};