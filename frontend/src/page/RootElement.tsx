import { NavLink, Outlet } from 'react-router-dom';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
function Layout() {
    console.log(" layout")
  return (
    <div>
      <ResponsiveAppBar />
      <Outlet />
    </div>
  );
}

export default Layout;
