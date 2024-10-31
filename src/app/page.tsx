import Image from "next/image";
import { Header } from "../../components/header";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-[#72BCA5] to-[#101A16] h-screen w-full flex flex-col items-center align-middle">
      <Header />
      <p>Hola</p>
    </div>
  );
}
