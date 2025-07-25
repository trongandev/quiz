"use client"
import handleCompareDate from "@/lib/CompareDate"
import { IQuiz, ISO } from "@/types/type"
import Image from "next/image"
import React, { useCallback, useEffect, useState } from "react"
import { FaRegEye, FaRegQuestionCircle } from "react-icons/fa"
import { ArrowDownNarrowWide, ArrowUpNarrowWide, ChevronLeft, ChevronRight, Eye, File, Grid2X2, Grid3x3, Search } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
export default function CDeCuongTypeText({ findText }: { findText: ISO[] }) {
    const [toggleBtnSortNumber, setToggleBtnSortNumber] = useState(true)

    const [searchTerm, setSearchTerm] = useState("")
    const [sortOrder, setSortOrder] = useState("asc") // "asc" or "desc"
    const [viewMode, setViewMode] = useState(3) // "grid 4x2" or "grid3x2"
    const [data, setData] = useState(findText)
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(8)
    const [isMobile, setIsMobile] = useState(false)
    // Calculate pagination
    const totalItems = data?.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = data?.slice(startIndex, endIndex)
    const router = useRouter()
    const displaySO = currentItems
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768
            setIsMobile(mobile)
            setItemsPerPage(mobile ? 4 : 8)
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])
    const handleSortByNumber = useCallback(
        (key: keyof ISO, direction = "asc") => {
            setToggleBtnSortNumber(!toggleBtnSortNumber)
            const sortedData = [...data].sort((a, b) => {
                if (direction === "asc") return Number(a[key]) - Number(b[key])
                return Number(b[key]) - Number(a[key])
            })
            setData(sortedData)
        },
        [data]
    )

    const handleSearch = (value: any) => {
        setSearchTerm(value)
        const search = findText.filter((item: any) => item.title.toLowerCase().includes(value.toLowerCase()))
        setData(search)
    }

    // Pagination handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        // window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1)
        }
    }

    const handleNext = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1)
        }
    }

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = isMobile ? 3 : 5 // Ít hơn trên mobile

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (isMobile) {
                // ✅ Logic đơn giản hơn cho mobile
                if (currentPage === 1) {
                    pages.push(1, 2, "...", totalPages)
                } else if (currentPage === totalPages) {
                    pages.push(1, "...", totalPages - 1, totalPages)
                } else {
                    pages.push(1, "...", currentPage, "...", totalPages)
                }
            } else {
                // Logic cũ cho desktop
                if (currentPage <= 3) {
                    for (let i = 1; i <= 4; i++) {
                        pages.push(i)
                    }
                    pages.push("...")
                    pages.push(totalPages)
                } else if (currentPage >= totalPages - 2) {
                    pages.push(1)
                    pages.push("...")
                    for (let i = totalPages - 3; i <= totalPages; i++) {
                        pages.push(i)
                    }
                } else {
                    pages.push(1)
                    pages.push("...")
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        pages.push(i)
                    }
                    pages.push("...")
                    pages.push(totalPages)
                }
            }
        }

        return pages
    }

    return (
        <div className=" mt-10 flex flex-col gap-5  ">
            <div className="flex md:items-center gap-3 justify-between flex-col md:flex-row md:gap-10 ">
                <div className="flex items-center gap-3 ">
                    <div className="w-1/6 h-10 md:w-10  flex items-center justify-center bg-gradient-to-r from-yellow-500/80 to-orange-500/80 rounded-lg text-white">
                        <File size={21} />
                    </div>
                    <h1 className="text-3xl font-bold">Đề cương dạng chữ</h1>
                </div>
                <div className="flex-1 flex md:items-center gap-3 justify-between flex-col md:flex-row">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input placeholder="Tìm tên câu hỏi mà bạn cần..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)} className="pl-10 h-11 border-gray-400/50 dark:border-gray-600" />
                    </div>
                    <div className="w-[0.4px] h-10 bg-gray-400/50 dark:bg-gray-600 hidden md:block"></div>
                    <div className="flex items-center gap-2 justify-between md:justify-start">
                        <div className="flex items-center border border-gray-400/50 dark:border-white/10 rounded-s-md rounded-r-md overflow-hidden">
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger>
                                    <div
                                        className={`h-11 w-10  flex items-center justify-center dark:hover:text-gray-300 cursor-pointer ${sortOrder === "asc" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"}`}
                                        onClick={() => {
                                            setSortOrder("asc")
                                            handleSortByNumber("view", "asc")
                                        }}
                                    >
                                        <ArrowUpNarrowWide className="w-4 h-4  " />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Sắp xếp theo số lượt làm tăng dần</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip delayDuration={100}>
                                <TooltipTrigger>
                                    <div
                                        className={`h-11 w-10  flex items-center justify-center dark:hover:text-gray-300 cursor-pointer ${sortOrder === "desc" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"}`}
                                        onClick={() => {
                                            setSortOrder("desc")
                                            handleSortByNumber("view", "desc")
                                        }}
                                    >
                                        <ArrowDownNarrowWide className="w-4 h-4  " />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Sắp xếp theo số lượt làm giảm dần</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="hidden md:flex items-center border border-gray-400/50 dark:border-white/10 rounded-s-md rounded-r-md overflow-hidden">
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger>
                                    <div className={`h-11 w-10  flex items-center justify-center dark:hover:text-gray-300 cursor-pointer ${viewMode === 4 ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"}`} onClick={() => setViewMode(4)}>
                                        <Grid3x3 className="w-4 h-4  " />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Dạng lưới 4x2</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger>
                                    <div className={`h-11 w-10  flex items-center justify-center dark:hover:text-gray-300 cursor-pointer ${viewMode === 3 ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"}`} onClick={() => setViewMode(3)}>
                                        <Grid2X2 className="w-4 h-4  " />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Dạng lưới 3x2</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${viewMode === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} h-[416px] overflow-y-scroll`}>
                {displaySO?.map((item: any, index: any) => (
                    <div className="bg-white dark:bg-slate-800/50 hover:shadow-md rounded-xl h-[350px] md:h-[250px] flex flex-col md:flex-row overflow-hidden shadow-sm border border-white/10 group " key={index}>
                        <div className="relative overflow-hidden flex-1  h-full">
                            <Image src={item.image} alt={item.title} className="object-cover absolute  hover:scale-105 transition-all duration-300" priority fill />
                            <div className="absolute z-1 bottom-0 bg-linear-item w-full text-white text-[10px] p-2 font-bold ">
                                <p className="flex gap-1 items-center">
                                    <FaRegQuestionCircle />
                                    Số câu hỏi: {item.lenght}
                                </p>
                                <p className="flex gap-1 items-center">
                                    <FaRegEye />
                                    Lượt xem: {item.view}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-between flex-col p-3">
                            <h1 className="font-bold line-clamp-2 h-[48px]">{item.title}</h1>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{item.content || "Không có mô tả..."}</p>
                            <div className="">
                                {item?.user_id && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={item?.user_id?.profilePicture} className="object-cover" />
                                            <AvatarFallback className="text-xs">A</AvatarFallback>
                                        </Avatar>
                                        <div className="">
                                            <span className="text-slate-400 text-sm">{item.user_id.displayName}</span>
                                            <p className="text-xs text-gray-600 dark:text-gray-500">{handleCompareDate(item.date)}</p>
                                        </div>
                                    </div>
                                )}

                                <Button onClick={() => router.push(`/decuong/${item.slug}`)} variant="outline" className="w-full dark:text-white">
                                    <Eye /> Xem ngay
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                {data && data.length === 0 ? <p className="text-primary">Không có đề cương nào...</p> : ""}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <button onClick={handlePrevious} disabled={currentPage === 1} className={cn("gap-1 pl-2.5", buttonVariants({ variant: "ghost" }), currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer")}>
                                <ChevronLeft className="h-4 w-4" />
                                <span>Previous</span>
                            </button>
                        </PaginationItem>

                        {getPageNumbers().map((page, index) => (
                            <PaginationItem key={index}>
                                {page === "..." ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <button
                                        onClick={() => handlePageChange(page as number)}
                                        className={cn(
                                            buttonVariants({
                                                variant: currentPage === page ? "outline" : "ghost",
                                                size: "sm",
                                            }),
                                            "cursor-pointer"
                                        )}
                                        aria-current={currentPage === page ? "page" : undefined}
                                    >
                                        {page}
                                    </button>
                                )}
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <button onClick={handleNext} disabled={currentPage === totalPages} className={cn("gap-1 pr-2.5", buttonVariants({ variant: "ghost" }), currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer")}>
                                <span>Next</span>
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}{" "}
            {/* Pagination Info */}
            {totalPages > 1 && (
                <div className="flex justify-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Hiển thị {startIndex + 1}-{Math.min(endIndex, totalItems)} trên tổng {totalItems} quiz | Trang {currentPage} / {totalPages}
                    </p>
                </div>
            )}
        </div>
    )
}
