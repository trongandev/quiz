import { IQuiz } from "@/types/type"
import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MessageCircle, Pencil, Share2, Users } from "lucide-react"
import handleCompareDate from "@/lib/CompareDate"
export default function QuizInProfile({ post }: { post: IQuiz }) {
    const router = useRouter()
    return (
        <Card onClick={() => router.push(`/quiz/detail/${post.slug}`)} key={post._id} className={`border shadow-md hover:shadow-lg transition-shadow cursor-pointer group`}>
            <div className="relative w-full h-32">
                <Image src={post.img} alt="" className="absolute object-cover group-hover:brightness-75 transition-all duration-300" fill></Image>
                <Badge variant="secondary" className="text-xs absolute z-1 top-1 left-1">
                    {post.subject}
                </Badge>
                <Button
                    onClick={(e) => {
                        e.preventDefault()
                        router.push(`/quiz/edit/${post.slug}`)
                    }}
                    variant="secondary"
                    size="sm"
                    className="absolute opacity-0 group-hover:opacity-100 transition-all   duration-500 z-1 top-1 right-1"
                >
                    <Pencil />
                </Button>
            </div>
            <CardHeader className="pb-3 pt-0">
                <div className="flex justify-between items-start mb-2"></div>
                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-2">{post.content}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1" title="Lượt xem">
                            <Eye className="w-3 h-3" />
                            {post.view}
                        </span>
                        <span className="flex items-center gap-1" title="Lượt làm">
                            <Users className="w-3 h-3" />
                            {post.noa}
                        </span>
                        <span className="flex items-center gap-1" title="Lượt bình luận">
                            <MessageCircle className="w-3 h-3" />
                            {post?.comment?.length}
                        </span>
                    </div>
                    <Button variant="ghost" size="sm" className="p-1 h-auto">
                        <Share2 className="w-3 h-3" />
                    </Button>
                </div>
                {post.date && <div className="mt-2 text-xs text-gray-500 dark:text-gray-300">{handleCompareDate(post.date)}</div>}
            </CardContent>
        </Card>
    )
}
