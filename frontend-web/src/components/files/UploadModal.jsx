import { useState } from "react";
import { uploadFile } from "../../services/fileService";

function UploadModal({ close, refresh }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    await uploadFile(file);

    refresh(); // refresh file list
    close();
  };

  return (
    <div className="upload-modal">
      <h3>Upload File</h3>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button onClick={handleUpload}>Upload</button>

      <button onClick={close}>Cancel</button>
    </div>
  );
}

export default UploadModal;
