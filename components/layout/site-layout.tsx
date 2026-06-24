import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
