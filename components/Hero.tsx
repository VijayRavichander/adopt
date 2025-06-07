import { Dog } from "@/app/search/page";
import { useFavoriteDogs } from "@/hooks/favorites";
import { Button } from "./ui/button";
import Link from "next/link";
import DogCard from "./OverlayCard";


export default function Hero({ dogs }: { dogs: Dog[] }) {

  const { favorites, toggle } = useFavoriteDogs();

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl">
        {dogs.map((dog, index) => (
          <div
            key={dog.id}
            className={`border-red-200 border-0 p-2 text-center text-gray-800 ${
              favorites.has(dog.id) ? "" : ""
            }`}
          >
             <DogCard dog = {dog} toggle={toggle} favorites = {favorites} />
          </div>
        ))}
      </div>
    </div>
  );
}
