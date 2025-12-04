import { createBrowserRouter, Navigate } from "react-router";
import { LoginPage } from "./auth/pages/login/LoginPage";
import { DashboardPage } from "./parking/pages/dashboard/DashboardPage";
import { RatesPage } from "./parking/pages/rates/RatesPage";
import { HomePage } from "./parking/pages/home/HomePage";
import { lazy } from "react";
import { UsersPage } from "./parking/pages/users/UsersPage";
import { ReportsPage } from "./parking/pages/reports/ReportsPage";
// import ParkingLayout from "./parking/layouts/ParkingLayout";

//? >>> Se carga de forma perezosa, solo cuando el usuario entra a una ruta de /auth
// const AuthLayout = lazy(() => import("./parking/layouts/ParkingLayout"));
const AuthLayout = lazy(() => import("./auth/layouts/AuthLayout"));
const ParkingLayout = lazy(() => import("./parking/layouts/ParkingLayout"));
//? <<<

export const appRouter = createBrowserRouter([
  //! Auth Routes
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      //? >>> Si alguien intenta entrar al /auth redirecciona al login
      {
        index: true,
        element: <Navigate to="/auth/login" />,
      },
      //? <<<
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },

  //! Main Routes
  {
    path: "/",
    element: <ParkingLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "rates",
        element: <RatesPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
    ],
  },

  //? >>> Si la ruta no esta definida redirecciona al Auth
  //TODO: Cambiar a /parking cuando este el sistema de autenticacion
  {
    path: "*",
    element: <Navigate to="/" />,
  },
  //? <<<
]);
