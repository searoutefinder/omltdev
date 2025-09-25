import React, { useMemo, MouseEvent, useTransition } from "react";
//styles
import { PaginationContainer, PageButton } from "./Elements";


interface PaginationProps {
    totalPages: any;
    currentPage: number;
    isLoading?: boolean;
    setPage: (page: number) => void;
}


export const Pagination = ({
    totalPages,
    currentPage,
    isLoading,
    setPage
}: PaginationProps) => {

    const [isPending, startTransition] = useTransition();


    const createRange = useMemo(() => {
        const range = [];
        const maxVisiblePages = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        for (let i = startPage; i <= endPage; i++) {
            range.push(i);
        }
        if (startPage > 1) {
            range.unshift('...');
            range.unshift(1);
        }
        if (endPage < totalPages) {
            range.push('...');
            range.push(totalPages);
        }
        return range;

    }, [totalPages,
        currentPage,
    ]);


    //handler 
    const handlePageChange = (e: MouseEvent, page: number | string) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof page === 'number') {
            if (page - 1 >= 0 && page - 1 < totalPages) {
                startTransition(() => {
                    setPage(page - 1);
                });
            }
        } else {
            startTransition(() => {
            setPage(currentPage);
            });
        }
    };


    return (
        <PaginationContainer>
            {createRange.map((page, index) => (
                <PageButton
                    key={index}
                    $isActive={currentPage + 1 === page}
                    $disabled={isLoading || isPending}
                    onClick={(e) => handlePageChange(e, page)}
                >
                    {page}
                </PageButton>
            ))}

        </PaginationContainer>
    )

}



