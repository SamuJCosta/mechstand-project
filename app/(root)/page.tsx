import Image from "next/image";
import { Poppins, Smooch_Sans } from "next/font/google";

// Definição das fontes
const poppins = Poppins({
  subsets: ["latin"],
  weight: "800", // Extra Bold
});

const smoochSans = Smooch_Sans({
  subsets: ["latin"],
  weight: "400", // Regular
});

export default function Home() {
  return (
    <section className="relative w-full h-screen bg-[#1C1C1C] text-white flex flex-col justify-center items-start px-16">
      {/* Título e Slogan */}
      <div className="max-w-2xl ml-10 mt-5">
        <h1 className={`${poppins.className} text-7xl font-extrabold`}>
          Mechstand
        </h1>
        <p className={`${smoochSans.className} mt-18 text-5xl mt-4`}>
          A revolução da manutenção
        </p>
        <p className={`${smoochSans.className} text-5xl mt-4`}>
          automotiva começa aqui!
        </p>
      </div>

      {/* Imagem do Carro */}
      <div className="absolute bottom-0 right-0 w-1/2 ">
        <Image 
          src="/Carro.png" 
          alt="Carro"
          width={1000}
          height={1000}
          className="object-contain"
        />
      </div>
    </section>
  );
}
