import { FC } from "react";

const Footer: FC = () => {

    return (
        <footer className="cmsFooter">
            <div className="pg-container">
                <div className="cmsFooter-wrapper">
                    <div className="cmsFooter__edit">
                    </div>
                    <div className="cmsFooter__buttons">
                        <div className="cmsFooter__buttons-wrapper">
                            <button disabled className="btn orange-btn light btn-medium">Revert</button>
                            <button disabled className="btn cancel-btn btn-medium">Back</button>
                            <button disabled className="btn cancel-btn btn-medium">Next</button>
                            <button disabled className="btn success-btn btn-medium">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
