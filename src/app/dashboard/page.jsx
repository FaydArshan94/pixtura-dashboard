"use client";

import React, { useRef, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import MediaGrid from "../../components/MediaGrid";
import UploadModal from "../../components/UploadModal";
import StatusBar from "../../components/StatusBar";
import CreateFolderModal from "@/components/CreateFolderModal";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [uploadFolderId, setUploadFolderId] = useState(null);

  const mediaGridRef = useRef(null);

  const handleOpenUploadModal = (folderId = null) => {
    setUploadFolderId(folderId);
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleUploadSuccess = () => {
    mediaGridRef.current?.refetch?.();
  };

  const handleOpenFolderModal = () => {
    setIsFolderModalOpen(true);
  };

  const handleCloseFolderModal = () => {
    setIsFolderModalOpen(false);
  };

  const handleFolderCreated = () => {
    mediaGridRef.current?.refetch?.();
  };

  return (
    <div className="flex h-screen w-screen bg-[#f3f7f9] overflow-hidden antialiased font-sans select-none text-[#1e293b]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {/* <Header /> */}

        <div className="flex-1 overflow-y-auto px-8 pb-20 pt-2 custom-scrollbar">
          <MediaGrid
            ref={mediaGridRef}
            onUploadTrigger={handleOpenUploadModal}
            onNewFolderTrigger={handleOpenFolderModal}
          />
        </div>

        <StatusBar />
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onUploadSuccess={handleUploadSuccess}
        folderId={uploadFolderId}
      />

      <CreateFolderModal
        isOpen={isFolderModalOpen}
        onClose={handleCloseFolderModal}
        onCreated={handleFolderCreated}
      />
    </div>
  );
}
