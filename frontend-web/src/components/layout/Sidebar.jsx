import { useNavigate } from "react-router-dom";
import FolderTree from "../drive/FolderTree";

function Sidebar() {
  const navigate = useNavigate();

  const handleFolderSelect = (folderId) => {
    navigate(`/drive?folder=${folderId}`);
    };

  return (
          <div
            style={{
        width: "240px",
        padding: "16px",
        borderRight: "1px solid #e5e5e5",
        background: "#fafafa",
        height: "100vh",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>DriveX</h2>

      <div style={{ marginBottom: "16px", fontWeight: "600" }}>My Drive</div>

      <FolderTree onSelectFolder={handleFolderSelect} />

      <div style={{ marginTop: "30px" }}>
        <p
          style={{ cursor: "pointer", marginBottom: "8px" }}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </p>

        <p style={{ cursor: "pointer" }} onClick={() => navigate("/trash")}>
          Trash
        </p>
        </div>
    </div>
  );
}

export default Sidebar;
