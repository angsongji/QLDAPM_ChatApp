import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import router from "./routes";
import { Toaster } from "react-hot-toast";
import LoadingPageSkeleton from "./components/LoadingPageSkeleton";
function App() {
  return (
    <>
      <Suspense
        fallback={
          <div className="w-full h-screen">
            <LoadingPageSkeleton />
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
