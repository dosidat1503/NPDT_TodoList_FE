import paths from "./path";
import Home from "../pages/Home/Home";
import SaveTask from "../pages/SaveTask/SaveTask";
import Login from "../pages/Login/Login";

import DefaultLayout from "../components/Layouts/DefaultLayout";
import AuthenticationLayout from "../components/Layouts/AuthenticationLayout";

const publicRoutes = [
  { path: paths.home, component: Home, layout: DefaultLayout },
  { path: paths.add, component: SaveTask, layout: DefaultLayout },
  { path: paths.update, component: SaveTask, layout: DefaultLayout },
  { path: paths.login, component: Login, layout: AuthenticationLayout },
];

export { publicRoutes };
