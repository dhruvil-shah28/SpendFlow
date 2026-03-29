import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "SpendFlow | Reinventing Reimbursements",
    description: "Modern expense management for the modern enterprise.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
                <Toaster position="top-right" />
                <Script
                    src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"
                    strategy="afterInteractive"
                />
            </body>
        </html>
    );
}
