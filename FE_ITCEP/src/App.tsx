
import { RouterProvider } from "react-router";
import { router } from "./routes";
import "./App.css";
import BackgroundMusic from "./components/BackgroundMusic/BackgroundMusic";


function App() {
  return (
    <>
      <BackgroundMusic />
      <RouterProvider router={router} />
    </>
  );
}

export default App;