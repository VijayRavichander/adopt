"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import Hero from "@/components/Hero";
import Filter from "@/components/Filter";
import PaginationComp from "@/components/Pagination";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dog } from "lucide-react";

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface Location {
    lat: number;
    lon: number
}

import { Suspense } from 'react'

export default function Search() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<Location>({ lat: 0, lon: 0 });
  const [total, setTotal] = useState(0);
  const [filterHide, setFilterHide] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const params = new URLSearchParams(searchParams.toString());
        const query = params.toString();

        if (!query || params.get("size") !== "20") {
          router.replace(`${pathname}?sort=breed:asc&size=20&from=0`, {
            scroll: false,
          });
          return;
        }

        const searchRes = await axios.get(
          `${BACKEND_URL}/dogs/search?${query}`,
          { withCredentials: true }
        );
        setTotal(searchRes.data.total);
        const ids = searchRes.data.resultIds as string[];

        const detailRes = await axios.post(`${BACKEND_URL}/dogs`, ids, {
          withCredentials: true,
        });
        setDogs(detailRes.data);

        setIsLoading(false);
      } catch {
        router.push("/");
        alert("Something went wrong! Try again.");
      }
    };
    fetchDogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-300 to-white/40">
        <p className="text-2xl tracking-tight">
          Getting you to a special place…
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-300 to-white/40">
      {/* NavBar */}
      <div className="flex items-center justify-around  pb-5 pt-3 ">
        <header className="sticky top-0 z-50 flex min-w-screen justify-center  py-5">
          <nav
            className="mx-4 mt-4 flex w-full max-w-5xl items-center
                   justify-between gap-4
                   rounded-full px-6 py-2
                   bg-white/90 backdrop-blur-3xl shadow-lg
                   ring-1 ring-white/40"
          >
            <p className="text-xl sm:text-3xl font-medium tracking-tight text-black/90">
            <Link href="/search">
              <Dog className="inline h-8 w-8 sm:h-10 sm:w-10" /> Adopt
            </Link>
            </p>

            <div className="flex space-x-4">
              <Link href="/match">
                <Button
                  variant="ghost"
                  className="text-xl sm:text-xl hover:bg-transparent hover:underline"
                >
                  Favs
                </Button>
              </Link>
              <Button
                variant="ghost"
                className={`text-xl hover:bg-transparent hover:underline ${filterHide ? "" : "underline"}`}
                onClick={() => setFilterHide((v) => !v)}
              >
                Filter
              </Button>
            </div>
          </nav>
        </header>
      </div>

      {/* Main Section */}
      <div className="relative flex flex-1 sm:overflow-hidden ">
        {/* ▶ Filter Sidebar */}
        <div
          className={`absolute left-0 top-0 h-full w-[250px] p-4
                      transition-transform duration-500 ease-in-out 
                      ${
                        filterHide
                          ? "-translate-x-full opacity-0"
                          : "translate-x-0 opacity-100"
                      }`}
        >
          <Filter
            location={location}
            setLocation={setLocation}
          />
        </div>

        <div
          className={`flex-1 p-6 transition-all duration-1000 ease-in-out
                      ${
                        filterHide
                          ? "max-w-5xl mx-auto" // filter hidden → center content
                          : "ml-[250px]"
                      }                    // filter shown  → shift right 250 px
          `}
        >
          {dogs.length > 0 ? (
            <div className={` ${filterHide ? "" : "hidden"} sm:block`}>
              <Hero dogs={dogs} />
              <div className="mt-5 mb-20">
                <PaginationComp totalResults={total} />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center text-center text-gray-600 text-lg font-medium p-4">
              {"Sorry! We couldn’t find any matches for your search."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
