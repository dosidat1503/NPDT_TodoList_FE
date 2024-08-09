import paths from "./path";
import Home from "../pages/Home/Home";
import SaveTask from "../pages/SaveTask/SaveTask";
import DefaultLayout from "../components/Layouts/DefaultLayout";

const publicRoutes = [
  { path: paths.home, component: <Home />, layout: DefaultLayout },
  { path: paths.add, component: <SaveTask />, layout: DefaultLayout },
  { path: paths.update, component: <SaveTask />, layout: DefaultLayout },
];

export { publicRoutes };
