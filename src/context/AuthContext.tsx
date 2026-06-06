import {
  createContext,
  useState,
  useEffect,
  useRef,
  type ReactElement,
} from "react";
import { supabase } from "../services/supabase";
import type { Session } from "@supabase/supabase-js";

type ChildrenType = {
  children: ReactElement | ReactElement[];
};

type UserSession = Session["user"];

type SupabaseAuthResult = {
  role: string | null;
  name: string | null;
};

type ContextType = {
  user: UserSession | null;
  role: string | null;
  loading: boolean;
  name: string | null;
};

const initContext: ContextType = {
  user: null,
  role: null,
  loading: false,
  name: null,
};

const AuthContext = createContext(initContext);

export default function AuthPrvider({ children }: ChildrenType) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const userRef = useRef<UserSession | null>(null);
  const roleRef = useRef<string | null>(null);

  useEffect(() => {
    userRef.current = user;
    roleRef.current = role;
  }, [user, role]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session) => {
      if (!session?.user) {
        setUser(null);
        setRole(null);
        setName(null);
        setLoading(false);
        return;
      }

      if (
        (event === "SIGNED_IN" ||
          event === "INITIAL_SESSION" ||
          event === "TOKEN_REFRESHED") &&
        session.user
      ) {
        // onAuthStateChange runs even on browser tab change, so this way it avoids re-renders
        if (session?.user?.id === userRef.current?.id && roleRef.current) {
          return;
        }

        try {
          const { data, error } = await supabase
            .from("users")
            .select("role, name")
            .eq("id", session.user.id)
            .maybeSingle();

          if (error) {
            throw new Error("Something went wrong!");
          }

          if (data) {
            const u: SupabaseAuthResult = data;
            setName(u?.name ?? null);
            setUser(session?.user ?? null);
            setRole(u?.role ?? null);
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUser(session?.user ?? null);
          setRole(null);
          setLoading(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, name }}>
      {children}
    </AuthContext.Provider>
  );
}
