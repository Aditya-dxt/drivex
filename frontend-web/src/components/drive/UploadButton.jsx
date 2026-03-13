import { useRef } from "react";
import { uploadFile } from "../../api/filesApi";

export default function UploadButton() {
  const fileInputRef = useRef();

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      await uploadFile(file);
      alert("File uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <>
      <button onClick={handleClick} className="upload-btn">
        Upload File
      </button>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
}
