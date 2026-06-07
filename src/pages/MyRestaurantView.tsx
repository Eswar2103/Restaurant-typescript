import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  fetchRestaurantByIdWithReviews,
  deleteRestaurant,
  updateRestaurant,
} from "../services/apiRestaurants";
import { FilePenLine, Trash2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";
import { RatingStars } from "./Utils";
import Reviews from "../components/Reviews";
import AddRestaurantForm from "../components/AddRestaurantForm";
import { useState, useEffect } from "react";
import { SkeletonCard } from "../components/Loader";
import GetConfirmation from "../components/GetConfirmation";

function MyRestaurantView() {
  const [isEditing, setIsEditing] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { role } = useAuth();
  const {
    data: restaurant,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: () => {
      if (!id) {
        navigate("/my-restaurants");
        throw new Error("Restaurant id is required");
      }
      return fetchRestaurantByIdWithReviews(id);
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending: isUpdatePending } = useMutation({
    mutationFn: updateRestaurant,
    onSuccess: () => {
      toast.success("Successfully updated restaurant!");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["own-restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant", id] });
    },
    onError: (error) => {
      toast.error("Failed to add restaurant. Please try again.");
      console.error("Add restaurant error:", error);
    },
  });

  const { mutate: DeleteRestaurant, isPending: isDeletePending } = useMutation({
    mutationFn: () => {
      if (!id) {
        navigate("/my-restaurants");
        throw new Error("Restaurant id is required");
      }
      return deleteRestaurant(id);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["restaurant", id] });
      toast.info("Deleted restaurant successfully");
      navigate("/my-restaurants");
    },
    onError: (error) => {
      toast.error("Failed to delete restaurant. Please try again.");
      console.error("Delete restaurant error:", error);
    },
  });

  useEffect(() => {
    if (isError) toast.error("Unable to fetch restaurant details.");
  }, [isError]);

  if (isLoading) return <SkeletonCard />;
  if (isError) return null;

  console.log("Fetch error:", error);

  function submitDeleteRestaurant() {
    // DeleteRestaurant();
    setIsDelete(true);
  }

  return (
    <section className="w-full">
      {isEditing ? (
        <AddRestaurantForm
          mutate={mutate}
          isPending={isUpdatePending}
          data={restaurant}
          update={true}
          setIsEditing={setIsEditing}
        />
      ) : (
        <>
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
            <p className="text-justify font-semibold">
              {restaurant?.description}
            </p>
          </div>
          {role == "owner" && (
            <div className="flex justify-end gap-3">
              <button
                className="flex gap-1 border border-none bg-green-600 px-5 py-1 rounded-xl text-white font-bold hover:bg-green-700 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50"
                onClick={() => setIsEditing(true)}
                disabled={isDelete}
              >
                <FilePenLine className="w-4" />
                Edit
              </button>
              <button
                className="flex gap-1 border border-none bg-red-600 px-5 py-1 rounded-xl text-white font-bold hover:bg-red-700 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50"
                onClick={submitDeleteRestaurant}
                disabled={isDeletePending || isDelete}
              >
                <Trash2 className="w-4" />
                Delete Restaurant
              </button>
            </div>
          )}
        </>
      )}
      {isDelete && (
        <GetConfirmation
          mutate={DeleteRestaurant}
          setIsDelete={setIsDelete}
          text="restaurant"
        />
      )}
      <p className="my-6 text-2xl font-bold text-black/80">Reviews</p>
      {restaurant && <Reviews restaurantData={restaurant} />}
    </section>
  );
}

export default MyRestaurantView;
