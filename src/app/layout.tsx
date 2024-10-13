import type { Metadata } from "next";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import SiteNavbar from "@/components/SiteNavbar";
import { Box } from "@mui/material";

export const metadata: Metadata = {
  title: "Nextjs MUI Pagination",
  description: "Nextjs MUI Pagination Using Prisma with posgresql and swr",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <AppRouterCacheProvider>
          <SiteNavbar />
          <Box component={"main"} sx={{mt: 9}}>
            {children}
          </Box>
      </AppRouterCacheProvider>
      </body>
    </html>
  );
}
