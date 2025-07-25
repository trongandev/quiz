import CHome from "@/components/CHome";
import { getCachedFlashcardPublic, getCachedQuizzet } from "@/lib/cacheData";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";
import { BsLightning } from "react-icons/bs";
import { Button } from "@/components/ui/button";

export async function generateMetadata() {
    return {
        title: `Quizzet - AI Quiz, Flashcard Generator`,
        description: `Quizzet là một nền tảng web được thiết kế nhằm tối ưu hóa quá trình học tập và ôn luyện của sinh viên thông qua các tính năng đa dạng và ứng dụng công nghệ (AI). Nền tảng không chỉ giúp sinh viên tự kiểm tra kiến thức mà còn hỗ trợ xây dựng lộ trình học tập hiệu quả, tương tác với cộng đồng và tiếp cận nguồn đề cương phong phú.`,
        openGraph: {
            title: `Quizzet - AI Quiz, Flashcard Generator`,
            description: `Quizzet là một nền tảng web được thiết kế nhằm tối ưu hóa quá trình học tập và ôn luyện của sinh viên thông qua các tính năng đa dạng và ứng dụng công nghệ trí tuệ nhân tạo (AI). Nền tảng không chỉ giúp sinh viên tự kiểm tra kiến thức mà còn hỗ trợ xây dựng lộ trình học tập hiệu quả, tương tác với cộng đồng và tiếp cận nguồn đề cương phong phú.`,
            type: "website",
            images: "/banner.png",
            url: "https://quizzet.site",
        },
    };
}

export default async function HomePage() {
    const quizzet = await getCachedQuizzet();

    const publicFlashcards = await getCachedFlashcardPublic();
    const cookieStore = cookies();
    const authToken = cookieStore.get("token")?.value || "";
    return (
        <div>
            <div className="flex items-center justify-center">
                <div className="w-full md:w-[1000px] xl:w-[1200px] py-5 pt-20">
                    <CHome quizData={quizzet} publicFlashcards={publicFlashcards} />
                </div>
            </div>
            {!authToken && (
                <div className="mt-20 h-72 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-500/50 dark:to-purple-500/50 flex items-center justify-center flex-col gap-3 text-center md:text-left">
                    <h1 className=" text-2xl md:text-4xl text-white font-bold">Sẵn sàng bắt đầu hành trình học tập?</h1>
                    <p className="text-md md:text-lg text-white/80">Tham gia cộng đồng hơn 300 học viên đang học tập hiệu quả cùng Quizzet</p>
                    <div className="flex items-center gap-5">
                        <Link href="/login">
                            <Button className="relative text-white group overflow-hidden inline-flex items-center gap-2  font-bold border border-white/10 group transition-all duration-200 text-lg h-12">
                                <BsLightning className="w-5 h-5 group-hover:text-yellow-200  rotate-0 group-hover:rotate-180 transition-all duration-300" /> Bắt đầu miễn phí
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
