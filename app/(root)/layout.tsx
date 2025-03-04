import Navbar from "../components/navbar";
import { Poppins, Smooch_Sans } from "next/font/google";

// Importando as fontes específicas
const poppins = Poppins({
  subsets: ["latin"],
  weight: "800", // Extra Bold
});

const smoochSans = Smooch_Sans({
  subsets: ["latin"],
  weight: "400", // Regular
});

export default function Layout({ children }: Readonly< { children: React.ReactNode }>) {
  return (
    <main className="font-work-sans">
        <Navbar />
        {children}
    </main>
    )
}