import { RouterProvider } from "react-router";
import { router } from "./routes";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Footer />
    </>
  );
}

export default App;