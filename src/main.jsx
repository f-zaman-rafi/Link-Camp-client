import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./Routes/Routes";
import AuthProvider from "./Providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <div className="max-w-screen-2xl mx-auto bg-gray-50">
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" reverseOrder={false} toastOptions={{
        duration: 2000
      }} />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </div>
);
