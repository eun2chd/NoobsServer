import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import Mainpage from "./page/MainPage";
import ProfilePage from "./page/ProfilePage";

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/main", element: <Mainpage /> },
  { path: "/ProfilePage", element: <ProfilePage /> },
]);

export default router;
