import { BACKEND_URL } from "@/app/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter, usePathname } from "next/navigation";
import { DeleteIcon, House, Search } from "lucide-react";
import { getDiagonalBounds } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BreedItem {
  breed: string;
  toggle: boolean;
}

import { Location } from "@/app/search/page";

export default function Filter({
  location,
  setLocation,
}: {
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
}) {
  const [breeds, setBreeds] = useState<BreedItem[]>([]);
  const [sortAsc, setSortAsc] = useState<string>("asc");
  const [zipCode, setZipCode] = useState<string>("");
  const [sortBy, setSortBy] = useState("breed");
  const [zipError, setZipError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const [selectedBreeds, setSelectedBreeds] = useState<Set<string>>(
    () => new Set() // lazy init avoids work on every render
  );

  const [selectedZipCodes, setSelectedZipCodes] = useState<Set<number>>(
    () => new Set() // lazy init avoids work on every render
  );

  useEffect(() => {
    const fetchBreeds = async () => {
      const response = await axios.get(`${BACKEND_URL}/dogs/breeds`, {
        withCredentials: true,
      });

      const data = response.data;
      const breedList: BreedItem[] = data.map((breed: string) => ({
        breed,
        toggle: false,
      }));

      setBreeds(breedList);
    };
    fetchBreeds();
  }, []);

  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);

    qs.delete("breeds");

    [...selectedBreeds].forEach((b) => qs.append("breeds", b));

    router.replace(`${pathname}?${qs.toString()}`, { scroll: false });
  }, [selectedBreeds, pathname, router]);

  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);

    qs.delete("sort");

    qs.append("sort", `${sortBy}:${sortAsc}`);

    router.replace(`${pathname}?${qs.toString()}`, { scroll: false });
  }, [sortBy, sortAsc, pathname, router]);

  // Toggle Breed Click
  const filterByBreed = (e: React.MouseEvent<HTMLButtonElement>) => {
    const breed = e.currentTarget.value;

    setSelectedBreeds((prev) => {
      const next = new Set(prev);
      next.has(breed) ? next.delete(breed) : next.add(breed);
      return next;
    });
  };

  // Filter the Page with new set of Zip Codes
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);

    qs.delete("zipCodes");

    [...selectedZipCodes].forEach((z) => qs.append("zipCodes", String(z)));

    router.replace(`${pathname}?${qs.toString()}`, { scroll: false });
  }, [selectedZipCodes, pathname, router]);

  // Get Zip Codes Close to the Client
  const getLocation = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obtaining location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );

      const box = getDiagonalBounds(location.lat, location.lon, 10);

      const zip_response = await axios.post(
        `${BACKEND_URL}/locations/search`,
        {
          geoBoundingBox: {
            top_left: box.topLeft,
            bottom_right: box.bottomRight,
          },
        },
        {
          withCredentials: true,
        }
      );

      const zipCodes: number[] = zip_response.data.results.map((item: any) =>
        Number(item.zip_code)
      );

      const allNumbers = zipCodes.every(
        (z) => typeof z === "number" && Number.isFinite(z)
      );

      console.log(allNumbers);

      setSelectedZipCodes((prevSet) => new Set([...prevSet, ...zipCodes]));
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleChangeZipCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Remove non-digit characters
    const numericValue = value.replace(/\D/g, "");

    setZipCode(numericValue);

    if (numericValue.length <= 5) setZipError("");
    if (numericValue.length > 5) setZipError("Zip Code must be only 5 digits");
  };

  const addZipCode = () => {
    if (zipCode.length !== 5) {
      setZipError("ZIP code must be exactly five digits");
      return;
    }
    const newZipCode = Number(zipCode);

    setSelectedZipCodes((prev) => {
      const next = new Set(prev);
      next.add(newZipCode); // Adds the ZIP code; if it already exists, Set ensures uniqueness
      return next;
    });

    setZipCode("");
    setZipError(null);
  };

  const deleteZipCode = (zip: number) => {
    setSelectedZipCodes((prevSet) => {
      const nextSet = new Set(prevSet);
      nextSet.delete(zip);
      return nextSet;
    });
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-2 mb-5">
        <div>
          <div className="font-bold text-lg">Sort</div>
          <div className="my-5">
            <Select defaultValue="breed" onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breed">Breed</SelectItem>
                <SelectItem value="age">Age</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="my-5">
            <Select defaultValue="asc" onValueChange={setSortAsc}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">A-Z</SelectItem>
                <SelectItem value="desc">Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <div className="font-bold text-lg my-2">Search</div>
          <div>
            <Input
              type="text"
              value={zipCode}
              onChange={handleChangeZipCode}
              placeholder="Enter ZIP code to search"
              maxLength={6}
              inputMode="numeric"
              pattern="\d*"
              className="bg-white my-2"
            />
            {zipError && (
              <p className="text-red-500 text-xs my-2">{zipError}</p>
            )}
            <div className="flex-col gap-2">
              <div className="relative group inline-block w-full my-2">
                <button
                  type="button"
                  onClick={addZipCode}
                  className=" mx-auto w-4/5 bg-[#2398f7] hover:bg-blue-500 text-white py-2 px-4 rounded-md overflow-hidden"
                >
                  {/* keeps content clipped while we slide */}
                  <div className="relative h-6">
                    {/* “Search” slides out to the right on hover */}
                    <span className="absolute inset-0 flex items-center tracking-tight text-pretty justify-center transition-transform duration-500 group-hover:translate-x-full">
                      Search
                    </span>

                    {/* 📍 slides in from the left on hover */}
                    <span className="absolute inset-0 flex items-center  justify-center transition-transform duration-500 -translate-x-full group-hover:translate-x-0">
                      <Search />
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="flex-col gap-2">
              <div className="relative group inline-block w-full my-2">
                <button
                  type="button"
                  onClick={getLocation}
                  className="mx-auto w-4/5 bg-[#2398f7] hover:bg-blue-500 text-white py-2 px-4 rounded-md overflow-hidden"
                >
                  {/* keeps content clipped while we slide */}
                  <div className="relative h-6">
                    {/* Pets Near Me slides out to the right on hover */}
                    <span className="absolute inset-0 tracking-tight text-pretty flex items-center justify-center transition-transform duration-500 group-hover:translate-x-full">
                      Pets Near Me
                    </span>

                    {/*  slides in from the left on hover */}
                    <span className="absolute inset-0 flex items-center justify-center transition-transform duration-500 -translate-x-full group-hover:translate-x-0">
                      <House />
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          {selectedZipCodes.size > 0 && (
            <div>
              <div className="font-light text-md">Selected ZIP Codes:</div>
              <div className="flex flex-col gap-1">
                {[...selectedZipCodes].map((zip) => (
                  <Badge key={zip} variant={"secondary"}>
                    {zip}{" "}
                    <Button
                      key={zip}
                      aria-label={`remove ${zip}`}
                      onClick={() => deleteZipCode(zip)}
                      variant={"ghost"}
                    >
                      <DeleteIcon />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="font-bold text-lg my-2">Breeds</div>
        <div className="flex flex-col text-sm h-[65vh] overflow-y-auto border-2 rounded-xl">
          {breeds.map((item, index) => (
            <Button
              key={item.breed}
              value={item.breed}
              className={`p-2 px-4 text-center shadow rounded-none ${
                selectedBreeds.has(item.breed)
                  ? "bg-blue-300 text-white hover:bg-blue-100"
                  : "bg-white text-[#2398f7] hover:bg-white"
              }`}
              onClick={filterByBreed}
              variant={"ghost"}
            >
              {item.breed}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
