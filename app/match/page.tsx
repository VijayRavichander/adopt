"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { useFavoriteDogs } from "@/hooks/favorites";
import DogCard from "@/components/OverlayCard";
import { PawPrint } from "lucide-react";
import confetti from "canvas-confetti";
import { DogWithLocation, Dog, Location } from "../search/page";
import AppHeader from "@/components/AppHeader";
import LoadingScreen from "@/components/LoadingScreen";
import AnimatedButton from "@/components/AnimatedButton";


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
    const fetchFavs = async () => {
      try {
        const favs = Array.from(favorites);

        if (favs.length > 0) {
          const dog_data_response = await axios.post(
            `${BACKEND_URL}/dogs`,
            favs,
            { withCredentials: true }
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
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load favourites", err);
        setIsLoading(false);
      }
    };

    fetchFavs();
  }, [favorites]);

  if (isLoading) {
    return <LoadingScreen message="Let's find a forever home for someone special…" />;
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-300 to-white/40">
      <AppHeader links={[{ href: "/search", label: "Search" }]} />
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
          <div className="flex flex-col items-center justify-center">
            <AnimatedButton
              onClick={getMatch}
              text="Let's match someone to your home"
              icon={<PawPrint />}
              variant="secondary"
            />
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
