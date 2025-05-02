import React from "react";
import { createRoot } from "react-dom/client"; // React 18+ method to create a root for rendering.
import { RouterProvider } from "react-router-dom"; // Provides routing capabilities to the app.
import "./index.css"; // Global styles.
import { router } from "./Routes/Routes"; // App route definitions.
import AuthProvider from "./Providers/AuthProvider"; // Provides authentication context.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // React Query for server state management.
import { Toaster } from "react-hot-toast"; // For displaying toast notifications.

const queryClient = new QueryClient(); // Initialize a React Query client instance.

createRoot(document.getElementById("root")).render(
  <div className="max-w-screen-2xl mx-auto bg-gray-50">
    {/* Provides React Query context to the entire app */}
    <QueryClientProvider client={queryClient}>
      {/* Toast notifications (top center) with custom duration */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
      {/* Auth context provider for managing user authentication */}
      <AuthProvider>
        {/* Provides routing throughout the app */}
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </div>
);
