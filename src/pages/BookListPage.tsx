import { useSearchParams } from "react-router";
import { useBooks } from "../hooks/useBooks";
import BookCard from "../components/BookCard";

const TOTAL_PAGES = 10;

function BookListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.min(Math.max(1, Number(searchParams.get("page")) || 1), TOTAL_PAGES);

  const setPage = (newPage: number) => {
    setSearchParams({ page: String(newPage) });
  };

  const { data, isPending, isError, error, refetch, isFetching } = useBooks(page);

  return (
    <div className="p-6">
      {isPending ? (
        <div className="skeleton h-10 w-72 mx-auto mb-6"></div>
      ) : (
        <h1 className="text-center text-4xl font-bold mb-6">
          Gutendex Books {data ? `(${data.count.toLocaleString()})` : ""}
        </h1>
      )}

      <div className="flex justify-center mb-6">
        <div className="join">
          <button
            className="join-item btn"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            «
          </button>
          {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`join-item btn ${page === n ? "btn-primary" : ""}`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          <button
            className="join-item btn"
            disabled={page === TOTAL_PAGES}
            onClick={() => setPage(page + 1)}
          >
            »
          </button>
        </div>
      </div>

      {isError && (
        <div role="alert" className="alert alert-error m-6">
          <span>{error.message}</span>
          <button
            className="btn btn-sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching && <span className="loading loading-spinner loading-xs"></span>}
            Retry
          </button>
        </div>
      )}

      {isPending && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card bg-base-100 shadow-md">
              <div className="skeleton h-72 w-full rounded-b-none"></div>
              <div className="card-body">
                <div className="skeleton h-5 w-full"></div>
                <div className="skeleton h-4 w-2/3"></div>
                <div className="skeleton h-6 w-24 ml-auto"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.results.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookListPage;