import { createBrowserRouter, Navigate } from "react-router";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AppShell from "./components/AppShell";
import AskLawWise from "./pages/AskLawWise";
import DocumentAnalysis from "./pages/DocumentAnalysis";
import FindHelp from "./pages/FindHelp";
import MyTimeline from "./pages/MyTimeline";
import Emergency from "./pages/Emergency";
import Settings from "./pages/Setting";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/app",
    Component: AppShell,
    children: [
      { index: true, Component: AskLawWise },
      { path: "documents", Component: DocumentAnalysis },
      { path: "find-help", Component: FindHelp },
      { path: "timeline", Component: MyTimeline },
      { path: "emergency", Component: Emergency },
      { path: "settings", Component: Settings },
    ],
  },
]);
