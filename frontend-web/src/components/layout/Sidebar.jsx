import { Link } from "react-router-dom"

function Sidebar(){

return(

<div className="sidebar">

<h2>DriveX</h2>

<nav>

<Link to="/dashboard">Dashboard</Link>
<Link to="/files">My Files</Link>
<Link to="/activity">Activity</Link>
<Link to="/settings">Settings</Link>

</nav>

</div>

)

}

export default Sidebar