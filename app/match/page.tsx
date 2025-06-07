"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { useFavoriteDogs } from "@/hooks/favorites";
import DogCard from "@/components/OverlayCard";
import { Dog as DogIcon, PawPrint } from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { DogWithLocation, Dog, Location} from "../search/page";


export default function FavoritesPage() {

  const [matchId, setMatchId] = useState<string>();
  const [favDogs, setFavDogs] = useState<DogWithLocation[]>();
  const { favorites, toggle } = useFavoriteDogs();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fire = useCallback(() => {
    confetti({
      particleCount: 220,
      startVelocity: 30,
      spread: 360,
      origin: { y: 0 },
    });
  }, []);

  useEffect(() => {
    try {
      const fetchFavs = async () => {
        const favs = Array.from(favorites);

        if (favs.length > 0) {
          const dog_data_response = await axios.post(
            `${BACKEND_URL}/dogs`,
            favs,
            {
              withCredentials: true,
            }
          );
          const detailedDogs: Dog[] = dog_data_response.data;
          const uniqueZips = [...new Set(detailedDogs.map((d) => d.zip_code))];
  
          const chunked = (arr: string[], size: number) =>
            Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
              arr.slice(i * size, i * size + size)
            );
  
          const locationPromises = chunked(uniqueZips, 100).map((chunk) =>
            axios.post(`${BACKEND_URL}/locations`, chunk, {
              withCredentials: true,
            })
          );
  
          const locationResponses = await Promise.all(locationPromises);
          const locations: Location[] = locationResponses.flatMap((r) => r.data);
  
          const zipToLocation = new Map(
            locations.map((loc) => [loc.zip_code, loc] as const)
          );
  
          const dogsWithLocation: DogWithLocation[] = detailedDogs.map((dog) => ({
            ...dog,
            location: zipToLocation.get(dog.zip_code),
          }));
  
          setFavDogs(dogsWithLocation);
        }
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 2000); // 2-second delay
    
        return () => clearTimeout(timer);
      };
      fetchFavs();
    } catch (err) {
      console.error("Failed to load favourites", err);
    }
  }, [favorites]);

  if (isLoading == true) {
    return (
<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-300 to-white/40">
  <p className="text-2xl tracking-tight">
    {"Let's find a forever home for someone special…"}
  </p>
  <span className="mt-4 text-sm italic text-gray-500">
    (Psst... I might have added a tiny delay so you have time to read this 😉)
  </span>
</div>
    );
  }

  const getMatch = async () => {
    const response = await axios.post(
      `${BACKEND_URL}/dogs/match`,
      Array.from(favorites),
      { withCredentials: true }
    );
    const match = response.data.match;
    setMatchId(match);
    fire();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-300 to-white/40 ">
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
              <DogIcon className="inline h-8 w-8 sm:h-10 sm:w-10" /> Adopt
          </Link>
          </p>

          <div className="flex space-x-4">
            <Link href="/search">
              <Button
                variant="ghost"
                className="text-lg sm:text-2xl hover:bg-transparent hover:underline"
              >
                Search
              </Button>
            </Link>
          </div>
        </nav>
      </header>
      {favorites.size === 0 ? (
        <div className="flex flex-col flex-1 p-6 bg-gradient-to-b items-center justify-center">
          <div className="text-lg font-medium mb-2 items-center">
            {`You don't have any favorites yet!`}
          </div>
          <div className="text-lg font-medium mb-2 items-center">
            {
              `Head over to the search page to find some dogs you'd love to bring home.`
            }
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center ">
            <div>
              <div className="flex-col gap-2">
                <div className="relative group inline-block w-full my-2">
                  <button
                    type="button"
                    onClick={getMatch}
                    className="w-fit bg-white  hover:bg-blue-400 text-black py-2 px-3 rounded-md overflow-hidden"
                  >
                    {/* keeps content clipped while we slide */}
                    <div className="relative h-6">
                      {/* Pets Near Me slides out to the right on hover */}
                      <span className="font-medium inset-0 flex items-center justify-center transition-transform duration-500 group-hover:translate-x-full">
                        Let's match someone to your home
                      </span>

                      {/*  slides in from the left on hover */}
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-500 -translate-x-full group-hover:translate-x-0">
                        <PawPrint />
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center my-5">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl mx-4">
            {favDogs &&
              favDogs.map((dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  favorites={favorites}
                  toggle={toggle}
                  triggerOpen={dog.id === matchId}
                />
              ))}
          </div>
          </div>

        </>
      )}
    </div>
  );
}
