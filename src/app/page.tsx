import { Header } from "../../components/header";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-[#72BCA5] to-[#101A16] h-screen w-full flex flex-col items-center align-middle">
      <Header />

      <div className="h-36 bg-[#F1AE2B] mt-20 w-72 rounded-3xl shadow-black shadow-md border-2 border-black text-center flex flex-col justify-around items-center">
        <p className="text-md font-bold text-shadow">
          No tenes ningun ingrediente agregado
        </p>

        <button className="bg-[#BC0B27] w-fit p-3 rounded-full shadow-md shadow-black border-2 border-black hover:bg-[#500510] hover:transition-color duration-300 font-primary text-xl">
          Agregar
        </button>
      </div>
    </div>
  );
}
