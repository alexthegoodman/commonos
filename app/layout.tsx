import InnerLayout from "@/components/core/nav/InnerLayout";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "CommonOS",
  description: "Control a suite of apps with a single prompt.",
  generator: "Next.js",
  applicationName: "CommonOS",
  referrer: "origin-when-cross-origin",
  keywords: ["AI", "OS", "Semi-Automatic"],
  authors: [{ name: "Common", url: "https://madebycommon.com" }],
  creator: "Common",
  publisher: "Common",
  // formatDetection: {
  //   email: false,
  //   address: false,
  //   telephone: false,
  // },
  openGraph: {
    title: "CommonOS",
    description: "Control a suite of apps with a single prompt.",
    url: "https://commonos.app",
    siteName: "CommonOS",
    // images: [
    //   {
    //     url: 'https://nextjs.org/og.png', // Must be an absolute URL
    //     width: 800,
    //     height: 600,
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CommonOS",
    description: "Control a suite of apps with a single prompt.",
    // siteId: '1467726470533754880',
    creator: "@alexthegoodman",
    // creatorId: '1467726470533754880',
    // images: ['https://nextjs.org/og.png'], // Must be an absolute URL
  },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{
          margin: 0,
        }}
      >
        <InnerLayout>{children}</InnerLayout>
        <Analytics />
      </body>
    </html>
  );
}
