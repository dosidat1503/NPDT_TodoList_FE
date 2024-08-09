import Sidebar from "./Sidebar/sidebar";
import { Outlet } from "react-router-dom";

function DefaultLayout() {
  return (
    <div className="">
      <div className="grid md:grid-cols-5 rounded-lg ">
        <Sidebar />
        <main className="bg-sky-200 md:col-span-4 p-10 h-screen">
          <h1 className="text-3xl font-bold  "> TASK </h1>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DefaultLayout;
