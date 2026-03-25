import { RouterProvider } from "react-router";
import { router } from "./routers";
import "./App.css";

export default function App() {
  return <RouterProvider router={router} />;
}
