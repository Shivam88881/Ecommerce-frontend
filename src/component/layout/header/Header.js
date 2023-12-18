import React from "react";
import { ReactNavbar } from "overlay-navbar";
import logo from "../../../images/logo.png";
import { CgProfile, CgSearch } from "react-icons/cg";
import { BsCart } from "react-icons/bs";

const options = {
    burgerColorHover: "#eb4034",
    logo: logo,
    logoWidth: "12vmax",
    navColor1: "white",
    logoHoverSize: "10px",
    logoHoverColor: "#eb4034",
    link1Text: "Home",
    link2Text: "Products",
    link3Text: "Contact",
    link4Text: "About",
    link1Url: "/",
    link2Url: "/products",
    link3Url: "/contact",
    link4Url: "/about",
    link1Size: "1.3vmax",
    link1Color: "rgba(35, 35, 35,0.8)",
    nav1justifyContent: "flex-end",
    nav2justifyContent: "flex-end",
    nav3justifyContent: "flex-start",
    nav4justifyContent: "flex-start",
    link1ColorHover: "#eb4034",
    link1Margin: "1vmax",
    profileIcon: true,
    ProfileIconElement: CgProfile,
    profileIconUrl: "/user/account",
    profileIconColor: "rgba(35, 35, 35,0.8)",
    searchIcon: true,
    SearchIconElement: CgSearch,
    searchIconColor: "rgba(35, 35, 35,0.8)",
    cartIcon: true,
    CartIconElement: BsCart,
    cartIconColor: "rgba(35, 35, 35,0.8)",
    profileIconColorHover: "#eb4034",
    searchIconColorHover: "#eb4034",
    cartIconColorHover: "#eb4034",
    cartIconMargin: "1vmax",
};

const Header = () => {
    return <ReactNavbar {...options} />;
};

export default Header;
