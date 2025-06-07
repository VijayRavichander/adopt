"use client";

import React, { useEffect, useState } from "react";
import { Dog } from "@/app/search/page";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Heart, MapPin } from "lucide-react";
import { toast } from "sonner";

interface DogCardProps {
  dog: Dog;
  favorites: Set<string>;
  toggle: (id: string) => void;
  triggerOpen?: boolean;
}

export default function DogCard({
  dog,
  favorites,
  toggle,
  triggerOpen = false,
}: DogCardProps) {
  const [open, setOpen] = useState(false);

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const liked = favorites.has(dog.id);
    toast(liked ? "Removed from your Favs" : "Added to your Favs");
    toggle(dog.id);
  };

  useEffect(() => {
    if (triggerOpen) setOpen(true);
  }, [triggerOpen]);

  return (
    <>
      {/* Minimal card – photo + name only */}
      <Card
        className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/80 rounded-none"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div className="relative overflow-hidden h-48">
          <img
            src={dog.img}
            alt={dog.name}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300 px-2"
          />
          {/* heart badge */}
          <div className="absolute top-4 right-4">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full backdrop-blur-sm bg-white/80 text-cyan-600"
              onClick={handleFavClick}
            >
              <Heart
                size={18}
                className={
                  favorites.has(dog.id) ? "fill-cyan-600" : "fill-transparent"
                }
              />
            </Button>
          </div>
        </div>

        <CardHeader>
          <CardTitle className="text-xl font-semibold">{dog.name}</CardTitle>
        </CardHeader>
      </Card>

      {/* Detail dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{dog.name}</DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-base">
              <MapPin className="w-4 h-4" /> {dog.zip_code}
            </DialogDescription>
          </DialogHeader>

          <img
            src={dog.img}
            alt={dog.name}
            className="w-full max-h-[50vh] object-contain rounded-lg mb-6"
          />

          <div className="space-y-4">
            <p>
              <span className="font-semibold">Breed:</span> {dog.breed}
            </p>
            <p>
              <span className="font-semibold">Age:</span> {dog.age}{" "}
              {dog.age === 1 ? "year" : "years"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
