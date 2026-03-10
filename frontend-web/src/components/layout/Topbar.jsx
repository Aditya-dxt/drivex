import { useState } from "react";
import UploadModal from "../files/UploadModal";

function Topbar({ refresh }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="topbar">
      <input type="text" placeholder="Search files..." className="search" />

      <button className="upload" onClick={() => setOpen(true)}>
        Upload
      </button>

      {open && <UploadModal close={() => setOpen(false)} refresh={refresh} />}
    </div>
  );
}

export default Topbar;
