import Image from "next/image";

export default function Home() {
  return (
    <section className="relative w-full h-screen bg-[#1C1C1C] text-white flex flex-col justify-center items-center md:items-start px-6 md:px-16">
      {/* Título e Slogan */}
      <div className="text-center md:text-left max-w-2xl mt-5">
        <h1 className="font-poppins text-5xl md:text-7xl font-extrabold">
          Mechstand
        </h1>
        <p className="font-smooch-sans mt-4 text-3xl md:text-5xl">
          A revolução da manutenção
        </p>
        <p className="font-smooch-sans text-3xl md:text-5xl mt-2">
          automotiva começa aqui!
        </p>
      </div>

      {/* Imagem do Carro */}
      <div className="absolute bottom-0 right-0 w-[90%] md:w-1/2 max-w-lg">
        <Image
          src="/Carro.png"
          alt="Carro"
          width={1000}
          height={1000}
          className="object-contain w-full"
          priority
        />
      </div>
    </section>
  );
}
