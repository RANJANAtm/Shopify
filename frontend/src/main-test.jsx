import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TestApp from "./TestApp.jsx";
// import App from "./App.jsx";
// import "./index.css";
// import ErrorBoundary from "./components/ErrorBoundary.jsx";
// import { BrowserRouter } from "react-router-dom";

// Simple test setup - once this works, we'll switch back to full app
createRoot(document.getElementById("root")).render(
	<StrictMode>
		<TestApp />
	</StrictMode>
);

// Full app setup (commented out for testing)
/*
createRoot(document.getElementById("root")).render(
	<StrictMode>
		<ErrorBoundary>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</ErrorBoundary>
	</StrictMode>
);
*/
