import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FormRow, LoadingButton } from "./Utils";
import { useMutation } from "@tanstack/react-query";
import { login, type LoginUser } from "../services/apiAuth";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";

function Login() {
  const { register, handleSubmit, formState } = useForm<LoginUser>();
  const { errors } = formState;
  const [show, setShow] = useState(false);

  const { user, role, loading } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toast.success(
        data.role === "owner"
          ? "Login successful as owner!"
          : "Login successful as reviewer!",
      );
    },
    onError: () => {
      toast.error(
        "Login failed!. Please check your credentials and try again.",
      );
    },
  });

  const onSubmit = (data: LoginUser) => mutate(data);

  if (!loading && user && role)
    return (
      <Navigate
        to={role === "owner" ? "/my-restaurants" : "/restaurants"}
        replace
      />
    );

  return (
    <div className="flex flex-col gap-5 border-none rounded-xl p-5 bg-white max-w-150 w-full mx-auto px-4 shadow-xl/30">
      <p className="text-center text-2xl font-bold">Login</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
        <FormRow>
          <div className="flex flex-col gap-3 justify-center">
            <LoadingButton
              text1="Logging in..."
              text2="Login"
              isLoading={isPending}
              classes={
                "bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600 w-64"
              }
            />
            <p className="text-center">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:underline hover:text-blue-800 duration-200"
              >
                Register
              </a>
            </p>
          </div>
        </FormRow>
      </form>
    </div>
  );
}

export default Login;
