import FileCard from "./FileCard";

function FileGrid({ files }) {
  return (
    <div className="file-grid">
      {files.map((file) => (
        <FileCard key={file._id} file={file} />
      ))}
    </div>
  );
}

export default FileGrid;
