import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen gap-8">
      <div className="w-full fixed bg-[url('/banner.png')] bg-no-repeat bg-cover bg-center border border-black min-h-[28vh] text-[#eee] text-left pl-[5%] pt-[1%]">
      <h1 className="text-4xl font-bold font-[family-name:var(--font-geist-sans)]">Asteroid Finder</h1>
      <p className="py-4 w-[250px] text-lg font-[family-name:var(--font-geist-sans)]">Explore asteroid by discovery or first observation date</p>
      </div>

      <div className="min-h-[65vh] mt-6 flex flex-row items-center justify-center gap-16 p-8 font-[family-name:var(--font-geist-mono)]">

      <div className="flex flex-col items-center justify-center gap-4">
      <div className="h-[30px]">Input</div>
      <div className="py-4 px-4 border border-[#eee] rounded-xl shadow-sm">Result</div>
      
      </div>

      <div className="mt-12 py-4 px-4 border border-[#eee] rounded-xl shadow-sm">second div right</div>
      </div>
    </div>
  );
}
