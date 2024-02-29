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
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Signup />} path="/signup" />
                        {/* <Route element={<Private />} path="/private" /> */}
                        <Route element={<Profile />} path="/profile" />
                        {/* <Route element={<GiftList />} path="/giftlist/:uid" /> */}
                        {/* <Route element={<GiftListEdit />} path="/giftlist/new-gift" /> */}
                        {/* <Route element={<GiftListEdit isEditing />} path="/giftlist/:uid/edit/:gid" /> */}
                        <Route element={<NotFound />} path="*" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
