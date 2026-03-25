import { RouterProvider } from "react-router";
import { router } from "./routers";
import "./App.css";

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
