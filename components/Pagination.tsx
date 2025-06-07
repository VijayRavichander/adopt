import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "next/navigation";

const PAGE_SIZE = 20;

export default function PaginationComp({
  totalResults,
}: {
  totalResults: number;
}) {
  const totalPages = Math.ceil(totalResults / PAGE_SIZE);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const from = Number(searchParams.get('from'));

  const currentPage = Math.floor(from / PAGE_SIZE) + 1;
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  

  const linkForPage = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    const nextFrom = (page - 1) * PAGE_SIZE;

    params.set('from', String(nextFrom)); 

    const query = params.toString();
    const link = `${pathname}?${query}`;
    return link
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Prev  */}
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? linkForPage(currentPage - 1) : "#"}
            aria-disabled={currentPage === 1}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {/* NUMBERED BUTTONS */}
        {pageNumbers.map((page, i) =>
          page === "ellipsis" ? (
            <PaginationItem key={`e${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href={linkForPage(page)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        {/* NEXT */}
        <PaginationItem>
          <PaginationNext
            href={currentPage < totalPages ? linkForPage(currentPage + 1) : "#"}
            aria-disabled={currentPage === totalPages}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

/**
 * Return an array like [1, 'ellipsis', 4, 5, 6, 'ellipsis', 20]
 * so we only render a few neighbouring pages plus first/last.
 */
function getPageNumbers(
  current: number,
  total: number
): (number | "ellipsis")[] {
  const delta = 2; // how many neighbours to show
  const range: (number | "ellipsis")[] = [];

  // always include 1 and total
  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  // inject ellipsis where numbers are skipped
  return range.reduce<(number | "ellipsis")[]>((acc, num, idx) => {
    if (idx && typeof num === "number" && typeof acc[idx - 1] === "number") {
      if ((num as number) - (acc[idx - 1] as number) > 1) acc.push("ellipsis");
    }
    acc.push(num);
    return acc;
  }, []);
}
