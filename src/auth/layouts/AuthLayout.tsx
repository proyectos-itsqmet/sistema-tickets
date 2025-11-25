import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="bg-muted min-h-screen">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
