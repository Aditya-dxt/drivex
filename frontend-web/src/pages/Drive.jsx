import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Layout from "../components/layout/Layout";
import UploadButton from "../components/drive/UploadButton";
import FileGrid from "../components/drive/FileGrid";
import Breadcrumbs from "../components/drive/Breadcrumbs";

import { getFiles } from "../api/filesApi";
import { getFolders, createFolder, getFolderById } from "../api/foldersApi";

function Drive() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const folderId = searchParams.get("folder");
  const currentFolder = folderId || null;
  const [breadcrumbPath, setBreadcrumbPath] = useState([]);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState("");

  const [currentFolderObj, setCurrentFolderObj] = useState(null);

  useEffect(() => {
  const buildBreadcrumb = async () => {
    if (!folderId) {
      setBreadcrumbPath([{ id: null, name: "My Drive" }]);
      return;
    }

    let chain = [];
    let currentId = folderId;

    while (currentId) {
      const folder = await getFolderById(currentId);
      chain.unshift({
        id: folder._id,
        name: folder.name
      });

      currentId = folder.parentFolder;
    }

    setBreadcrumbPath([
      { id: null, name: "My Drive" },
      ...chain
    ]);
  };

  buildBreadcrumb();
}, [folderId]);


  /*
  ==============================
  FETCH CURRENT FOLDER META
  ==============================
  */

  useEffect(() => {
  const loadFolderMeta = async () => {
    if (!folderId) {
      setCurrentFolderObj(null);
      return;
    }

    try {
      const data = await getFolderById(folderId);
      setCurrentFolderObj(data);
    } catch (error) {
      console.error("Failed to fetch folder info:", error);
    }
  };

  loadFolderMeta();
}, [folderId]);

  /*
  ==============================
  LOAD DRIVE DATA
  ==============================
  */

  useEffect(() => {
    const loadDrive = async () => {
      try {
        console.log("Fetching drive for folder:", currentFolder);

        const foldersData = await getFolders(currentFolder);
        const filesData = await getFiles(currentFolder);

        setFolders(foldersData);
        setFiles(filesData);
      } catch (error) {
        console.error("Drive fetch failed:", error);
      }
    };

    loadDrive();
  }, [currentFolder]);

  /*
  ==============================
  BREADCRUMB PATH
  ==============================
  */

  const path = currentFolderObj
    ? [
        { id: null, name: "My Drive" },
        { id: currentFolderObj._id, name: currentFolderObj.name }
      ]
    : [{ id: null, name: "My Drive" }];

  /*
  ==============================
  FILE UPLOAD
  ==============================
  */

  const handleUpload = (newFile) => {
    setFiles((prev) => [newFile, ...prev]);
  };

  /*
  ==============================
  CREATE FOLDER
  ==============================
  */

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;

    try {
      await createFolder(folderName, currentFolder);

      setFolderName("");

      const updatedFolders = await getFolders(currentFolder);
      setFolders(updatedFolders);
    } catch (error) {
      console.error("Create folder failed:", error);
    }
  };

  /*
  ==============================
  OPEN FOLDER
  ==============================
  */

  const openFolder = (folder) => {
    navigate(`/drive?folder=${folder._id}`);
  };

  /*
  ==============================
  BREADCRUMB NAVIGATION
  ==============================
  */

  const navigateTo = (id) => {
    if (!id) {
      navigate("/drive");
    } else {
      navigate(`/drive?folder=${id}`);
    }
  };

  return (
    <Layout>
      <h1>{path[path.length - 1].name}</h1>

      <Breadcrumbs path={breadcrumbPath} onNavigate={navigateTo} />

      <UploadButton onUpload={handleUpload} />

      {/* CREATE FOLDER */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />

        <button onClick={handleCreateFolder}>Create Folder</button>
      </div>

      {/* FOLDER GRID */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {folders.map((folder) => (
          <div
            key={folder._id}
            onClick={() => openFolder(folder)}
            style={{
              width: "120px",
              padding: "15px",
              borderRadius: "10px",
              background: "#f5f5f5",
              textAlign: "center",
              cursor: "pointer"
            }}
          >
            <div style={{ fontSize: "40px" }}>📁</div>
            <div>{folder.name}</div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {folders.length === 0 && files.length === 0 && (
        <p style={{ marginTop: "20px", color: "#777" }}>
          This folder is empty
        </p>
      )}

      <FileGrid files={files} />
    </Layout>
  );
}

export default Drive;