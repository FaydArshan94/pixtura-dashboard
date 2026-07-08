"use client";

import { useEffect } from "react";
import useStore from "@/lib/useStore";

export default function AuthProvider({ children }) {
  const { fetchCurrentUser } = useStore();

  useEffect(() => {
    fetchCurrentUser().catch(() => {});
  }, []);

  return children;
}