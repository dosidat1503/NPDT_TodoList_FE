import paths from "./path";
import Home from "../pages/Home/home";
import DefaultLayout from "../components/Layouts/DefaultLayout";

const publicRoutes = [ 
    {path: paths.home, component: Home, layout: DefaultLayout},
];
 
export { publicRoutes };

