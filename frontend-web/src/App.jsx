import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import Dashboard from "./pages/Dashboard"
import Files from "./pages/Files"
import Activity from "./pages/Activity"
{/*import Settings from "./pages/Settings"*/}

function App() {

return (

<BrowserRouter>

<Routes>

<Route path="/" element={<Login/>} />
<Route path="/register" element={<Register/>} />

<Route path="/dashboard" element={<Dashboard/>} />
<Route path="/files" element={<Files/>} />
<Route path="/activity" element={<Activity/>} />
{/*<Route path="/settings" element={<Settings/>} />*/}

</Routes>

</BrowserRouter>

)

}

export default App