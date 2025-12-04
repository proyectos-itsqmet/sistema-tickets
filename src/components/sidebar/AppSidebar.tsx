import {
  CircleParking,
  UsersRound,
  LayoutDashboard,
  // ChevronDown,
  // UserPlus,
  CircleDollarSign,
  Car,
  LogOut,
  ChevronsUpDown,
  ChartLine,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // SidebarMenuSub,
  // SidebarMenuSubButton,
  // SidebarMenuSubItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { ChangePasswordModal } from "./ChangePasswordModal";

const items = [
  {
    title: "Parqueadero",
    url: "/",
    icon: CircleParking,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Usuarios",
    url: "/users",
    icon: UsersRound,
    // subitems: [
    //   {
    //     title: "Registro",
    //     url: "/register",
    //     icon: UserPlus,
    //   },
    // ],
  },
  {
    title: "Tarifas",
    url: "/rates",
    icon: CircleDollarSign,
  },
  {
    title: "Reportes",
    url: "/reports",
    icon: ChartLine,
  },
];

export function AppSidebar() {
  const { setOpenMobile } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  //! Obtener iniciales del usuario
  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(
      0
    )}`.toUpperCase();
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Car className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Devcraft</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Parking</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(
                (item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url} onClick={handleLinkClick}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
                // item.subitems ? (
                //   <Collapsible
                //     key={item.title}
                //     defaultOpen
                //     className="group/collapsible"
                //   >
                //     <SidebarMenuItem>
                //       <CollapsibleTrigger asChild>
                //         <SidebarMenuButton>
                //           <item.icon />
                //           <span>{item.title}</span>
                //           <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                //         </SidebarMenuButton>
                //       </CollapsibleTrigger>
                //       <CollapsibleContent>
                //         <SidebarMenuSub>
                //           {item.subitems.map((subitem) => (
                //             <SidebarMenuSubItem key={subitem.title}>
                //               <SidebarMenuSubButton asChild>
                //                 <Link
                //                   to={subitem.url}
                //                   onClick={handleLinkClick}
                //                 >
                //                   <subitem.icon />
                //                   <span>{subitem.title}</span>
                //                 </Link>
                //               </SidebarMenuSubButton>
                //             </SidebarMenuSubItem>
                //           ))}
                //         </SidebarMenuSub>
                //       </CollapsibleContent>
                //     </SidebarMenuItem>
                //   </Collapsible>
                // ) : (
                //   <SidebarMenuItem key={item.title}>
                //     <SidebarMenuButton asChild>
                //       <Link to={item.url} onClick={handleLinkClick}>
                //         <item.icon />
                //         <span>{item.title}</span>
                //       </Link>
                //     </SidebarMenuButton>
                //   </SidebarMenuItem>
                // )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-emerald-500 text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-emerald-500 text-white">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowPasswordModal(true)}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowLogoutModal(true)}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Modal de confirmación de cierre de sesión */}
            <AlertDialog
              open={showLogoutModal}
              onOpenChange={setShowLogoutModal}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <LogOut className="h-5 w-5 text-red-500" />
                    Cerrar sesión
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Estás seguro que deseas cerrar sesión? Tendrás que volver a
                    iniciar sesión para acceder al sistema.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-400 cursor-pointer"
                  >
                    Cerrar sesión
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Modal de cambio de contraseña */}
            <ChangePasswordModal
              open={showPasswordModal}
              onOpenChange={setShowPasswordModal}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
