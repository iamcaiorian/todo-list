import { Link } from "react-router-dom";

import logo from "../assets/logo-app.svg";

export function AppHeader() {
  return (
    <header className="flex items-center justify-center py-10 mt-20">
      <Link to="/">
        <img src={logo} alt="Logo" className="h-20" />
      </Link>
    </header>
  );
}

export default AppHeader;
