import { useQuery } from "@tanstack/react-query";
import { fetchRestaurantByIdWithReviews } from "../services/apiRestaurants";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { RatingStars } from "./Utils";
import Reviews from "../components/Reviews";
import { SkeletonCard } from "../components/Loader";

function RestaurantView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: restaurant,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: () => {
      if (!id) {
        navigate("/restaurants");
        throw new Error("Restaurant id is required");
      }
      return fetchRestaurantByIdWithReviews(id);
    },
  });

  if (isLoading) return <SkeletonCard />;
  if (isError) {
    const message = error?.message ?? "";

    if (/restaurant id is required/i.test(message)) {
      toast.error("Invalid restaurant ID");
    } else if (/restaurant not found/i.test(message)) {
      navigate("/restaurants");
      toast.error("Restaurant not found");
    } else {
      toast.error("Unable to fetch restaurant details.");
    }
    return null;
  }

  return (
    <section>
      <div className="flex gap-3">
        <p className="text-4xl text-black/80 font-bold capitalize">
          {restaurant?.name}
        </p>
        {restaurant?.averageRating && (
          <RatingStars rating={restaurant.averageRating} />
        )}
      </div>
      <p className="mb-2 font-bold text-black/70">{restaurant?.city}</p>
      <div className="flex flex-col min-[850px]:flex-row gap-4 items-center">
        <img
          className="w-[500px] min-[851px]:max-[950px]:w-[370px] object-cover h-auto max-w-full rounded-lg shrink-0"
          src={restaurant?.image_url}
          alt={restaurant?.name}
        />
        <p className="text-justify font-semibold">{restaurant?.description}</p>
      </div>
      <p className="my-6 text-2xl font-bold text-black/80">Reviews</p>
      {restaurant && <Reviews restaurantData={restaurant} />}
    </section>
  );
}

export default RestaurantView;
