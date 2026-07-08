import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { motion } from "motion/react";
import {
  Folder,
  FileText,
  Copy,
  Link2,
  Trash2,
  Search,
  ArrowUpDown,
  Plus,
  Home,
  ChevronRight,
} from "lucide-react";
import instance from "../lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const MediaGrid = forwardRef(function MediaGrid(
  { onUploadTrigger, onNewFolderTrigger },
  ref,
) {
  const router = useRouter();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [folders, setFolders] = useState([]);

  // NEW: which folder are we currently viewing? null = root/Home
  const [currentFolder, setCurrentFolder] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const endpoint = "/api/media";

  const formatBytes = (bytes) => {
    if (!bytes) return "0 KB";
    const units = ["B", "KB", "MB", "GB"];
    let value = bytes;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }
    return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  };

  const formatDate = (value) => {
    if (!value) return "Unknown date";
    return new Date(value).toLocaleDateString("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const normalizeMediaFiles = (value) => {
    if (Array.isArray(value)) {
      return value.flatMap((item) => normalizeMediaFiles(item));
    }
    if (value?.media) {
      return normalizeMediaFiles(value.media);
    }
    return value ? [value] : [];
  };

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await instance.get(endpoint);
      const payload = response?.data ?? [];
      const normalized = normalizeMediaFiles(payload);
      setImages(normalized);
    } catch (err) {
      console.error("Error fetching images:", err);
      setError("Unable to load media right now.");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const handleDelete = async (fileId) => {
    if (!fileId) {
      toast.error("File ID is required for deletion.");
      return;
    }

    const deleteToastId = toast.loading("Deleting...");

    try {
      await instance.delete(`${endpoint}/delete/${fileId}`);
      setImages((prevImages) =>
        prevImages.filter((file) => file._id !== fileId),
      );
      toast.success("File deleted!", { id: deleteToastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed", {
        id: deleteToastId,
      });
    }
  };

  const fetchFolders = useCallback(async () => {
    try {
      const response = await instance.get("/api/folders/get/folders");
      setFolders(response.data || []);
    } catch (err) {
      console.error("Error fetching folders:", err);
    }
  }, []);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useImperativeHandle(
    ref,
    () => ({
      refetch: () => {
        fetchImages();
        fetchFolders();
      },
    }),
    [fetchImages, fetchFolders],
  );

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0] && onUploadTrigger) {
      onUploadTrigger(currentFolder?._id || null);
    }
  };

  // NEW: filter by current folder first, then search, then sort
  const visibleImages = useMemo(() => {
    const inCurrentFolder = images.filter((file) => {
      const fileFolderId = file?.folderId || null;
      const activeFolderId = currentFolder?._id || null;
      return fileFolderId === activeFolderId;
    });

    const term = searchTerm.trim().toLowerCase();
    const filtered = term
      ? inCurrentFolder.filter((file) =>
          String(file?.originalName || "")
            .toLowerCase()
            .includes(term),
        )
      : inCurrentFolder;

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = String(a?.originalName || "").localeCompare(
          String(b?.originalName || ""),
        );
      } else if (sortBy === "size") {
        comparison = (a?.size || 0) - (b?.size || 0);
      } else {
        comparison = new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [images, currentFolder, searchTerm, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`space-y-6 mt-4 relative rounded-lg transition-all duration-150 ${
        dragActive ? "bg-blue-50 ring-2 ring-blue-300" : ""
      }`}
    >
      {dragActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-blue-100/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-30 pointer-events-none"
        >
          <div className="text-center">
            <p className="text-lg font-bold text-blue-700">Drop to upload</p>
          </div>
        </motion.div>
      )}

      {/* NEW: breadcrumb */}
      <div className="flex items-center justify-between gap-1.5 text-sm text-slate-500">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentFolder(null)}
            className={`flex items-center gap-1 hover:text-slate-800 ${
              !currentFolder ? "font-semibold text-slate-800" : ""
            }`}
          >
            <Home size={14} />
            Home
          </button>
          {currentFolder ? (
            <>
              <ChevronRight size={14} />
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Folder size={14} />
                {currentFolder.name}
              </span>
            </>
          ) : null}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search files..."
                className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-300 w-full sm:w-48"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm rounded-lg border border-slate-200 bg-white text-slate-700 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-300"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
            </select>

            <button
              onClick={toggleSortOrder}
              title={sortOrder === "asc" ? "Ascending" : "Descending"}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            >
              <ArrowUpDown size={14} />
            </button>

            <button
              onClick={() => onUploadTrigger?.(currentFolder?._id || null)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 transition-colors"
            >
              <Plus size={14} /> Upload
            </button>
            <button
              onClick={() => onNewFolderTrigger?.()}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 transition-colors"
            >
              <Plus size={14} /> New Folder
            </button>
          </div>
        </div>
      </div>

      {/* Only show folder list at root — flat folders, no nesting */}
      {!currentFolder && (
        <div>
          <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-3">
            Folders
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {folders.map((folder) => (
              <motion.div
                key={folder._id}
                onClick={() => setCurrentFolder(folder)}
                whileHover={{
                  y: -2,
                  border: "1px solid #cbd5e1",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                }}
                className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all duration-150"
              >
                <Folder
                  size={18}
                  className="text-slate-400 fill-slate-100 shrink-0"
                />
                <span className="text-sm font-medium text-slate-700 truncate">
                  {folder.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2">
        {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Files
            </h3>
            <span className="text-[11px] text-slate-400">
              {visibleImages.length}{" "}
              {visibleImages.length === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search files..."
                className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-300 w-full sm:w-48"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm rounded-lg border border-slate-200 bg-white text-slate-700 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-300"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
            </select>

            <button
              onClick={toggleSortOrder}
              title={sortOrder === "asc" ? "Ascending" : "Descending"}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            >
              <ArrowUpDown size={14} />
            </button>

            <button
              onClick={() => onUploadTrigger?.()}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 transition-colors"
            >
              <Plus size={14} /> Upload
            </button>
            <button
              onClick={() => onNewFolderTrigger?.()}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 transition-colors"
            >
              <Plus size={14} /> New Folder
            </button>
          </div>
        </div> */}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden animate-pulse"
              >
                <div className="h-40 bg-slate-100" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="h-3 bg-slate-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
            {error}
          </div>
        ) : visibleImages.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            {images.length === 0
              ? "No media files yet."
              : "No files match your search."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {visibleImages.map((file) => {
              const isImage = [
                "jpg",
                "jpeg",
                "png",
                "webp",
                "gif",
                "avif",
              ].includes(String(file?.format || "").toLowerCase());

              return (
                <motion.div
                  whileHover={{
                    y: -4,
                    boxShadow: "0 12px 24px rgba(0,0,0,0.04)",
                  }}
                  key={file?._id || file?.s3Key || file?.url}
                  onClick={() => router.push(`/media/${file._id}`)}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden cursor-pointer flex flex-col group transition-all duration-200"
                >
                  <div className="h-40 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
                    {isImage && file?.url ? (
                      <img
                        src={file.url}
                        alt={file.originalName || "Media preview"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                        <FileText size={28} />
                        <span className="text-xs font-medium uppercase tracking-wide">
                          {file?.format || "file"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {file?.originalName || "Unnamed file"}
                        </p>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                            title="Copy metadata info"
                          >
                            <Copy size={12} />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                            title="Get Share Link"
                          >
                            <Link2 size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(file?._id);
                            }}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                            title="Delete File"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 space-y-1 text-[11px] text-slate-500">
                        <p>
                          <span className="font-medium text-slate-600">
                            Size:
                          </span>{" "}
                          {formatBytes(file?.size)}
                        </p>
                        <p>
                          <span className="font-medium text-slate-600">
                            Resolution:
                          </span>{" "}
                          {file?.width || "-"}×{file?.height || "-"}
                        </p>
                        <p>
                          <span className="font-medium text-slate-600">
                            Uploaded:
                          </span>{" "}
                          {formatDate(file?.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

export default MediaGrid;
