"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Upload,
  File,
  Image as ImageIcon,
  FileText,
  Music,
  Video,
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";

import axiosInstance from "../lib/axios";

export default function UploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
  folderId,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const getFileIcon = (file) => {
    if (!file) return null;
    const type = file.type;
    const name = file.name.toLowerCase();

    if (type.startsWith("image/")) {
      return <ImageIcon size={24} className="text-blue-500" />;
    }
    if (type.startsWith("video/")) {
      return <Video size={24} className="text-purple-500" />;
    }
    if (type.startsWith("audio/")) {
      return <Music size={24} className="text-orange-500" />;
    }
    if (type === "application/pdf" || name.endsWith(".pdf")) {
      return <FileText size={24} className="text-red-500" />;
    }
    return <File size={24} className="text-slate-500" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex += 1;
    }

    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  };

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
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    const uploadToastId = toast.loading("Uploading...");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (folderId) {
        formData.append("folderId", folderId);
      }

      await axiosInstance.post("/api/media/upload/dashboard", formData);

      toast.success("File uploaded!", { id: uploadToastId });
      onUploadSuccess?.();
      handleReset();
      if (onClose) onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload failed", {
        id: uploadToastId,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Upload Media</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {!selectedFile ? (
                <>
                  {/* Drop Zone */}
                  <motion.div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    animate={{
                      borderColor: dragActive ? "#3b82f6" : "#e2e8f0",
                      backgroundColor: dragActive ? "#eff6ff" : "#ffffff",
                    }}
                    transition={{ duration: 0.15 }}
                    className="border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
                  >
                    <motion.div
                      animate={{ y: dragActive ? -4 : 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Upload size={32} className="text-slate-300" />
                    </motion.div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-700">
                        Drag and drop your file here
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        or click to browse
                      </p>
                    </div>
                  </motion.div>

                  {/* File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleChange}
                    className="hidden"
                  />

                  {/* Browse Button */}
                  <button
                    onClick={handleClick}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-lg transition-colors"
                  >
                    Choose File
                  </button>

                  {/* Info Text */}
                  <p className="text-xs text-slate-500 text-center">
                    Supported formats: Images, Videos, Audio, Documents
                  </p>
                </>
              ) : (
                <>
                  {/* File Preview */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 rounded-xl p-4 flex items-center gap-4"
                  >
                    <div className="flex-shrink-0 p-3 bg-white rounded-lg border border-slate-200">
                      {getFileIcon(selectedFile)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                    <button
                      onClick={handleReset}
                      className="flex-shrink-0 p-2 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <X size={18} className="text-slate-500" />
                    </button>
                  </motion.div>

                  {/* File Details */}
                  <div className="space-y-3 p-4 bg-slate-50 rounded-xl text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>File Type:</span>
                      <span className="font-medium text-slate-900">
                        {selectedFile.type || "Unknown"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Modified:</span>
                      <span className="font-medium text-slate-900">
                        {new Date(
                          selectedFile.lastModified,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Upload size={16} />
                )}
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
