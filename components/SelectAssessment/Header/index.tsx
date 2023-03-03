import React from "react";
import logo from "assets/img/AlphaPlusLogo.png";
import Cookie from "js-cookie";

const Header: React.FC<{}> = () => {

    const fullName: string = `${Cookie.get("first_name")} ${Cookie.get(
        "last_name"
    )}`;

    const initials = (fullName as any).match(/\b(\w)/g).join("");
    const class_name = Cookie.get("class_name") || '';

    return (
        <div className="cmsHeader">
            <div className="pg-container">
                <div className="cmsHeader-wrapper">
                    <div className="cmsHeader__logo">
                        <a href="#/" className="cmsHeader__logo-link">
                          <img src={logo} alt="Logo" className="cmsHeader__logo-img"/>
                        </a>
                    </div>

                    <div className="cmsHeader__user dropdown">
                        <a
                            href="#/"
                            className="cmsHeader__user-wrapper"
                        >
                            <span className="cmsHeader__user-box">{initials}</span>

                            <div className="cmsHeader__user-info">
                                <p className="cmsHeader__user-name">{fullName}</p>
                                <p className="cmsHeader__user-detail">{class_name}</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
