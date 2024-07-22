const NoTelegramUserId = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm mx-auto">
        <div className="flex flex-col items-center">
          <svg
            className="w-16 h-16 text-blue-500 mb-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zM9 15v-2h2v2H9zm1-3a1 1 0 110-2 1 1 0 010 2zm0-4a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
          <p className="text-lg font-semibold text-gray-800 mb-2">
            Please open this page via the Telegram app to place an order.
          </p>
          <p className="text-gray-600">
            Ensure you are accessing this link from within your Telegram
            application.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoTelegramUserId;
