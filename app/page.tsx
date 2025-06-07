import { LoginForm } from "@/components/LoginForm";
import { Dog } from "lucide-react";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-200 to-white">
      <div className="flex items-center justify-around bg-gradient-to-b from-blue-300 to-blue-200 pb-5 pt-3">
        <p className="mt-2 text-lg font-medium tracking-tight text-black sm:text-5xl">
        <Dog className="inline w-12 h-12" /> Adopt 
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="flex z-30">
          <LoginForm />
        </div>
      </div>

      <div>
        <div className="hidden lg:block">
          <div className="absolute inset-0 overflow-hidden contain-paint">
            <div className="absolute inset-[0.5rem] rounded-[12rem] bg-white/2 shadow-[0_0_40px_rgba(173,216,255,0.5)] blur-[4px]"></div>
            <div className="absolute inset-[3rem] rounded-[12rem] bg-white/2  shadow-[0_0_30px_rgba(173,216,255,0.4)] blur-[3px]"></div>
            <div className="absolute inset-[6rem] rounded-[12rem] bg-white/2 shadow-[0_0_20px_rgba(173,216,255,0.3)] blur-[2px]"></div>
            <div className="absolute inset-[10rem] rounded-[8rem] bg-white/2 shadow-[inset_0_0_30px_rgba(255,255,255,0.4)] blur-[1px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
