import type { Session, User, WeakPassword } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type RegisterUser = {
  email: string;
  password: string;
  name: string;
  role: string;
};

type RegisterUserResponse = Promise<{
  user: User | null;
  session: Session | null;
}>;

export type LoginUser = {
  email: string;
  password: string;
};

type LoginUserResponse = Promise<{
  role: string;
  user: User;
  session: Session;
  weakPassword?: WeakPassword;
}>;

async function registerUser({
  email,
  password,
  name,
  role,
}: RegisterUser): RegisterUserResponse {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    throw error;
  }

  if (!data?.user?.id) {
    throw new Error("User Not found!");
  }

  const { error: userError } = await supabase.from("users").insert({
    id: data.user.id,
    name,
    role,
  });
  if (userError) {
    throw userError;
  }

  // Step 3 - Clear session so user must login manually
  // await supabase.auth.signOut();

  return data;
}

async function login({ email, password }: LoginUser): LoginUserResponse {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  const id = data.user.id;
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  if (userError) {
    throw userError;
  }
  return { ...data, role: userData.role };
}

async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export { registerUser, login, signOut };
