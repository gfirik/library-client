"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/sidebar";
import BooksPage from "@/app/admin/bookspage";
import MainDashboard from "@/app/admin/mainpage";
import UsersPage from "./userspage";

const AdminClientPage = ({ email }: { email: string }) => {
  const [selectedTab, setSelectedTab] = useState("main");

  const renderContent = () => {
    switch (selectedTab) {
      case "main":
        return <MainDashboard />;
      case "users":
        return <UsersPage />;
      case "books":
        return <BooksPage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar
        email={email}
        onTabSelect={setSelectedTab}
        selectedTab={selectedTab} // Pass the selected tab
      />
      <div className="flex-1 p-6">{renderContent()}</div>
    </div>
  );
};

export default AdminClientPage;
