import CReportPage from "@/components/admin/CReportPage";
import { GET_API } from "@/lib/fetchAPI";
import { cookies } from "next/headers";
import React from "react";

export default async function ReportPage() {
    const cookiesStore = cookies();
    const token = cookiesStore.get("token")?.value || "";
    const res = await GET_API("/report/admin", token);
    if (!res.ok) {
        return (
            <div className="h-screen flex items-center justify-center">
                <h1>Bạn không có quyền truy cập</h1>
            </div>
        );
    }
    return <CReportPage report={res.result} />;
}
