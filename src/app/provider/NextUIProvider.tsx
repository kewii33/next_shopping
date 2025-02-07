"use client";

import { NextUIProvider } from "@nextui-org/react";

export const NextProvider = ({ children }: { children: React.ReactNode }) => {
  return <NextUIProvider>{children}</NextUIProvider>;
};
