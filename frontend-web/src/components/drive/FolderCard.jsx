function FolderCard({ folder }) {
  return (
    <div className="folder-card">
      <div className="folder-icon">📁</div>

      <p>{folder.name}</p>
    </div>
  );
}

export default FolderCard;