'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function PaginationControls(props: PaginationControlsProps) {
  const currentPage = Number(props.currentPage)
  const totalPages = Number(props.totalPages)
  const totalItems = Number(props.totalItems)
  const itemsPerPage = Number(props.itemsPerPage)
  const onPageChange = props.onPageChange
  const getPageNumbers = () => {
    const pages: (number | '...')[] = []

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        )
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        )
      }
    }

    return pages
  }

  const handleChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  // start & end index calculate
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex  items-center justify-between w-full mt-4 font-sans">
      {/* Left side: results info */}
      <p className="text-base text-muted-foreground px-6 min-w-[300px]">
        Showing {startIndex} to {endIndex} of {totalItems} results
      </p>

      {/* Right side: pagination */}
      <Pagination className="justify-end px-5">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handleChange(currentPage - 1)
              }}
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>

          {getPageNumbers().map((page, i) => (
            <PaginationItem key={i}>
              {page === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault()
                    handleChange(page)
                  }}
                  className="text-primary hover:text-primary/80"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handleChange(currentPage + 1)
              }}
              aria-disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
