"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import instance from "../../../lib/axios";
import AppShell from "../../../components/AppShell";
import {
  Copy,
  Trash2,
  ArrowLeft,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";

const FORMATS = ["", "jpeg", "png", "webp", "avif"];
const FITS = ["inside", "cover", "contain", "fill", "outside"];

function formatBytes(bytes) {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatDate(value) {
  if (!value) return "Unknown date";
  return new Date(value).toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function buildTransformUrl(media, params = {}) {
  if (!media?.s3Key) return "";

  const query = new URLSearchParams();
  const entries = [
    ["w", params.w],
    ["h", params.h],
    ["format", params.format],
    ["quality", params.quality],
    ["fit", params.fit],
  ];

  entries.forEach(([key, value]) => {
    if (value === "" || value === null || value === undefined) return;
    if (key === "fit" && value === "inside") return;
    query.set(key, String(value));
  });

  const qs = query.toString();
  return `/api/media/${media.s3Key}${qs ? `?${qs}` : ""}`;
}

export default function MediaDetailPage() {


  const { id } = useParams();
  const router = useRouter();

  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  const [params, setParams] = useState({
    w: "",
    h: "",
    format: "",
    quality: "",
    fit: "inside",
  });

  const [debouncedParams, setDebouncedParams] = useState(params);

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await instance.get(`/api/media/${id}`);
        setMedia(response.data?.media || null);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load this file.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMedia();
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedParams(params), 400);
    return () => clearTimeout(timer);
  }, [params]);

  const generatedUrl = useMemo(
    () => buildTransformUrl(media, debouncedParams),
    [media, debouncedParams],
  );

  const publicUrl = useMemo(() => {
    if (!generatedUrl) return "";
    return generatedUrl.startsWith("http")
      ? generatedUrl
      : `${instance?.defaults?.baseURL}${generatedUrl}`;
  }, [generatedUrl]);

  const handleParamChange = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const copyUrl = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setInfoMessage("Transformation URL copied to clipboard.");
    } catch {
      setError("Unable to copy the URL. Please copy it manually.");
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm("Delete this file permanently? This cannot be undone.")
    ) {
      return;
    }

    setDeleting(true);
    try {
      await instance.delete(`/api/media/delete/${media._id}`);
      router.push("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to delete this file.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <main className="min-h-full py-8">
          <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
            Loading file...
          </div>
        </main>
      </AppShell>
    );
  }

  if (error && !media) {
    return (
      <AppShell>
        <main className="min-h-full py-8">
          <div className="mx-auto max-w-6xl rounded-3xl border border-rose-200 bg-rose-50 p-8 text-sm text-rose-600">
            {error}
          </div>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main className="min-h-full py-8">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft size={16} />
            Back to library
          </button>

          <div className="mb-8 rounded-4xl bg-white border border-slate-200 p-8 shadow-sm">
            {/* Header */}
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Media
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 break-all">
                  {media?.originalName || "Unnamed file"}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  {formatBytes(media?.size)} · {media?.width || "-"}×
                  {media?.height || "-"} · {media?.format} · Uploaded{" "}
                  {formatDate(media?.createdAt)}
                </p>
              </div>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-100 disabled:opacity-60"
              >
                <Trash2 size={16} />
                {deleting ? "Deleting..." : "Delete file"}
              </button>
            </div>

            {error ? (
              <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {infoMessage ? (
              <div className="mt-6 rounded-3xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-slate-900">
                {infoMessage}
              </div>
            ) : null}

            <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              {/* Live preview */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-center min-h-80">
                {media ? (
                  <img
                    src={media?.url}
                    alt={media?.originalName || "Preview"}
                    className="max-h-96 max-w-full rounded-xl object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <ImageIcon size={32} />
                    <span className="text-xs">No preview available</span>
                  </div>
                )}
              </div>

              {/* Transformation builder */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-sm font-semibold text-slate-900 mb-4">
                  Transformation URL Builder
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={params.w}
                      onChange={(e) => handleParamChange("w", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                      placeholder="auto"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-500">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={params.h}
                      onChange={(e) => handleParamChange("h", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                      placeholder="auto"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-500">
                      Format
                    </label>
                    <select
                      value={params.format}
                      onChange={(e) =>
                        handleParamChange("format", e.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                    >
                      {FORMATS.map((f) => (
                        <option key={f} value={f}>
                          {f || "original"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-500">
                      Fit
                    </label>
                    <select
                      value={params.fit}
                      onChange={(e) => handleParamChange("fit", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                    >
                      {FITS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-xs font-medium text-slate-500">
                      Quality (1–100)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={params.quality}
                      onChange={(e) =>
                        handleParamChange("quality", e.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                      placeholder="default"
                    />
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500 mb-1">
                    Generated URL
                  </p>
                  <code className="block break-all text-xs text-slate-700">
                    {publicUrl || "—"}
                  </code>
                </div>

                <button
                  onClick={copyUrl}
                  disabled={!publicUrl}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  <Copy size={16} />
                  Copy generated URL
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
