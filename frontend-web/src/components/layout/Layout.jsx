import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../../styles/layout.css"
import "../../styles/sidebar.css"
import "../../styles/files.css"

function Layout({ children, refresh }) {
  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Topbar refresh={refresh} />

        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
