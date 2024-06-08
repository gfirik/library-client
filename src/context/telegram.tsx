"use client";

import React, { createContext, useEffect, useState, useContext } from "react";

interface TelegramContextProps {
  isTelegramWebApp: boolean;
  username: string;
}

const TelegramContext = createContext<TelegramContextProps | undefined>(
  undefined
);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const initializeTelegram = () => {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        setIsTelegramWebApp(true);
        tg.ready();
        setUsername(tg.initDataUnsafe.user?.username);
      }
    };

    const handleScriptLoad = () => {
      initializeTelegram();
    };

    window.addEventListener("telegram-web-app-loaded", handleScriptLoad);

    return () => {
      window.removeEventListener("telegram-web-app-loaded", handleScriptLoad);
    };
  }, []);

  return (
    <TelegramContext.Provider value={{ isTelegramWebApp, username }}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error("useTelegram must be used within a TelegramProvider");
  }
  return context;
};
