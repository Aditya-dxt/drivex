import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import UploadButton from "../components/drive/UploadButton";
import FileGrid from "../components/drive/FileGrid";
import { getFiles } from "../api/filesApi";
import { createFolder, getFolders } from "../api/foldersApi";
import Breadcrumbs from "../components/drive/Breadcrumbs";

function Drive() {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [currentFolder, setCurrentFolder] = useState(null);
  const [path, setPath] = useState([{ id: null, name: "My Drive" }]);

  /*
  ==============================
  FETCH DRIVE DATA
  ==============================
  */

  const fetchDrive = async (folderId = null) => {
    try {
      console.log("Fetching drive for folder:", folderId);

      const foldersData = await getFolders(folderId);
      console.log("Folders:", foldersData);

      setFolders(foldersData);

      const filesData = await getFiles(folderId);
      console.log("Files:", filesData);

      setFiles(filesData);

      setCurrentFolder(folderId);
    } catch (error) {
      console.error("Fetch drive failed:", error);
    }
  };

  useEffect(() => {
    const loadDrive = async () => {
      await fetchDrive();
    };

    loadDrive();
  }, []);

  /*
  ==============================
  FILE UPLOAD HANDLER
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

      fetchDrive(currentFolder);
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
    setPath((prev) => [...prev, { id: folder._id, name: folder.name }]);
    fetchDrive(folder._id);
  };

  const navigateTo = (folderId) => {
    const index = path.findIndex((p) => p.id === folderId);

    const newPath = path.slice(0, index + 1);

    setPath(newPath);

    fetchDrive(folderId);
  };

  return (
    <Layout>
      <h1>{path[path.length - 1].name}</h1>
      <Breadcrumbs path={path} onNavigate={navigateTo} />
      <UploadButton onUpload={handleUpload} />

      {/* Create Folder */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />

        <button onClick={handleCreateFolder}>Create Folder</button>
      </div>

      {/* Folder Grid */}
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
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "40px" }}>📁</div>
            <div>{folder.name}</div>
          </div>
        ))}
      </div>

      {/* Files */}
      {folders.length === 0 && files.length === 0 && (
        <p style={{ marginTop: "20px", color: "#777" }}>This folder is empty</p>
      )}

      <FileGrid files={files} />
    </Layout>
  );
}

export default Drive;
