"use client";
import handleCompareDate from "@/lib/CompareDate";
import { IQuiz } from "@/types/type";
import { SearchOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { CiTimer } from "react-icons/ci";
import { FaRegEye } from "react-icons/fa";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { MdOutlineVerified } from "react-icons/md";
import { Dropdown } from "./dropdown/Dropdown";
import { DropdownItem } from "./dropdown/DropdownItem";
import { BiChevronDown } from "react-icons/bi";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Funnel, Grid2X2, Grid3x3, Play, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { SiQuizlet } from "react-icons/si";
import { Tooltip } from "antd";
import { subjectOption } from "@/lib/subjectOption";
export default function CQuiz({ quizData }: { quizData: IQuiz[] }) {
    const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
    const [viewMode, setViewMode] = useState(4); // "grid 4x2" or "grid3x2"
    const [data, setData] = useState(quizData);
    const [subject, setSubject] = useState("Tất cả");
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    // Calculate pagination
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data.slice(startIndex, endIndex);

    const displayQuizs = currentItems;

    const handleSortByNumber = useCallback(
        (key: keyof IQuiz, direction = "asc") => {
            const sortedData = [...data].sort((a, b) => {
                if (direction === "asc") return Number(a[key]) - Number(b[key]);
                return Number(b[key]) - Number(a[key]);
            });
            setData(sortedData);
            setCurrentPage(1); // Reset to first page after sorting
        },
        [data]
    );

    const handleSearch = (value: any) => {
        const search = quizData.filter((item) => item.title.toLowerCase().includes(value.toLowerCase()));
        setData(search);
        setCurrentPage(1); // Reset to first page after search
    };

    const handleSearchSubject = (label: string, value: string) => {
        if (value === "none") {
            setData(quizData);
            setCurrentPage(1);
            return;
        }
        setSubject(label);
        const search = quizData.filter((item) => item.subject == value);
        setData(search);
        setCurrentPage(1); // Reset to first page after filter
    };

    // Pagination handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push("...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const [isOpen, setIsOpen] = useState(false);

    function toggleDropdown() {
        setIsOpen(!isOpen);
    }

    function closeDropdown() {
        setIsOpen(false);
    }

    return (
        <div className="flex items-center justify-center">
            <div className="w-full md:w-[1000px] xl:w-[1200px] py-5 my-10">
                <div className="p-2 md:p-5 flex flex-col gap-5  bg-gray-200/80 dark:bg-gray-800 border border-gray-400/50 dark:border-white/10 rounded-lg mb-4 shadow-sm">
                    <div className="flex items-center gap-3 ">
                        <div className="w-1/6 h-14 md:w-14  flex items-center justify-center bg-gradient-to-r from-blue-500/80 to-purple-500/80 rounded-lg text-white">
                            <SiQuizlet size={21} />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold">Quiz</h1>
                            <p>Tổng hợp những bài quiz để bạn kiểm tra thử kiến thức của bản thân</p>
                        </div>
                    </div>
                    <div className="flex md:items-center gap-3 justify-between flex-col md:flex-row">
                        <div className="flex items-center  border border-gray-400/50 dark:border-white/10 h-11 w-full md:w-1/3 overflow-hidden rounded-lg hover:border-gray-400 transition-all duration-300">
                            <SearchOutlined className="text-gray-500 px-3" />
                            <input
                                type="text"
                                placeholder="Tìm tên câu hỏi mà bạn cần..."
                                className="bg-transparent w-full line-clamp-1 outline-none border-none"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <div className="w-[0.4px] h-10 bg-gray-500/50 hidden md:block"></div>
                        <div className="flex items-center gap-2 justify-between md:justify-start">
                            <div className="relative flex-1">
                                <button
                                    onClick={toggleDropdown}
                                    className="w-full md:w-40 h-11 flex px-3 items-center justify-between border border-gray-400/50 dark:border-white/10  rounded-lg hover:border-gray-400 transition-all duration-300">
                                    <Funnel size={18} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 pr-1" />
                                    <div className="flex items-center gap-2">
                                        <span>{subject}</span>
                                        <BiChevronDown className="w-5 h-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                                    </div>
                                </button>
                                <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2 max-h-80 overflow-scroll dark:!bg-gray-700">
                                    {subjectOption.map((item, index) => (
                                        <DropdownItem
                                            key={index}
                                            onClick={() => handleSearchSubject(item.label, item.value)}
                                            onItemClick={closeDropdown}
                                            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                                            {item.label}
                                        </DropdownItem>
                                    ))}
                                </Dropdown>
                            </div>
                            <div className="flex items-center border border-gray-400/50 dark:border-white/10 rounded-s-md rounded-r-md overflow-hidden">
                                <Tooltip placement="top" title="Sắp xếp theo số lượt làm tăng dần">
                                    <div
                                        className={`h-11 w-10  flex items-center justify-center dark:hover:text-gray-300 cursor-pointer ${
                                            sortOrder === "asc" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                                        }`}
                                        onClick={() => {
                                            setSortOrder("asc");
                                            handleSortByNumber("noa", "asc");
                                        }}>
                                        <ArrowUpNarrowWide className="w-4 h-4  " />
                                    </div>
                                </Tooltip>
                                <Tooltip placement="top" title="Sắp xếp theo số lượt làm giảm dần">
                                    <div
                                        className={`h-11 w-10  flex items-center justify-center dark:hover:text-gray-300 cursor-pointer ${
                                            sortOrder === "desc" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                                        }`}
                                        onClick={() => {
                                            setSortOrder("desc");
                                            handleSortByNumber("noa", "desc");
                                        }}>
                                        <ArrowDownNarrowWide className="w-4 h-4  " />
                                    </div>
                                </Tooltip>
                            </div>
                            <div className="flex items-center border border-gray-400/50 dark:border-white/10 rounded-s-md rounded-r-md overflow-hidden">
                                <Tooltip placement="top" title="Dạng lưới 4x2">
                                    <div
                                        className={`h-11 w-10  flex items-center justify-center dark:hover:text-gray-300 cursor-pointer ${
                                            viewMode === 4 ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                                        }`}
                                        onClick={() => setViewMode(4)}>
                                        <Grid3x3 className="w-4 h-4  " />
                                    </div>
                                </Tooltip>
                                <Tooltip placement="top" title="Dạng lưới 3x2">
                                    <div
                                        className={`h-11 w-10  flex items-center justify-center dark:hover:text-gray-300 cursor-pointer ${
                                            viewMode === 3 ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                                        }`}
                                        onClick={() => setViewMode(3)}>
                                        <Grid2X2 className="w-4 h-4  " />
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="w-[0.4px] h-10 bg-gray-500/50  hidden md:block"></div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/quiz/themcauhoi"
                                className="w-full md:w-auto border border-gray-500/50 dark:border-white/10 rounded-md flex items-center justify-center md:justify-start gap-2 h-11 px-3 text-gray-500">
                                <Plus className="h-4 w-4" />
                                Thêm câu hỏi
                            </Link>
                            <Link
                                href="/quiz/nganhang"
                                className="relative group overflow-hidden w-full md:w-auto flex items-center justify-center md:justify-start gap-4 bg-gradient-to-r from-blue-500 to-purple-500 px-4 h-11 rounded-md text-white">
                                <Play className="h-4 w-4" />
                                Thi thử
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50  dark:via-white/10 to-transparent transition-all duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                            </Link>
                        </div>
                    </div>
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${viewMode} gap-4`}>
                        {displayQuizs?.map((item) => (
                            <div key={item._id} className="group hover:shadow-md hover:scale-105 transition-all duration-300  rounded-xl border border-white/10 shadow-md h-[400px]">
                                <div className="overflow-hidden relative h-full rounded-[8px]">
                                    <Link className="block" href={`/quiz/detail/${item.slug}`}>
                                        <Image
                                            src={item.img}
                                            alt={item.title}
                                            className="absolute h-full w-full object-cover group-hover:scale-105 duration-300  brightness-90"
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            priority
                                        />
                                    </Link>
                                    <div className="p-3 absolute z-1 text-white bottom-0 w-full bg-linear-item">
                                        <h1 className="text-lg font-bold">{item.title}</h1>
                                        <p className="line-clamp-2 text-sm text-[#D9D9D9]">{item.content}</p>
                                        <div className="flex justify-end items-center gap-1 mb-[1px] text-[10px]">
                                            <FaRegEye />
                                            <p className="">Lượt làm: {item.noa}</p>
                                        </div>
                                        <div className="flex justify-between items-center gap-1">
                                            <Link href={`/profile/${item.uid._id}`} className="flex items-center gap-2">
                                                <div className="relative w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden">
                                                    <Image
                                                        unoptimized
                                                        src={item.uid.profilePicture}
                                                        alt={item.uid.displayName}
                                                        className="absolute object-cover h-full"
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        priority
                                                    />
                                                </div>
                                                <div className="group">
                                                    <div className="flex items-center gap-1">
                                                        <h2 className="text-sm line-clamp-1 overflow-hidden">{item.uid.displayName}</h2>
                                                        {item.uid.verify ? <MdOutlineVerified color="#3b82f6" /> : ""}
                                                    </div>
                                                    <p className="text-[#D9D9D9] text-[10px] flex gap-1 items-center">
                                                        <CiTimer color="#D9D9D9" /> {handleCompareDate(item.date)}
                                                    </p>
                                                </div>
                                            </Link>

                                            <Link href={`/quiz/${item.slug}`} className="flex gap-1 items-center text-sm btn btn-primary !rounded-md">
                                                Làm bài <IoArrowForwardCircleOutline />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Empty state */}
                        {data && data.length === 0 ? <p className="text-primary col-span-full text-center py-8">Không có quiz nào...</p> : ""}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            {/* Previous Button */}
                            <button
                                onClick={handlePrevious}
                                disabled={currentPage === 1}
                                className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${
                                    currentPage === 1
                                        ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                        : "border-gray-400 text-gray-600 hover:bg-primary hover:text-white hover:border-primary dark:border-white/20 dark:text-gray-300 dark:hover:bg-primary dark:hover:border-primary"
                                }`}>
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {/* Page Numbers */}
                            {getPageNumbers().map((page, index) => (
                                <React.Fragment key={index}>
                                    {page === "..." ? (
                                        <span className="flex items-center justify-center w-10 h-10 text-gray-400">...</span>
                                    ) : (
                                        <button
                                            onClick={() => handlePageChange(page as number)}
                                            className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${
                                                currentPage === page
                                                    ? "bg-primary text-white border-primary"
                                                    : "border-gray-400 text-gray-600 hover:bg-primary hover:text-white hover:border-primary dark:border-white/20 dark:text-gray-300 dark:hover:bg-primary dark:hover:border-primary"
                                            }`}>
                                            {page}
                                        </button>
                                    )}
                                </React.Fragment>
                            ))}

                            {/* Next Button */}
                            <button
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                                className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${
                                    currentPage === totalPages
                                        ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                        : "border-gray-400 text-gray-600 hover:bg-primary hover:text-white hover:border-primary dark:border-white/20 dark:text-gray-300 dark:hover:bg-primary dark:hover:border-primary"
                                }`}>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Pagination Info */}
                    {totalPages > 1 && (
                        <div className="flex justify-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Hiển thị {startIndex + 1}-{Math.min(endIndex, totalItems)} trên tổng {totalItems} quiz
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
