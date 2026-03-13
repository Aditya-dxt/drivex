import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getFolders, getFolderById } from "../../api/foldersApi";

function FolderTree({ onSelectFolder }) {
  const [searchParams] = useSearchParams();
  const currentFolder = searchParams.get("folder");
  const currentFolderId = searchParams.get("folder");
  const [path, setPath] = useState([]);
  const [children, setChildren] = useState([]);

  useEffect(() => {
    const buildPath = async () => {
      if (!currentFolder) {
        setPath([]);
        return;
      }

      let chain = [];
      let folderId = currentFolder;

      while (folderId) {
        const folder = await getFolderById(folderId);
        chain.unshift(folder);
        folderId = folder.parentFolder;
      }

      setPath(chain);
    };

    buildPath();
  }, [currentFolder]);

  useEffect(() => {
    const loadChildren = async () => {
      const data = await getFolders(currentFolder);
      setChildren(data);
    };

    loadChildren();
  }, [currentFolder]);

  return (
    <div style={{ paddingLeft: "8px" }}>
      {path.map((folder, index) => (
        <div key={folder._id}>
          <div
            onClick={() => onSelectFolder(folder._id)}
            style={{
              paddingLeft: `${index * 16}px`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              paddingTop: "4px",
              paddingBottom: "4px",
              background:
                folder._id === currentFolderId ? "#e8f0fe" : "transparent",
            }}
          >
            📁 {folder.name}
          </div>

          {index === path.length - 1 &&
            children.map((child) => (
              <div
                key={child._id}
                onClick={() => onSelectFolder(child._id)}
                style={{
                  paddingLeft: `${(index + 1) * 16}px`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  background:
                    child._id === currentFolderId ? "#e8f0fe" : "transparent",
                  borderRadius: "6px",
                }}
              >
                📁 {child.name}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

export default FolderTree;
