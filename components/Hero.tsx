import { DogWithLocation } from "@/app/search/page";
import { useFavoriteDogs } from "@/hooks/favorites";
import DogCard from "./OverlayCard";

export default function Hero({ dogs }: { dogs: DogWithLocation[] }) {
  const { favorites, toggle } = useFavoriteDogs();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl">
      {dogs.map((dog) => (
        <div
          key={dog.id}
          className="border-red-200 border-0 p-2 text-center text-gray-800"
        >
          <DogCard dog={dog} toggle={toggle} favorites={favorites} />
        </div>
      ))}
    </div>
  );
}
