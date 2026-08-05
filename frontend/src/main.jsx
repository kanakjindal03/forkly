import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./storagePolyfill.js";
import RootSwitcher from "./RootSwitcher.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RootSwitcher />
  </StrictMode>
);
