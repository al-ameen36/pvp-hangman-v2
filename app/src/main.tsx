import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Loader from "./components/loader/loader.tsx";
import { Provider } from "react-redux";
import { HashRouter, Route, Routes } from "react-router";
import LandingPage from "./pages/landing/landing.tsx";
import { store } from "./store/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<Loader />}>
      <Provider store={store}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<LandingPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </Provider>
    </Suspense>
  </StrictMode>
);
