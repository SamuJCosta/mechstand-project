import Navbar from "../../components/domains/cliente/homepage/navbar";

export default function Layout({ children }: Readonly< { children: React.ReactNode }>) {
  return (
    <main className="font-work-sans">
        <Navbar />
        {children}
    </main>
    )
}