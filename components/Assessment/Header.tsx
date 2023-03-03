import React, { useContext } from "react";
import logo from "assets/img/AlphaPlusLogo.png";
import CircleLogo from "assets/img/alphaplus-circle-logo.png";
import cookie from "js-cookie";
import { QuestionnaireContext } from './QuestionnaireContext'
import { ReactComponent as Star } from "./../../assets/img/star.svg";
import { useParams } from "react-router-dom";

const Header: React.FC<any> = () => {
    const { assessmentType } = useParams();
    const { questions, questionIdx, onChangeQuestionFromTopBar } = useContext(QuestionnaireContext);

    const fullName: string = `${cookie.get("first_name")} ${cookie.get(
        "last_name"
    )}`;

    let i=0;
    let res=[];

    while(i<questions.length){
        res.push(questions.slice(i, i+25));
        i+=25;
    }

    const initials = (fullName as any).match(/\b(\w)/g).join("");
    const class_name = cookie.get("class_name") || '';

    return (
        <div className="cmsHeader header__navbar">
            <div className="pg-container">
                <div className={`cmsHeader-wrapper ${assessmentType === 'formatives' ? 'formative' :''}`}>

                    <div className={`cmsHeader__logo ${assessmentType === 'formatives' ? 'formative' :''}`}>
                        <div className="cmsHeader__logo-link">
                            <img src={logo} alt="Logo" className="cmsHeader__logo-img" />
                            <img src={CircleLogo} alt="logo" className="cmsHeader__logo-sm" />
                        </div>
                    </div>

                    <div className={`cmsHeader__numbers page-numbers ${assessmentType === 'formatives' ? 'formative' :''}`}>
                        <div className="cmsHeader__numbers-wrapper">
                            {res.map((num, index: number) => {     
                                return(
                                    num.map((_number:any, idx: number) => {
                                        const Qnumber = idx + (index * 25)

                                        return (                
                                            <div key={idx} className={`
                                                    cmsHeader__numbers-number 
                                                    ${assessmentType === 'formatives' ? 'cmsHeader__numbers-formative-size' : 'cmsHeader__numbers-summative-size' } 
                                                    ${questionIdx === Qnumber && 'selected' } 
                                                    ${questions[Qnumber]?.answer !== null && 'unsaved' }
                                                    ${questions[Qnumber]?.bookMarked && 'bookmark' }
                                            `}>
                                                <button value={Qnumber+1} type="button" onClick={() => {
                                                        onChangeQuestionFromTopBar(Qnumber);
                                                    }} className="cmsHeader__numbers-btn tabBtn">
                                                        { Qnumber+1 }
                                                    <Star />
                                                </button>
                                            </div>
                                        );
                                    })
                                );
                            })
                            }
                        </div>
                    </div>

                    <div className={`cmsHeader__user dropdown ${assessmentType === 'formatives' ? 'formative' :''}`}>
                        <div className="cmsHeader__user-wrapper">
                            <span className="cmsHeader__user-box">{initials}</span>
                            <div className="cmsHeader__user-info">
                                <p className="cmsHeader__user-name">{fullName}</p>
                                <p className={`cmsHeader__user-detail ${class_name.length > 23 ? 'ellipsis ellipsis-animation' : ''}`}>{class_name}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Header;
