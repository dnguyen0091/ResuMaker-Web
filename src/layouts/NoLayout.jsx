import { Outlet } from 'react-router-dom';

export default function NoLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
