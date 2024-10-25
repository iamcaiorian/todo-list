import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";

function AppLayout() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-50">
      <AppHeader />
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
