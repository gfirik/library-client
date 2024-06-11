import { useTelegram } from "@/context/telegram";

const UserGreeting = () => {
  const { isTelegramWebApp, username } = useTelegram();

  return (
    <div className="text-lg mb-4">
      {isTelegramWebApp
        ? username
          ? `Hello, ${username}!`
          : "Use the app via Telegram to access full features."
        : "Use the app via Telegram to access full features."}
    </div>
  );
};

export default UserGreeting;
