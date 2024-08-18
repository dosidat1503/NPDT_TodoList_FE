import "./App.css";
import DefaultLayout from "./components/Layouts/DefaultLayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes/route";
import { Fragment, memo, FC, ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const App: FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            let Layout: FC<LayoutProps> = route.layout;

            const Page = route.component;

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
};

export default memo(App);
