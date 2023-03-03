/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useEffect, useRef, useState } from "react";
import { ReactComponent as PlayIcon } from "assets/img/play-icon.svg";
import { ReactComponent as SpeechIcon } from "assets/img/speech-icon.svg";
import { ReactComponent as FilterIcon } from "assets/img/filter-icon.svg";
import { ReactComponent as FilterIconBlack } from "assets/img/filter-icon-black.svg";
import { ReactComponent as NextIcon } from "assets/img/next-icon.svg";
import { ReactComponent as Stop } from "assets/img/pause-icon.svg";
import speakText from './TextToSpeech';
import { QuestionnaireContext } from "./QuestionnaireContext";

const SpeechControls: FC = () => {
    const [showSettings, setShowSettings] = useState(false);
    const [selectBtnActive, setSelectBtnActive] = useState(false);
    const [filterBtnActive, setFilterBtnActive] = useState(false);
    const [audioSpeed, setAudioSpeed] = useState('normal');
    const [volume, setVolume] = useState(0.5);

    const {
        setIsSpeechIconClicked,
        isSpeechIconClicked,
        currentQuestion,
        keys,
        keyToSpeak,
        setKeyToSpeak
    } = useContext(QuestionnaireContext);

    const audioRef = useRef<any>();
    const sourceRef = useRef<any>();

    const getRate = () => {
        switch (audioSpeed) {
            case 'slow':
                return 0.5
            case 'normal':
                return 1
            case 'fast':
                return 1.5
        }
    }

    const nextKeyToSpeak = () => {
        const currentKeyIndex = keys.findIndex((key: typeof keyToSpeak) => key === keyToSpeak)

        currentKeyIndex !== -1 && setKeyToSpeak(keys[currentKeyIndex + 1]);
        setShowSettings(false);
        setFilterBtnActive(false);
    }

    const onStop = () => {
        audioRef.current?.pause();
        setKeyToSpeak(null!)
    }

    const speakHandler = async (text: string) => {
        const res = await speakText(text);

        if (res) {
            sourceRef.current.src = res;

            audioRef.current.load();
            audioRef.current.play();
            audioRef.current.playbackRate = getRate()
            audioRef.current.onended = () => {

                nextKeyToSpeak();
            }
        }
    }

    useEffect(() => {
        if (!keyToSpeak) {
            return
        }

        const text = currentQuestion[keyToSpeak as keyof typeof currentQuestion]

        if (!text) {
            return nextKeyToSpeak();
        }

        speakHandler(text.toString())
    }, [keyToSpeak])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = getRate()
        }

    }, [audioSpeed])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
        }

    }, [volume])

    return (
        <div className="mainContent__question-content-right">
            <p className="mainContent__question-paragraph2">
                <span className="d-xl-block d-none">Text to Speech</span>
                <span className="d-block d-xl-none">TTS</span>
            </p>
 
            <button type="button" className={`speech-btn light ${selectBtnActive ? 'dark-bg' : ''}`} onClick={() => {
                setIsSpeechIconClicked(!isSpeechIconClicked);
                setSelectBtnActive(!selectBtnActive);
                setFilterBtnActive(false);
                }}>
                <SpeechIcon />
            </button>

            { !keyToSpeak ?
                <button type="button" className="speech-btn" onClick={() => {
                    setKeyToSpeak('passage_directions');
                    setFilterBtnActive(false);
                    }}>
                    <PlayIcon />
                </button>
            :
                <button type="button" className="speech-btn light" onClick={() => {
                    onStop();
                }} >
                    <Stop />
                </button>
            }

            <button 
                type="button" 
                className="speech-btn" 
                disabled={!keyToSpeak}
                onClick={() => {
                    nextKeyToSpeak();
                }}
            >
                <NextIcon />
            </button>
            
            <button type="button" className={`speech-btn me-0 ${filterBtnActive ? 'dark-bg filter-btn' : ''}`} onClick={()=> {
                setShowSettings(!showSettings);
                setFilterBtnActive(!filterBtnActive);
                }}>
                {filterBtnActive ? <FilterIconBlack /> : <FilterIcon /> }
            </button>
            

            <audio hidden ref={audioRef} key="audioSrc" id="audioPlayback" controls>
                <source ref={sourceRef} id="audioSource" type="audio/mp3" src="" />
            </audio>

            <div className={`settings-panel ${showSettings && 'volumeEnabled'}`}>
                <div className="volume-section">
                    <p>Volume:</p>
                    <div className="volume-range">
                        <p>{(volume * 100).toFixed(0)}%</p>
                        <input
                            type="range"
                            onChange={(event) => setVolume(+event.target.value)}
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                        />
                    </div>
                </div>
                <div className="speed-section">
                    <p>Speed:</p>
                    <div className="speed-buttons">
                        <button type="button" onClick={() => setAudioSpeed('slow')} className={audioSpeed === 'slow' ? 'active' : ''} >Slow</button>
                        <button type="button" onClick={() => setAudioSpeed('normal')} className={audioSpeed === 'normal' ? 'active' : ''}>Normal</button>
                        <button type="button" onClick={() => setAudioSpeed('fast')} className={audioSpeed === 'fast' ? 'active' : ''}>Fast</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default SpeechControls;