import Image from "next/image";
import Link from "next/link";
import { Image } from "next/image";
export default function Home() {
  return (
    <div className="min-h-[70vh]">
      <h1 className="text-center text-2xl font-bold mt-4 text-gray-900">Welcome to GrowDaily Where Little Wins Grow Big!</h1>
      <h2 className="text-center text-xl font-medium mt-4 text-gray-700">The simplest habit tracker for your very own use.</h2>
      <div className="flex flex-col justify-center items-center mt-8">
        <p className="w-[50%] text-slate-600 font-medium">Whether you&apos;re trying to drink more water, read every day, or finally stick to that workout routine, GrowDaily is here to cheer you on. Track your habits, build streaks, and watch your progress bloom — one day at a time. Lets grow something amazing, daily!
        </p>
        <Link href="/Dashboard">
          <button className="bg-green-600 w-2xs mt-8 cursor-pointer text-white h-12 px-4 rounded-4xl hover:bg-green-700 transition duration-300 font-medium">
            Start Tracking Now
          </button>
        </Link>
      </div>
      <div>
        <Image className="w-full h-50" src="https://thumb.ac-illust.com/8d/8d0d48a87debf8144ac14b7dae7362ec_t.jpeg" alt="" />
      </div>
    </div>
  );
}
