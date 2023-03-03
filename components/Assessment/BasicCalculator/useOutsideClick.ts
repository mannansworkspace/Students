import { useEffect, useContext } from "react";
import { QuestionnaireContext } from '../QuestionnaireContext';




export const useOutSideClick = (ref:any) => {

    const {
        showCalculator,
        setShowCalculator
    } = useContext(QuestionnaireContext);

    

    useEffect(() => {

        const handleClickOutside = (event:any) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setShowCalculator(false);
            }
        };

        showCalculator && document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [showCalculator, ref, setShowCalculator]);
}