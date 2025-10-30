import { Outlet } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer"


const MainLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow-1" style={{ marginTop: "0" }}>
        <Outlet />
      </main>

      <Footer/>

     
    </div>
  );
};

export default MainLayout;
