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
import { RenderGifts } from "./component/renderGifts";
import { RenderGiftsAvailable } from "./component/renderGiftsAvailable";
import { RenderGiftsPurchased } from "./component/renderGiftsPurchased";
import { GiftForm } from "./component/giftForm";
import { GiftFormGuest } from "./component/giftFormGuest";
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
                        {/* TODO:AGREGAR A LA URL DE GIFTLIST EL :LID Y EL GIFTS */}
                        <Route element={<GiftList />} path="/user/:uid/giftlist/:lid" >
                            <Route element={<RenderGifts />} path="allGifts" />
                            <Route element={<RenderGiftsAvailable />} path="availableGifts" />
                            <Route element={<RenderGiftsPurchased />} path="purchasedGifts" />
                            <Route element={<GiftForm isEditing />} path="gifts/:gid/edit" />
                            <Route element={<GiftForm />} path="new-gift" />

                        </Route>
                        <Route element={<GiftList />} path="/guest/:uid/giftlist/:lid" >
                            <Route element={<RenderGifts />} path="gifts" />
                            <Route element={<RenderGiftsAvailable />} path="availableGifts" />
                            <Route element={<RenderGiftsPurchased />} path="purchasedGifts" />
                            <Route element={<GiftFormGuest isEditing />} path="gifts/:gid/edit" />
                        </Route>
                        <Route element={<Profile />} path="/user/:uid/profile" />
                        <Route element={<NotFound />} path="*" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);