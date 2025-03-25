import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="p-4 pt-20">
      <h1>Main Layout</h1>
      <Outlet />
    </div>
  )
}