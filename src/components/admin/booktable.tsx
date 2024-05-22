import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

const books = [
  {
    id: 1,
    title: "Book 1",
    author: "Author 1",
    published: "2020",
    status: "Available",
    remted_ny: "",
    images: [
      "somelink or file name in the supabase",
      "somelink or file name in the supabase",
      "somelink or file name in the supabase",
    ],
  },
  {
    id: 2,
    title: "Book 2",
    author: "Author 2",
    published: "2021",
    status: "Rented",
    rented_ny: "3435353535",
    images: [
      "somelink or file name in the supabase",
      "somelink or file name in the supabase",
      "somelink or file name in the supabase",
    ],
  },
];

const BookTable = () => {
  // const fetchBooks = async () => {
  //   const { data, error } = await supabase.from("books").select("*");
  //   if (error) {
  //     console.error(error.message);
  //     return [];
  //   }
  //   return data;
  // };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Published</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Rented by</TableCell>
            <TableCell>Images</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.id}</TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.published}</TableCell>
              <TableCell>{book.status}</TableCell>
              <TableCell>{book.rented_ny}</TableCell>
              <TableCell>{book.images.length}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2">
                  Edit
                </Button>
                <Button variant="outline" color="red">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookTable;
