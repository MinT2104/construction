import { Roboto_Condensed } from "next/font/google";
import "@/app/(main)/globals.css";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-roboto-condensed",
});
export const metadata = {
  title: "Quản trị viên",
  description: "Quản trị viên",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
