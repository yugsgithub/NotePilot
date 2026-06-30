import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider }
from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";
import { DocumentsProvider } from "./context/DocumentsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
 <React.StrictMode>

<ThemeProvider>
  <DocumentsProvider>
    <App />
  </DocumentsProvider>
</ThemeProvider>

</React.StrictMode>
)


