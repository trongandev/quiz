"use client";
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI";
import React, { useEffect, useState, useCallback } from "react";
import { Spin, message } from "antd";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
const FEATURES = {
    FLASHCARD: 1,
    QUIZ: 2,
};

export default function TaiLieuFlashcard({ params }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [index, setIndex] = useState(0);
    const [feature, setFeature] = useState(FEATURES.FLASHCARD);
    const [flashcards, setFlashcards] = useState([]);
    const [progress, setProgress] = useState({ known: [], unknown: [] });
    const [quizOptions, setQuizOptions] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    // random moder
    const [selectedAnswers, setSelectedAnswers] = useState({});

    const shuffle = (array) => {
        let currentIndex = array.length,
            randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    };
    // Fetch flashcards data

    useEffect(() => {
        const fetchFlashCards = async () => {
            // const req = await GET_API(`/flashcards/${params?.slug}`, token);
            const req = await GET_API_WITHOUT_COOKIE(`/admin/suboutline/${params.id}`);
            const result = req?.quest?.data_so;

            setFlashcards(shuffle(result));
            generateQuizOptions(result[0]);
        };
        fetchFlashCards();
    }, [params?.slug]);

    useEffect(() => {
        if (flashcards.length > 0) {
            generateQuizOptions(flashcards[0]);
        }
    }, [flashcards]);

    const generateQuizOptions = useCallback(
        (currentCard) => {
            if (!currentCard || flashcards.length < 4) return;

            // Đáp án đúng
            const correctOption = currentCard.answer;

            // Các đáp án sai
            const availableCards = flashcards.filter((card) => card.answer !== currentCard.answer);
            const wrongOptions = [];
            while (wrongOptions.length < 3 && availableCards.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableCards.length);
                wrongOptions.push(availableCards[randomIndex].answer);
                availableCards.splice(randomIndex, 1);
            }

            // Trộn đáp án đúng và đáp án sai
            const options = [correctOption, ...wrongOptions];
            setQuizOptions(options.sort(() => Math.random() - 0.5));
        },
        [flashcards]
    );

    // Navigation handlers
    const handleChangeIndex = useCallback(
        async (type) => {
            let newIndex;
            newIndex = type === "next" ? (index < flashcards.length - 1 ? index + 1 : 0) : index > 0 ? index - 1 : flashcards.length - 1;

            setIndex(newIndex);
            setIsFlipped(false);

            generateQuizOptions(flashcards[newIndex]);
        },
        [index, flashcards, feature]
    );

    // Progress tracking
    const handleProgress = useCallback(
        (type) => {
            const currentId = flashcards[index].answer;
            if (type === "known") {
                setProgress((prev) => ({
                    ...prev,
                    known: [...new Set([...prev.known, currentId])],
                    unknown: prev.unknown.filter((id) => id !== currentId),
                }));
                handleChangeIndex("next");
            } else {
                setProgress((prev) => ({
                    ...prev,
                    unknown: [...new Set([...prev.unknown, currentId])],
                    known: prev.known.filter((id) => id !== currentId),
                }));
                handleChangeIndex("prev");
            }
        },
        [index, flashcards]
    );

    const handlePlayAudio = (method) => {
        if (method == "correct") {
            const audio = new Audio("/audio/correct.mp3");
            audio.play();
        } else if (method == "wrong") {
            const audio = new Audio("/audio/wrong.mp3");
            audio.play();
        }
    };

    // Quiz answer handler
    const handleQuizAnswer = async (selectedAnswer, idx) => {
        const isCorrect = selectedAnswer === flashcards[index].answer;
        messageApi[isCorrect ? "success" : "error"](isCorrect ? "Chính xác, giỏi quá" : "Sai rồi, thử lại nhé! ^^");
        setSelectedAnswers({
            ...selectedAnswers,
            [idx]: isCorrect ? "correct" : "incorrect",
        });
        if (isCorrect) {
            handlePlayAudio("correct");

            setTimeout(() => {
                handleProgress("known");
                setSelectedAnswers({});
            }, 1000);
        } else {
            handlePlayAudio("wrong");

            setTimeout(() => {
                setSelectedAnswers((prev) => ({
                    ...prev,
                    [idx]: null,
                }));
            }, 820);
        }
    };

    // Keyboard navigation
    const handleKeyDown = useCallback(
        (e) => {
            switch (e.key.toLowerCase()) {
                case "arrowleft":
                    handleChangeIndex("prev");
                    break;
                case "arrowright":
                    handleChangeIndex("next");
                    break;
                case " ":
                    e.preventDefault();
                    if (feature === FEATURES.FLASHCARD) {
                        setIsFlipped((prev) => !prev);
                    }
                    break;
            }
        },
        [feature, handleChangeIndex, handleProgress]
    );

    if (!flashcards.length) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="px-3 md:px-0 focus-visible:outline-none min-h-screen" onKeyDown={handleKeyDown} tabIndex={0}>
            {contextHolder}
            <div className="w-full flex items-center justify-center h-[90%] flex-col gap-5">
                <div className="w-full flex flex-col md:flex-row gap-5 items-start">
                    <div className="w-full flex flex-col gap-5">
                        {/* Main Flashcard Container */}
                        <div
                            className=" relative w-full h-[500px] border border-white/10 rounded-lg  shadow-md bg-white dark:bg-slate-800/50 dark:text-white"
                            style={{ perspective: "1000px" }}
                            onClick={feature === FEATURES.FLASHCARD ? () => setIsFlipped(!isFlipped) : undefined}>
                            {/* Flashcard Feature */}
                            {feature === FEATURES.FLASHCARD && (
                                <div
                                    className={`rounded-lg  cursor-pointer absolute inset-0 w-full h-full transition-transform duration-500 transform ${isFlipped ? "rotate-y-180" : ""}`}
                                    style={{ transformStyle: "preserve-3d" }}>
                                    {/* Front Side */}
                                    <div
                                        className="rounded-lg  absolute inset-0 bg-white dark:bg-slate-800/50 flex flex-col items-center justify-center backface-hidden p-5"
                                        style={{ backfaceVisibility: "hidden" }}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <p className="text-2xl font-semibold">{flashcards[index]?.question}</p>
                                        </div>

                                        <p className="text-gray-500 text-sm">(Click to flip)</p>
                                    </div>

                                    {/* Back Side */}
                                    <div
                                        className="rounded-lg  absolute inset-0 bg-white dark:bg-slate-800/50 flex flex-col items-center justify-center p-5 backface-hidden"
                                        style={{
                                            backfaceVisibility: "hidden",
                                            transform: "rotateY(180deg)",
                                        }}>
                                        {isFlipped && <p className="text-lg ">{flashcards[index]?.answer}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Quiz Feature */}
                            {feature === FEATURES.QUIZ && (
                                <div className="p-5 h-full flex flex-col">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <h1 className="text-xl font-bold ">Chọn đáp án đúng</h1>
                                        </div>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">Quiz</span>
                                    </div>
                                    <p className=" mb-4 text-gray-500"> (nếu không có đáp án đúng vui lòng bấm bỏ qua)</p>
                                    <p className="text-lg mb-6">{flashcards[index]?.question}</p>
                                    <div className="grid grid-cols-2 gap-5 flex-1">
                                        {quizOptions.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleQuizAnswer(option, idx)}
                                                disabled={selectedAnswers[idx]}
                                                className={`
                                              flex items-center h-full border dark:border-white/10 rounded-lg group 
                                              transition-colors disabled:!bg-transparent
                                              ${selectedAnswers[idx] === "correct" ? "!border-green-500 border-2 tada" : ""}
                                              ${selectedAnswers[idx] === "incorrect" ? "!border-red-500 border-2 shake" : ""}
                                            `}>
                                                <div
                                                    className={`
                                              w-[50px] h-full flex items-center justify-center border-r dark:border-r-white/10
                                               transition-colors
                                              ${selectedAnswers[idx] === "correct" ? "!border-r-green-500" : ""}
                                              ${selectedAnswers[idx] === "incorrect" ? "!border-r-red-500" : ""}
                                            `}>
                                                    {idx + 1}
                                                </div>
                                                <p className="flex-1 text-center px-2">{option}</p>
                                            </button>
                                        ))}
                                        {quizOptions.length < 4 && <p className="text-red-500">Cảnh báo: Chưa đủ đáp án để trộn ngẫu nhiên (Yêu cầu trên 4)</p>}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Controls */}

                        <div className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 rounded-md overflow-hidden w-full flex items-center justify-between shadow-md text-2xl">
                            <div className="flex-1 p-3 hover:bg-primary hover:text-white flex flex-col gap-1 justify-center items-center cursor-pointer" onClick={() => handleProgress("unknown")}>
                                <GrFormPrevious />
                                <p className="text-sm">Lùi lại</p>
                            </div>
                            <div className="flex-1 p-3 hover:bg-primary hover:text-white flex flex-col gap-1 justify-center items-center cursor-pointer" onClick={() => handleProgress("known")}>
                                <GrFormNext />
                                <p className="text-sm">Tiến tới</p>
                            </div>
                        </div>
                    </div>

                    {/* Feature Selection Panel */}
                    <div className="w-full md:w-auto flex flex-col gap-4">
                        <div className="space-y-2">
                            <h2 className="font-medium">Chế độ học</h2>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries({
                                    Flashcard: FEATURES.FLASHCARD,
                                    Quiz: FEATURES.QUIZ,
                                }).map(([name, value]) => (
                                    <button
                                        key={value}
                                        onClick={() => setFeature(value)}
                                        className={`px-4 py-2 rounded-lg transition-colors  border border-white/10 ${
                                            feature === value ? "bg-primary text-white" : "bg-gray-100 dark:bg-slate-800/50 hover:bg-gray-200"
                                        }`}>
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Progress Display */}
                        <div className="space-y-2">
                            <h2 className="font-medium">Tiến trình</h2>
                            <div className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 p-4 rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <span>Đã học:</span>
                                    <span>{progress.known.length}</span>
                                </div>

                                <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-500/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary"
                                        style={{
                                            width: `${(progress.known.length / flashcards.length) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Keyboard Shortcuts Guide */}
                        <div className="space-y-2">
                            <h2 className="font-medium">Phím tắt</h2>
                            <div className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 p-4 rounded-lg space-y-3 text-gray-500 dark:text-white">
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">→</kbd>
                                    <span className="">Tiến tới</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">←</kbd>
                                    <span className="">Lùi lại</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">Space</kbd>
                                    <span className="">Lật thẻ </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
