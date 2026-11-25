
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Author {
    name: string;
}

interface Book {
    id: number;
    title: string;
    authors: Author[];
    download_count: number;
    formats: Record<string, string>;
    subjects?: string[];
    languages?: string[];
}

interface GutendexResponse {
    count: number;
    results: Book[];
}

export const useBooks = () => {
    return useQuery<GutendexResponse>({

        queryKey: ["books"],

        queryFn: async () => {
            const res = await fetch("https://gutendex.com/books/");
            if (!res.ok) throw new Error("ERROR");
            return res.json();
        },
        staleTime: 1000 * 60 * 3
    });
};

export const useBookDetail = (id: string | undefined) => {
    const queryClient = useQueryClient();
    return useQuery<Book>({
        queryKey: ["book", id],
        queryFn: async () => {
            try {
                const res = await fetch(`https://gutendex.com/books/${id}/`);
                if (res.ok) return await res.json();
            } catch (err) {
                console.warn("API error, reading from cache...", err);
            }
            const booksData = queryClient.getQueryData<GutendexResponse>(["books"]);
            const cached = booksData?.results.find(
                (b) => String(b.id) === String(id),
            );
            if (cached) return cached;
            throw new Error("ไม่สามารถดึงข้อมูลเล่มนี ้ได้");
        },
        initialData: () => {
            const booksData = queryClient.getQueryData<GutendexResponse>(["books"]);
            return booksData?.results.find((b) => String(b.id) === String(id));
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 10,
    });
};
