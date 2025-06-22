// "use client";
// import handleCompareDate from "@/lib/CompareDate";
// import { GET_API_WITHOUT_COOKIE, POST_API } from "@/lib/fetchAPI";
// import { message, Modal, Rate, Spin } from "antd";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import { CiTimer } from "react-icons/ci";
// import { FaFileCircleQuestion, FaRegEye, FaRegFlag } from "react-icons/fa6";
// import { IoIosArrowUp } from "react-icons/io";
// import { IoArrowForwardCircleOutline, IoShareSocial } from "react-icons/io5";
// import { MdKeyboardArrowLeft, MdOutlineVerified } from "react-icons/md";
// import Cookies from "js-cookie";
// import { RiTimeLine } from "react-icons/ri";
// import { useRouter } from "next/navigation";
// import { useUser } from "@/context/userContext";
// import { IComment, IQuestion, IQuiz, IUser } from "@/types/type";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { ChevronLeft, CircleChevronRight, Flag, Send } from "lucide-react";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
// export default function QuizDetaiAl({ params }: { params: any }) {
//     const [data, setData] = useState<IQuiz>();
//     const [quiz, setQuiz] = useState<IQuestion[]>([]);
//     const [comment, setComment] = useState<IComment[]>([]);
//     const [value, setValue] = useState(5);
//     const [review, setReview] = useState("");
//     const token = Cookies.get("token") || "";
//     const [messageApi, contextHolder] = message.useMessage();
//     const userContext = useUser();
//     const user = userContext?.user;
//     const [open, setOpen] = useState(false);
//     const [confirmLoading, setConfirmLoading] = useState(false);
//     const defaultReport = { type_of_violation: "spam", content: "" };
//     const [report, setReport] = useState(defaultReport);
//     const router = useRouter();
//     useEffect(() => {
//         const fetchData = async () => {
//             const res = await GET_API_WITHOUT_COOKIE(`/quiz/${params.slug}`);
//             setComment(res?.quiz?.comment);
//             setQuiz(res?.quiz?.questions?.data_quiz.slice(0, 6));
//             delete res?.quiz?.questions;
//             setData(res.quiz);
//         };
//         fetchData();
//     }, []);
//     useEffect(() => {
//         const hash = window.location.hash; // Lấy hash từ URL
//         if (hash) {
//             const id = hash.replace("#", "");
//             const element = document.getElementById(id);
//             if (element) {
//                 element.scrollIntoView({ behavior: "smooth" });
//             }
//         }
//     }, [data]); // Theo dõi thay đổi của data

//     if (data === null) {
//         return (
//             <div className="flex items-center justify-center h-screen">
//                 <Spin size="large" />
//             </div>
//         );
//     }

//     const desc = ["Rất tệ", "Tệ", "Tạm ổn", "Tốt", "Rất tốt"];

//     const handleSendComment = async () => {
//         const newComment: IComment = {
//             _id: Math.random().toString(36).substr(2, 9), // Generate a temporary ID
//             quiz_id: data?._id,
//             review,
//             rating: value,
//             created_at: new Date(),
//             user_id: user as IUser,
//         };
//         const req = await POST_API(`/quiz/comment`, newComment, "POST", token);
//         if (req) {
//             const res = await req.json();
//             if (res.ok) {
//                 console.log(res);
//                 if (res?.exist) {
//                     setComment((item) => item.map((i) => (i._id == res?.id ? { ...i, review, created_at: new Date() } : i)));
//                 } else {
//                     setComment([...comment, newComment]);
//                 }
//                 messageApi.success(res.message);
//             } else {
//                 messageApi.error(res.message);
//             }
//         }
//     };
//     const handlePrev = () => {
//         router.back();
//     };

//     function calAvg(arr: IComment[]) {
//         let sum = 0;
//         if (arr.length == 0) return 0;
//         for (let i = 0; i < arr.length; i++) {
//             sum += arr[i]?.rating;
//         }
//         return sum / arr.length;
//     }

//     function Round(num: number) {
//         return Math.round(num * 10) / 10;
//     }

//     if (!quiz?.length) {
//         return (
//             <div className="flex items-center justify-center h-screen">
//                 <Spin size="large" />
//             </div>
//         );
//     }

//     const showModal = () => {
//         setOpen(true);
//     };

//     const handleOk = () => {
//         handleSendReport();
//     };

//     const handleCancel = () => {
//         setOpen(false);
//     };

//     const handleSendReport = async () => {
//         setConfirmLoading(true);
//         const newReport = {
//             type_of_violation: report.type_of_violation,
//             content: report.content,
//             link: `/quiz/detail/${data?.slug}`,
//         };
//         const req = await POST_API(`/report`, { ...newReport }, "POST", token);
//         if (req) {
//             const res = await req.json();
//             if (res.ok) {
//                 messageApi.success(res.message);
//                 handleCancel();
//                 setReport(defaultReport);
//             } else {
//                 messageApi.error(res.message);
//             }
//         }
//         setConfirmLoading(false);
//     };

//     return (
//         <div className="flex items-center justify-center">
//             <div className="w-full md:w-[1000px] xl:w-[1200px] py-5 pt-20">
//                 <div className="text-slate-700 dark:text-white relative px-3 md:px-0">
//                     {contextHolder}
//                     <div className=" ">
//                         {data && (
//                             <div className="mt-5 bg-white dark:bg-slate-800/50 p-5 rounded-lg shadow-sm  border border-white/10">
//                                 <Button variant="link" className="mb-3 flex text-xl font-bold items-center gap-2">
//                                     <ChevronLeft onClick={handlePrev} className="" />
//                                     {data?.title}
//                                 </Button>
//                                 <div className="flex flex-col lg:flex-row gap-5 ">
//                                     <div className="flex-1 flex gap-5">
//                                         <div className="flex-1 w-[200px] rounded-xl  shadow-md h-[300px] lg:h-[400px]">
//                                             <div className="overflow-hidden relative h-full rounded-[8px]">
//                                                 <Image
//                                                     src={data?.img}
//                                                     alt={data?.title}
//                                                     className="absolute h-full w-full object-cover hover:scale-110 duration-300  brightness-90"
//                                                     fill
//                                                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                                                     priority
//                                                 />
//                                                 <div className="p-3 absolute z-1 text-white bottom-0 w-full bg-linear-item">
//                                                     <div className="flex justify-between items-center gap-1 flex-col lg:flex-row">
//                                                         <Link href={`/profile/${data?.uid?._id}`} className="flex flex-1 items-center gap-2">
//                                                             <div className="relative w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden">
//                                                                 <Image
//                                                                     unoptimized
//                                                                     src={data?.uid?.profilePicture || "/meme.jpg"}
//                                                                     alt={data?.title}
//                                                                     className="absolute object-cover h-full"
//                                                                     fill
//                                                                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                                                                     priority
//                                                                 />
//                                                             </div>
//                                                             <div className="group">
//                                                                 <div className="flex items-center gap-1">
//                                                                     <h2 className="text-sm line-clamp-1 overflow-hidden group-hover:underline">{data?.uid?.displayName}</h2>
//                                                                     {data?.uid?.verify ? <MdOutlineVerified color="#3b82f6" /> : ""}
//                                                                 </div>
//                                                                 {data?.date && (
//                                                                     <p className="text-[#D9D9D9] text-[10px] flex gap-1 items-center">
//                                                                         <CiTimer color="#D9D9D9" /> {handleCompareDate(data?.date)}
//                                                                     </p>
//                                                                 )}
//                                                             </div>
//                                                         </Link>
//                                                         <div className="text-sm flex-1">
//                                                             <div className="flex justify-end items-center gap-1 ">
//                                                                 <FaFileCircleQuestion />
//                                                                 <p className="">Số câu hỏi {quiz?.length}</p>
//                                                             </div>
//                                                             <div className="flex justify-end items-center gap-1">
//                                                                 <FaRegEye />
//                                                                 <p className="">Lượt làm: {data?.noa}</p>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="flex-1 flex flex-col justify-between">
//                                             <div className="">
//                                                 <div className="flex items-center gap-2 flex-wrap">
//                                                     <Button className="" variant="outline" size="sm">
//                                                         {data?.subject}
//                                                     </Button>
//                                                     <Button className="" variant="outline" size="sm">
//                                                         Xã hội
//                                                     </Button>
//                                                     <Button className="" variant="outline" size="sm">
//                                                         Tất cả
//                                                     </Button>
//                                                 </div>
//                                                 <div className="flex gap-3 items-center my-3 flex-wrap">
//                                                     <h1 className="text-3xl font-bold">{Round(calAvg(comment))}</h1>
//                                                     <div className="">
//                                                         <Rate disabled defaultValue={Round(calAvg(comment))} />
//                                                         <p>{data?.comment?.length} đánh giá</p>
//                                                     </div>
//                                                     <div className="flex items-center gap-2  h-[35px]">
//                                                         <div
//                                                             className="mb-0 xl:mb-1 hover:text-primary cursor-pointer bg-gray-200 w-[35px] h-full flex items-center justify-center rounded-lg"
//                                                             onClick={showModal}>
//                                                             <FaRegFlag />
//                                                         </div>
//                                                         <div className="hover:text-primary cursor-pointer bg-gray-200 w-[35px] h-full flex items-center justify-center rounded-lg">
//                                                             <IoShareSocial size={15} />
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="">
//                                                     <p className="italic">{data?.content}</p>
//                                                 </div>
//                                             </div>
//                                             <Link href={`/quiz/${data?.slug}`} className="w-[120px] flex items-center justify-center gap-1">
//                                                 <Button>
//                                                     <CircleChevronRight /> Làm bài
//                                                 </Button>
//                                             </Link>
//                                         </div>
//                                     </div>
//                                     <div className="flex-1 w-full pr-3">
//                                         <div className="h-[400px] overflow-y-scroll  space-y-3 ">
//                                             <h1 className="text-primary font-bold">Preview 10 câu hỏi trong bài quiz này</h1>
//                                             {quiz.length > 0 &&
//                                                 quiz?.map((item, index) => (
//                                                     <div className="bg-gray-100 dark:bg-slate-800/30 dark:text-white/60 rounded-md px-3 py-2 text-sm" key={index}>
//                                                         <h1 className="font-bold ">{item?.question}</h1>
//                                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1 ">
//                                                             {item.answers.map((answer, idx) => (
//                                                                 <div key={idx} title={answer} className={`text-[12px] h-[36px] line-clamp-1 relative flex items-center cursor-pointer`}>
//                                                                     <input type="radio" className="w-1 invisible" />
//                                                                     <label htmlFor="" className={`absolute  h-full font-bold px-3 flex items-center justify-center rounded-md`}>
//                                                                         {idx === 0 ? "A" : idx === 1 ? "B" : idx === 2 ? "C" : "D"}
//                                                                     </label>
//                                                                     <label htmlFor="" className="block w-full ml-8 p-2 ">
//                                                                         {answer}
//                                                                     </label>
//                                                                 </div>
//                                                             ))}
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                     <Modal title="Báo cáo vi phạm" open={open} onOk={handleOk} okText="Gửi yêu cầu" confirmLoading={confirmLoading} onCancel={handleCancel}>
//                         <div>
//                             <Select value={report.type_of_violation} onValueChange={(value) => setReport({ ...report, type_of_violation: value })}>
//                                 <SelectTrigger className="w-[180px]">
//                                     <SelectValue placeholder="Loại báo cáo" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectGroup>
//                                         <SelectLabel>Loại báo cáo</SelectLabel>
//                                         <SelectItem value="spam">Spam</SelectItem>
//                                         <SelectItem value="Không phù hợp">Không phù hợp</SelectItem>
//                                         <SelectItem value="khác">khác</SelectItem>
//                                     </SelectGroup>
//                                 </SelectContent>
//                             </Select>

//                             <Textarea
//                                 placeholder="Nhập nôi dung cần báo cáo..."
//                                 className="mt-3 h-[200px]"
//                                 value={report.content}
//                                 onChange={(e) => setReport({ ...report, content: e.target.value })}></Textarea>
//                         </div>
//                     </Modal>
//                     <div className="mt-5 w-full">
//                         <div className="flex gap-5 items-start flex-col-reverse lg:flex-row ">
//                             <div className="flex-1 bg-white dark:bg-slate-800/50  border border-white/10 rounded-lg shadow-sm p-5 w-full">
//                                 <h1 className="text-primary text-3xl font-bold">Đánh giá</h1>
//                                 <div className="flex gap-5 items-center my-5">
//                                     <h1 className="text-3xl font-bold">{Round(calAvg(comment))}</h1>
//                                     <div className="">
//                                         <Rate disabled defaultValue={Round(calAvg(comment))} className="text-3xl" />
//                                         <p className="text-gray-500 text-sm mt-1">{data?.comment?.length} đánh giá</p>
//                                     </div>
//                                     <div className="flex items-center gap-2 h-[35px]">
//                                         <Button className="" variant="outline" size="sm" onClick={showModal}>
//                                             <Flag />
//                                         </Button>
//                                         <Link href={`https://www.facebook.com/share.php?u=https://www.quizzet.site/quiz/detail/${params?.id}`} target="_blank" className="">
//                                             <Button size="sm" variant="outline">
//                                                 <IoShareSocial size={15} />
//                                             </Button>
//                                         </Link>
//                                     </div>
//                                 </div>
//                                 <div className="space-y-3 h-[350px] overflow-y-scroll">
//                                     {comment.length > 0 &&
//                                         comment?.map((item: IComment, index) => (
//                                             <div className="bg-gray-100 dark:bg-slate-800/50 rounded-lg shadow-sm px-5 py-3" key={index} id={item?.user_id?._id}>
//                                                 <div className="flex items-center gap-2">
//                                                     <div className="relative w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden">
//                                                         <Image
//                                                             src={item?.user_id?.profilePicture || "/meme.jpg"}
//                                                             alt=""
//                                                             className="absolute object-cover h-full"
//                                                             fill
//                                                             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                                                         />
//                                                     </div>
//                                                     <div className="flex-1 flex gap-10 items-center justify-between">
//                                                         <div className="flex-1">
//                                                             <h3 className="font-bold line-clamp-1">{item.user_id?.displayName || "N/A"}</h3>
//                                                             {item?.created_at && (
//                                                                 <p className="text-gray-500 text-sm flex gap-1 items-center">
//                                                                     <RiTimeLine /> {handleCompareDate(item?.created_at)}
//                                                                 </p>
//                                                             )}
//                                                         </div>
//                                                         <div className="flex-1 flex justify-end items-center gap-1 text-yellow-500">
//                                                             <Rate disabled defaultValue={item?.rating} className="text-sm" />
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <p className="mt-2">{item?.review}</p>
//                                             </div>
//                                         ))}
//                                     {comment.length === 0 && <p className="text-gray-500">Chưa có lượt đánh giá nào...</p>}
//                                 </div>
//                             </div>
//                             <div className="flex-1 bg-white dark:bg-slate-800/50 border border-white/10 rounded-lg shadow-sm p-5 space-y-2 w-full">
//                                 <h1 className="text-primary text-3xl font-bold">Bình luận</h1>
//                                 <p className="text-gray-500">Hãy để lại bình luận cũng như số sao của bạn dưới đây:</p>
//                                 <Rate defaultValue={5} tooltips={desc} onChange={setValue} value={value} />
//                                 <Textarea
//                                     placeholder="Bình luận của bạn..."
//                                     className="h-[100px] rounded-xl py-3 dark:bg-gray-500/50 dark:text-white text-third"
//                                     value={review}
//                                     onChange={(e) => setReview(e.target.value)}></Textarea>
//                                 <Button className="mt-2" onClick={handleSendComment}>
//                                     <Send />
//                                     Gửi
//                                 </Button>
//                             </div>
//                         </div>
//                     </div>
//                     <div
//                         className="fixed bottom-10 right-10 flex items-center justify-center rounded-full bg-primary text-white cursor-pointer w-[40px] h-[40px] animate-bounce"
//                         onClick={() => window.scrollTo(0, 0)}>
//                         <IoIosArrowUp />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
