"use client";

import { useEffect } from "react";
import useStore from "@/lib/useStore";

export default function AuthProvider({ children }) {
  const { fetchCurrentUser } = useStore();

  useEffect(() => {
  fetchCurrentUser()
    .then(user => console.log("user fetched", user))
    .catch(err => console.log("fetch failed", err));
}, []);

  return children;
}