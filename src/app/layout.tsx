import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { serverSupabase } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { NextProvider } from "./provider/NextUIProvider";
import { QueryProvider } from "./provider/QueryProvider";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { USER_DATA_QUERY_KEY } from "@/query/user/userQueryKey";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "moremall",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setUser = async () => {
    const supabase = serverSupabase();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (!user || error) throw error;
    const { data: userData, error: userDataErr } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", String((user as User).id))
      .single();
    if (!userData || userDataErr) {
      console.log(userDataErr.message);
    } else {
      return userData;
    }
  };
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [USER_DATA_QUERY_KEY],
    queryFn: setUser,
  });

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextProvider>
          <QueryProvider>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <Suspense>
                <Navbar />
                {children}
                <Footer />
              </Suspense>
            </HydrationBoundary>
          </QueryProvider>
        </NextProvider>
      </body>
    </html>
  );
}
