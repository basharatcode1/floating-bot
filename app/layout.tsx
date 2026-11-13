import "./globals.css";
import { ThemeProvider } from "@/app/ThemeContext";
import SmoothScroll from "@/app/components/SmoothScroll";
import { SignupProvider } from "@/app/components/auth/SignupContext";
import { AuthProvider } from "@/app/components/auth/AuthProvider";
import { SidebarProvider } from "@/app/components/SidebarContext";

import { Toaster } from "@/app/components/ui/toaster";

export const metadata = {
  title: "StaffSync — Find Top Tech Talent in 48 Hours",
  description:
    "Access a curated network of 10,000+ pre-vetted developers, designers, and product managers. Scale your team on-demand with StaffSync.",
  keywords: "staffing, hiring, developers, tech talent, remote teams, contract hiring",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('staffsync-dashboard-mode') || 'light';
                  document.documentElement.setAttribute('data-dashboard-theme', saved);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Toaster position="top-right" richColors closeButton />
        <SmoothScroll>
          <AuthProvider>
            <SignupProvider>
              <ThemeProvider>
                <SidebarProvider>{children}</SidebarProvider>
              </ThemeProvider>
            </SignupProvider>
          </AuthProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
