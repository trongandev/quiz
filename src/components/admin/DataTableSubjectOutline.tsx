"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, BookUser, CalendarMinus2, CheckCircle, ChevronDown, Clock, Edit, FileText, LocateFixed, Mail, MegaphoneOff, MoreHorizontal, Pencil, Search, User, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IHistory, IQuiz, ISO, IUser } from "@/types/type";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import handleCompareDate from "@/lib/CompareDate";
import { Badge } from "../ui/badge";
import { GoogleOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";

const getFileTypeColor = (type: string) => {
    switch (type) {
        case "pdf":
            return "bg-red-500";
        case "docx":
            return "bg-blue-500";
        case "xlsx":
            return "bg-green-500";
        default:
            return "bg-gray-500";
    }
};

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const columns: ColumnDef<ISO>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => <Checkbox className="mr-3" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
        enableSorting: false,
        enableHiding: false,
    },
    // {
    //     accessorKey: "displayName",
    //     header: ({ column }) => {
    //         return (
    //             <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
    //                 Người làm
    //                 <ArrowUpDown />
    //             </Button>
    //         );
    //     },
    //     cell: ({ row }) => (
    //         <Link href={`/profile/${row.original.user_id._id}`} className="capitalize flex items-center gap-2">
    //             <Avatar className="w-7 h-7">
    //                 <AvatarImage src={row.original.user_id.profilePicture} alt="Profile Picture" className="object-cover" />
    //                 <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-800/50 dark:text-blue-200 font-semibold">
    //                     {(row.original.user_id.displayName || "")
    //                         ?.split(" ")
    //                         .map((n) => n[0])
    //                         .join("") || ""}
    //                 </AvatarFallback>
    //             </Avatar>
    //             <p className="text-white/80 font-medium w-[80px] line-clamp-1" title={row.original.user_id.displayName}>
    //                 {row.original.user_id.displayName}
    //             </p>
    //         </Link>
    //     ),
    // },
    {
        accessorKey: "img",
        header: "Hình ảnh",
        cell: ({ row }) => (
            <div className="relative h-16 w-32 overflow-hidden">
                <Image src={row.original.image || "/meme.jpg"} alt="" fill className="absolute w-full h-full object-cover rounded-md"></Image>
            </div>
        ),
    },
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Tiêu đề
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <p className="text-white/80">{row.original.title}</p>,
    },
    {
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Loại
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => (
            <Badge className={`${getFileTypeColor(row.original.type)} text-white text-xs px-2 py-1`}>
                <FileText className="w-4 h-4 text-white mr-1" />
                {row.original.type.toUpperCase()}
            </Badge>
        ),
    },

    {
        accessorKey: "lenght",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Tổng
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => (
            <Badge variant="secondary" className=" text-xs font-thin">
                {row.original.type === "txt" ? row.original.lenght + " câu" : formatFileSize(row.original.lenght)}
            </Badge>
        ),
    },
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Ngày tạo
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className="text-xs">{handleCompareDate(row.original.date)}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment._id)}>
                            <BookUser />
                            Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Pencil /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-700 dark:text-red-300">
                            <MegaphoneOff /> Vô hiệu hóa
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export function DataTableSubjectOutline({ subject_outline }: { subject_outline: ISO[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable<ISO>({
        data: subject_outline,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <div className="flex items-center gap-5">
                    <div className="relative w-full ">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Tìm kiếm tên người đăng..."
                            className="pl-10 w-full md:w-64 "
                            value={(table.getColumn("displayName")?.getFilterValue() as string) ?? ""}
                            onChange={(event) => table.getColumn("displayName")?.setFilterValue(event.target.value)}
                        />
                    </div>
                    <div className="relative w-full ">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Tìm kiếm tiêu đề..."
                            className="pl-10 w-full md:w-64 "
                            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                            onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
                        />
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border dark:border-white/10">
                <Table>
                    <TableHeader className="dark:border-white/10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
