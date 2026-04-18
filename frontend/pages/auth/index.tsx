import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AuthIndexPage() {
  const router = useRouter();

  useEffect(() => {
    void router.replace("/auth/login");
  }, [router]);

  return null;
}
