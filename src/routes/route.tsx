import paths from "./path";
import Home from "../pages/Home/home";
import AddOrUpdateTask from "../pages/AddOrUpdateTask/AddOrUpdateTask";
import DefaultLayout from "../components/Layouts/DefaultLayout";

const publicRoutes = [
  { path: paths.home, component: <Home/>, layout: DefaultLayout },
  { path: paths.add, component: <AddOrUpdateTask/>, layout: DefaultLayout },
  { path: paths.update, component: <AddOrUpdateTask/>, layout: DefaultLayout },
];

export { publicRoutes };
