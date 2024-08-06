import "./App.css";
import DefaultLayout from "./components/Layouts/DefaultLayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes/route";
import {  memo } from "react"; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path={publicRoutes[0].path} element={<DefaultLayout/>}>
            {
              publicRoutes.map((route, index) => {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.component}
                  />
                );
              })
            }
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
export default memo(App);
