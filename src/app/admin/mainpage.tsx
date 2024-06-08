// import { useEffect, useState } from "react";
// import { supabase } from "@/utils/supabase/client";

// const MainDashboard = () => {
//   const [numUsers, setNumUsers] = useState(0);
//   const [numTotalBooks, setNumTotalBooks] = useState(0);
//   const [numAvailableBooks, setNumAvailableBooks] = useState(0);
//   const [numRentedBooks, setNumRentedBooks] = useState(0);
//   const [numUsersWhoRentedBooks, setNumUsersWhoRentedBooks] = useState(0);

//   useEffect(() => {
//     async function fetchStats() {
//       try {
//         // Fetch number of users
//         const { data: usersData, error: usersError } = await supabase
//           .from("users")
//           .select("id");
//         if (usersError) throw usersError;
//         setNumUsers(usersData.length);

//         // Fetch number of total books
//         const { data: booksData, error: booksError } = await supabase
//           .from("books")
//           .select("id");
//         if (booksError) throw booksError;
//         setNumTotalBooks(booksData.length);

//         // Fetch number of available books
//         const { data: availableBooksData, error: availableBooksError } =
//           await supabase.from("books").select("id").eq("status", "Available");
//         if (availableBooksError) throw availableBooksError;
//         setNumAvailableBooks(availableBooksData.length);

//         // Fetch number of rented books
//         const { data: rentedBooksData, error: rentedBooksError } =
//           await supabase.from("books").select("id").eq("status", "Rented");
//         if (rentedBooksError) throw rentedBooksError;
//         setNumRentedBooks(rentedBooksData.length);

//         // Fetch number of users who rented books
//         const {
//           data: usersWhoRentedBooksData,
//           error: usersWhoRentedBooksError,
//         } = await supabase
//           .from("users")
//           .select("id")
//           .not("rented_books", "is", null);
//         if (usersWhoRentedBooksError) throw usersWhoRentedBooksError;
//         setNumUsersWhoRentedBooks(usersWhoRentedBooksData.length);
//       } catch (error) {
//         console.error("Error fetching stats:", error);
//       }
//     }

//     fetchStats();
//   }, []);

//   return (
//     <div>
//       <h2 className="text-lg font-semibold mb-2">Statistics</h2>
//       <p>Total Users: {numUsers}</p>
//       <p>Total Books: {numTotalBooks}</p>
//       <p>Available Books: {numAvailableBooks}</p>
//       <p>Rented Books: {numRentedBooks}</p>
//       <p>Users Who Rented Books: {numUsersWhoRentedBooks}</p>
//     </div>
//   );
// };

// export default MainDashboard;

export default function MainDashboard() {
  return <div>maindashboard</div>;
}
