import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

import { Outlet } from "react-router";
import { CustomHeader } from "../components/CustomHeader";

const ParkingLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <CustomHeader />
          <main className="flex-1 overflow-y-auto p-2">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ParkingLayout;
