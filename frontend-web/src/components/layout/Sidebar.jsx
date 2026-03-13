import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>DriveX</h2>

      <nav>
        <Link to="/">My Drive</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/trash">Trash</Link>
      </nav>
    </div>
  );
}

export default Sidebar;