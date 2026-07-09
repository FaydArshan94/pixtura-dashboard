"use client";

import React, { useEffect, useState } from "react";
import instance from "../../../lib/axios";
import { AlertTriangle, Copy, Key, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import AppShell from "../../../components/AppShell";
import { useStore } from "../../../lib/useStore";

export default function ApiKeysPage() {
  const [isLoading, setIsLoading] = useState(false);

  const [rawKey, setRawKey] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const auth = useStore((state) => state.auth);
  const fetchCurrentUser = useStore((state) => state.fetchCurrentUser);
  const updateUser = useStore((state) => state.updateUser);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    if (auth?.isAuthenticated) {
      fetchCurrentUser().catch(() => {});
    }
  }, [auth?.isAuthenticated, fetchCurrentUser]);

  const isActive = Boolean(auth?.user?.hasApiKey);



  const generateKey = async (regenerate = false) => {
    if (
      regenerate &&
      !window.confirm(
        "Regenerating your API key will revoke the current key. Continue?",
      )
    ) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      const response = await instance.post("/api/auth/generate-api-key");
      setRawKey(response.data.apiKey);
      updateUser({ hasApiKey: response.data.hasApiKey });
      setInfoMessage(
        "Your API key was generated. Copy it now because it will not be shown again.",
      );
      toast.success(
        "API key generated! Save it now — it won't be shown again.",
      );
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Unable to generate API key.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  const copyKey = async () => {
    if (!rawKey) return;
    try {
      await navigator.clipboard.writeText(rawKey);
      setInfoMessage("API key copied to clipboard.");
    } catch (error) {
      setErrorMessage("Unable to copy the API key. Please copy it manually.");
    }
  };

  return (

      <main className="min-h-full py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 rounded-4xl bg-white border border-slate-200 p-8 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Security
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
                  API Keys
                </h1>
                <p className="mt-3 max-w-2xl text-base text-slate-600">
                  Generate and manage the API key used to access your Pixtura
                  integrations. The raw key is shown once, and the page only
                  tracks whether a key is active.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 shadow-sm">
                <div className="rounded-2xl bg-slate-100 p-3 text-blue-500">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    API key status
                  </p>
                  <p className="text-sm text-slate-500">
                    {isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
              <section className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-[#fcfdff] p-8 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        API key management
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        The server stores only a hashed version of your key.
                        Only the freshly generated raw key can be copied.
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-800 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                      {isActive ? "Active" : "No active key"}
                    </div>
                  </div>

                  {errorMessage ? (
                    <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                      {errorMessage}
                    </div>
                  ) : null}

                  {infoMessage ? (
                    <div className="mt-6 rounded-3xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-slate-900">
                      {infoMessage}
                    </div>
                  ) : null}

                  <div className="mt-6 rounded-3xl bg-white p-5 border border-slate-200">
                    <div className="flex items-center gap-3 text-slate-700">
                      <Key size={18} className="text-slate-500" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Current API key
                        </p>
                        <p className="text-xs text-slate-500">
                          {rawKey
                            ? "Copy this key now. It will not be shown again."
                            : isActive
                              ? "A key exists on the server, but the raw value is hidden."
                              : "No API key is active yet."}
                        </p>
                      </div>
                    </div>

                    {isPageLoading ? (
                      <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 animate-pulse">
                        <div className="space-y-3">
                          <div className="h-4 w-32 rounded bg-slate-200" />
                          <div className="h-3 w-48 rounded bg-slate-100" />
                          <div className="h-24 rounded-2xl bg-slate-200" />
                          <div className="flex gap-3">
                            <div className="h-11 w-40 rounded-2xl bg-slate-200" />
                            <div className="h-11 w-28 rounded-2xl bg-slate-100" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
                        {rawKey ? (
                          <code className="block break-all text-sm leading-6 text-slate-900">
                            {rawKey}
                          </code>
                        ) : (
                          <div className="flex items-center gap-2 text-slate-500">
                            <AlertTriangle size={16} />
                            <span>
                              {isActive
                                ? "Raw key not available. Regenerate to create a new one."
                                : "No API key is active."}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => generateKey(isActive)}
                        className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <RefreshCw size={16} className="mr-2" />
                        {isActive ? "Regenerate API key" : "Generate API key"}
                      </button>

                      <button
                        type="button"
                        disabled={!rawKey || isLoading}
                        onClick={copyKey}
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Copy size={16} className="mr-2" />
                        Copy key
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <aside className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">
                    API key at a glance
                  </p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-400"></span>
                      Use a fresh key only in server-side integrations.
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-400"></span>
                      The raw key is displayed once after creation.
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-400"></span>
                      Storing only the hashed value protects the secret on the
                      server.
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>

  );
}
