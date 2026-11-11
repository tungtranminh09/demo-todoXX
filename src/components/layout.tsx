import React, { FC } from "react";
import { Route, Routes } from "react-router";
import { Box } from "zmp-ui";
import TodoPage from "pages/todo";
import { getSystemInfo } from "zmp-sdk";

if (import.meta.env.DEV) {
  document.body.style.setProperty("--zaui-safe-area-inset-top", "0px");
} else if (getSystemInfo().platform === "android") {
  const statusBarHeight =
    window.ZaloJavaScriptInterface?.getStatusBarHeight() ?? 0;
  const androidSafeTop = Math.round(statusBarHeight / window.devicePixelRatio);
  document.body.style.setProperty(
    "--zaui-safe-area-inset-top",
    `${androidSafeTop}px`
  );
}

export const Layout: FC = () => {
  return (
    <Box
      flex
      flexDirection="column"
      className="h-screen w-full max-w-[480px] mx-auto bg-white md:shadow-lg"
    >
      <Box className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<TodoPage />}></Route>
        </Routes>
      </Box>
    </Box>
  );
};
