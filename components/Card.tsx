import { Button } from "@/components/ui/button";
import { Dog } from "@/app/search/page";
import { toast } from "sonner";

export default function DogCard({
  dog,
  toggle,
  favorites,
}: {
  dog: Dog;
  toggle: (id: string) => void;
  favorites: Set<string>;
}) {
  const favClick = () => {
    if (favorites.has(dog.id)) {
      toast("Removed to your Favs");
    } else {
      toast("Added to your Favs");
    }

    toggle(dog.id);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/80 dark:bg-black/10 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/20 dark:hover:shadow-slate-900/30">
        <img
          src={dog.img || "/placeholder.svg"}
          alt={`${dog.name} - ${dog.breed}`}
          width={300}
          height={200}
          className="w-full h-32 object-cover"
          style={{ aspectRatio: "300/200", objectFit: "cover" }}
        />
        <div className="p-6 space-y-2">
          <div className="text-xl font-semibold text-gray-900 dark:text-white">
            {dog.name}
          </div>
          <div className="text-md font-light text-gray-900 dark:text-slate-100">
            {dog.breed}
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-slate-300">
            <div className="flex items-center gap-1">
              <span className="font-normal">Zip:</span>
              <span>{dog.zip_code}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-normal">Age:</span>
              <span>
                {dog.age} {dog.age === 1 ? "year" : "years"}
              </span>
            </div>
          </div>
          <Button
            onClick={favClick}
            className="w-fit mt-2 text-xs bg-fuchsia-600 hover:bg-fuchsia-700 dark:bg-fuchsia-500 dark:hover:bg-fuchsia-600 text-white"
          >
            {favorites.has(dog.id) ? "Removed Favorites" : "Added Favorites"}
          </Button>
        </div>
      </div>
    </div>
  );
}
