type Pagination = {
  totalPages: number;
  totalCount: number;
  currentPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
};

function Pagination({
  totalPages,
  totalCount,
  currentPage,
  setPage,
  pageSize,
}: Pagination) {
  if (totalPages <= 1) return null;

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalCount);
  const getPageNumbers = (): (string | number)[] => {
    const pages = [];

    if (totalPages <= 5) {
      // Show all pages if 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Always add page 1
    pages.push(1);

    // Add dots after 1 if current page is far from start
    if (currentPage > 3) pages.push("...");

    // Add pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    console.log("start end--:", start, end);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add dots before last page if current page is far from end
    if (currentPage < totalPages - 2) pages.push("...");

    // Always add last page
    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-8">
      <p className="text-sm text-gray-500">
        Showing {from} - {to} of {totalCount} restaurants
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded border text-sm
            disabled:opacity-40 disabled:cursor-not-allowed
            hover:bg-gray-100 transition"
        >
          ← Previous
        </button>

        {getPageNumbers().map((page, index) =>
          typeof page === "string" && page === "..." ? (
            <span key={`dots-${index}`} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            typeof page === "number" && (
              <button
                key={page}
                onClick={() => setPage(page)}
                className={`w-9 h-9 rounded border text-sm transition
                  ${
                    currentPage === page
                      ? "bg-orange-500 text-white border-orange-500 font-bold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
              >
                {page}
              </button>
            )
          ),
        )}

        <button
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded border text-sm
            disabled:opacity-40 disabled:cursor-not-allowed
            hover:bg-gray-100 transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default Pagination;
