
import { RouterProvider } from "react-router";
import { router } from "./routes";
import "./App.css";
import { AIProvider } from "./contexts/AIContext";
function App() {
  return (
    <AIProvider>
      <RouterProvider router={router} />
    </AIProvider>
  );
}

export default App;