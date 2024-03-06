import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { NotFound } from "./pages/notFound";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Signup } from "./pages/signup";
import { Profile } from "./pages/profile";
// import { GiftList } from "./pages/giftList";
import { GiftList } from "./pages/giftList";
import { SideBar } from "./component/sidebar";
// import { GiftListEdit } from "./pages/giftListEdit";
// import { Private } from "./pages/private";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;
    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <div className="row">
                        <div className="col-sm-3 bg-light">
                            <SideBar />
                        </div>
                        <div className="col-sm-9 p-5">
                            <Routes>
                                <Route element={<Home />} path="/" />
                                <Route element={<Login />} path="/login" />
                                <Route element={<Signup />} path="/signup" />
                                <Route element={<Profile />} path="/profile/:uid" />
                                <Route element={<GiftList />} path="/giftlist/:uid" />
                                <Route element={<GiftList />} path="/giftlist/:uid/disponible" />
                                <Route element={<GiftList />} path="/giftlist/:uid/comprados" />
                                <Route element={<NotFound />} path="*" />
                            </Routes>
                        </div>
                    </div>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);