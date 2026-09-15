import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"Henil & Vidhi | 1st & 2nd February 2027",description:"Join Henil Shah and Vidhi Mehta for their wedding celebrations on 1st & 2nd February 2027 at Waves Club Resort, Vadodara.",icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
