"use client";

import { SideBarDeCuong } from "@/components/quiz/SideBarDeCuong";
import { SidebarProvider } from "@/components/ui/sidebar";
export default function RootLayout({ children }: any) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-gray-200/80  dark:bg-inherit">
                <SideBarDeCuong />
                <main className="flex-1 overflow-auto py-20 ">{children}</main>
                {/* <SidebarInset className="flex-1 bg-gray-200/80 dark:bg-inherit">
                </SidebarInset> */}
            </div>
        </SidebarProvider>
    );
}
