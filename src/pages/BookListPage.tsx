import { useBooks } from "../hooks/useBooks";
import BookCard from "../components/BookCard";

function BookListPage() {
  // TODO: Take book list data and render here
  const {data, isPending, isError, error, refetch, isFetching} = useBooks();

  if (isError)
    return (
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
    );

  // TODO: Loading UI
  if (isPending) {
    return (
      <div className="p-6">
        <div className="skeleton h-10 w-72 mx-auto mb-6"></div>
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
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-center text-4xl font-bold mb-6">
        Gutendex Books ({data.count.toLocaleString()})
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.results.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

export default BookListPage;
