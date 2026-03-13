function FileCard({ file }) {
  return (
    <div className="file-card">
      <div className="file-icon">📄</div>

      <p className="file-name">{file.name}</p>
    </div>
  );
}

export default FileCard;