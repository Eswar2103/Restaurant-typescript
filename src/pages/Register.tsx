import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FormRow, LoadingButton } from "./Utils";
import { registerUser, type RegisterUser } from "../services/apiAuth";
import { toast } from "react-toastify";

type RegisterUserForm = RegisterUser & {
  confirmPassword: string;
};

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<RegisterUserForm>({
    defaultValues: {
      role: "reviewer",
    },
  });

  const [show, setShow] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Registration successful! You can now log in.");
      navigate("/login");
    },
    onError: (error: Error) => {
      const msg = error?.message?.toLowerCase() ?? "";
      if (msg.includes("already registered")) {
        toast.error(
          "An account with this email already exists. Please log in.",
        );
      } else {
        toast.error(
          "Registration failed. Please check your details and try again.",
        );
      }
      console.error("Registration error:", error.message);
    },
  });

  const onSubmit = (data: RegisterUser) => mutate(data);

  return (
    <div className="flex flex-col gap-5 border-none rounded-xl p-5 max-w-150 w-full mx-auto px-4 shadow-xl/30 bg-white">
      <p className="text-center text-2xl font-bold">Register</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormRow label="Full Name" error={errors?.name}>
          <input
            className="border bg-gray-100 rounded-xl shadow-sm px-[0.8rem] py-2 w-full"
            type="text"
            placeholder="Full Name"
            {...register("name", {
              required: "Full Name is required",
            })}
          />
        </FormRow>
        <FormRow label="Role" error={errors?.role}>
          {["Reviewer", "Owner"].map((r) => (
            <label key={r} className="flex items-center cursor-pointer gap-2">
              <input
                className={`w-4 h-4 ${r === "Owner" ? "accent-blue-500" : "accent-purple-500"}`}
                type="radio"
                value={r.toLowerCase()}
                {...register("role", {
                  required: "Role is required",
                })}
              />
              <span>{r}</span>
            </label>
          ))}
        </FormRow>
        <FormRow label="Email" error={errors?.email}>
          <input
            className="border bg-gray-100 rounded-xl shadow-sm px-[0.8rem] py-2 w-full"
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please provide a valid email address",
              },
            })}
          />
        </FormRow>
        <FormRow label="Password" error={errors?.password}>
          <div className="relative w-full">
            <input
              className="border bg-gray-100 rounded-xl shadow-sm px-[0.8rem] py-2 pr-8 w-full"
              type={show ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password needs a minimum of 8 characters",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShow((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 duration-200"
            >
              {show ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
        </FormRow>
        <FormRow label="Confirm Password" error={errors?.confirmPassword}>
          <div className="relative w-full">
            <input
              className="border bg-gray-100 rounded-xl shadow-sm px-[0.8rem] py-2 pr-8 w-full"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => {
                  const { password } = getValues();
                  return value === password || "Passwords do not match";
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 duration-200"
            >
              {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
        </FormRow>
        <FormRow>
          <div className="flex flex-col gap-3 justify-center">
            <LoadingButton
              classes={
                "bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600 w-64"
              }
              text1="Registering..."
              text2="Register"
              isLoading={isPending}
            />
            <p className="text-center">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:underline hover:text-blue-800 duration-200"
              >
                Login
              </a>
            </p>
          </div>
        </FormRow>
      </form>
    </div>
  );
}

export default Register;
