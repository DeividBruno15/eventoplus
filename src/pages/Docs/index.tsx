
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load documentation pages for better performance
const DocsHome = lazy(() => import("./DocsHome"));
const GettingStarted = lazy(() => import("./GettingStarted"));

// Loading placeholder for documentation pages
const DocsPageLoading = () => (
  <div className="p-6 space-y-4">
    <Skeleton className="h-8 w-[250px] mb-6" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      <Skeleton className="h-[150px] rounded-md" />
      <Skeleton className="h-[150px] rounded-md" />
      <Skeleton className="h-[150px] rounded-md" />
    </div>
  </div>
);

export const Documentation = () => {
  return (
    <Suspense fallback={<DocsPageLoading />}>
      <Routes>
        <Route path="/" element={<DocsHome />} />
        <Route path="/getting-started" element={<GettingStarted />} />
        {/* Add additional doc routes as needed */}
        <Route path="*" element={<Navigate to="/docs" replace />} />
      </Routes>
    </Suspense>
  );
};

export default Documentation;
