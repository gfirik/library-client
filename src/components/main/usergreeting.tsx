import { useTelegram } from "@/context/telegram";
import { FaTelegram } from "react-icons/fa";

const ForNonTelegramUsers: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center space-y-2 p-4 bg-gray-100 rounded-lg shadow-md">
      <span className="text-gray-700 text-base font-medium">
        Use the app via Telegram to access full features.
      </span>
      <a
        href="https://t.me/ilm_library_bot"
        className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTelegram size={24} />
        <span className="ml-2 font-semibold">Open in Telegram</span>
      </a>
    </div>
  );
};

const UserGreeting: React.FC = () => {
  const { isTelegramWebApp, username } = useTelegram();

  return (
    <div className="text-xl w-full max-w-2xl mb-8">
      {isTelegramWebApp ? (
        username ? (
          <span className="font-bold">Salom, {username}!</span>
        ) : (
          <ForNonTelegramUsers />
        )
      ) : (
        <ForNonTelegramUsers />
      )}
    </div>
  );
};

export default UserGreeting;
