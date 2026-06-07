import { Link } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState, type ChangeEvent } from "react";
import { useAuth } from "../context/useAuth";
import { RatingStars } from "../pages/Utils";
import Pagination from "./Pagination";
import { SkeletonCard } from "../components/Loader";
import type {
  FetchAllRestaurantsData,
  fetchRestaurantData,
} from "../services/apiRestaurants";

type RestaurantCard = {
  path: string;
  cities?: string[];
  queryFunction: (
    city: string | null,
    page: number,
    pageSize: number,
  ) => Promise<FetchAllRestaurantsData>;
  queryKey: string;
};

export default function RestaurantsCard({
  path,
  cities,
  queryFunction,
  queryKey,
}: RestaurantCard) {
  const { role } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const pageSize = 9;

  const {
    data: restaurantsData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKey, selectedCity, page],
    queryFn: () => queryFunction(selectedCity, page, pageSize),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
  if (isLoading || !restaurantsData)
    return (
      <div className="grid-auto-fit w-full gap-y-16 gap-x-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );

  if (isError || error)
    return <div>Error occurred while fetching restaurants.</div>;

  function onChangeCity(e: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(e?.target?.value || null);
    setPage(1);
  }

  const { restaurants, totalPages, totalCount } = restaurantsData;
  return (
    <section className="w-full">
      {role != "owner" && (
        <div className="flex justify-start mb-8">
          <select
            className="rounded-lg border-2 border-blue-500 font-semibold outline-none h-8"
            value={selectedCity || ""}
            onChange={onChangeCity}
          >
            <option value="">All Cities</option>
            {cities?.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      )}
      <div
        className={`grid-auto-fit justify-center gap-y-16 gap-x-8 transition-opacity duration-500 ${isFetching ? "opacity-50" : "opacity-100"}`}
      >
        {restaurants.map((r) => (
          <Link key={r.id} to={`/${path}/${r.id}`}>
            <RestaurantCard restaurant={r} />
          </Link>
        ))}
      </div>
      <Pagination
        totalPages={totalPages}
        totalCount={totalCount}
        currentPage={page}
        setPage={setPage}
        pageSize={pageSize}
      />
    </section>
  );
}

function RestaurantCard({ restaurant }: fetchRestaurantData) {
  return (
    <div className="border border-none rounded-xl shadow-2xl h-[330px] hover:-translate-y-1.5 transition-all duration-500">
      <img
        src={restaurant.image_url}
        alt="image"
        className="rounded-t-xl max-h-[245px] w-[350px]"
      />
      <div className="flex flex-col gap-1.5 px-6 mt-2">
        <p className="capitalize text-lg  font-bold text-black/70">
          {restaurant.name}
        </p>
        <div className="flex justify-between">
          {restaurant.averageRating ? (
            <div className="flex items-center">
              <RatingStars rating={restaurant.averageRating} />
              <p className="text-lg">({restaurant.totalReviews})</p>
            </div>
          ) : (
            <p className="font-bold text-xl">No ratings</p>
          )}
          <p className="font-bold text-lg text-black/70">{restaurant.city}</p>
        </div>
      </div>
    </div>
  );
}
