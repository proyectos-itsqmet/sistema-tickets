import { RouterProvider } from "react-router";
import { appRouter } from "./app.router";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={appRouter} />
      <Toaster position="bottom-right" />
    </AuthProvider>
  );
}

export default App;
