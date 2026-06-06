import { useForm } from "react-hook-form";
import { FormRow, LoadingButton } from "../pages/Utils";
import { useAuth } from "../context/useAuth";
import { getCityFromCoordinates } from "../services/utils";
import type {
  RestaurantInsert,
  RestaurantData,
} from "../services/apiRestaurants";
import type { Dispatch, SetStateAction } from "react";

type AddRestaurantForm = {
  mutate: (restaurant: RestaurantInsert) => void;
  isPending: boolean;
  data?: RestaurantData;
  update?: boolean;
  setIsEditing?: Dispatch<SetStateAction<boolean>>;
};

function AddRestaurantForm({
  mutate,
  isPending,
  data,
  update = false,
  setIsEditing,
}: AddRestaurantForm) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RestaurantInsert>({
    defaultValues: { ...data },
  });

  if (!user || !user.id) {
    return null;
  }

  const userId = user.id;

  let text = "Add Restaurant";
  let loadingText = "Adding Restaurant...";
  if (update) {
    text = "Update Restaurant";
    loadingText = "Updating Restaurant...";
  }

  async function onSubmit(data: RestaurantInsert) {
    const city = await getCityFromCoordinates(data.latitude, data.longitude);
    if (!city) {
      setError("latitude", {
        message: "Invalid coordinates - no location found",
      });
      setError("longitude", {
        message: "Invalid coordinates - no location found",
      });
      return;
    }
    mutate({ ...data, owner_id: userId, city });
  }

  return (
    <section className="flex flex-col border-none rounded-xl p-5 max-w-200 w-full mx-auto px-4 shadow-xl/30 bg-white">
      <p className="text-lg font-bold text-center">
        {update ? "Update" : "Add"} Restaurant
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 flex flex-col gap-6"
      >
        <FormRow label="Restaurant Name" error={errors?.name}>
          <input
            type="text"
            {...register("name", {
              required: "Restaurant name is required",
            })}
            className="shadow-sm/10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </FormRow>
        <FormRow label="Description" error={errors?.description}>
          <textarea
            {...register("description", {
              required: "Description is required",
              validate: (value) => {
                const charCount = value.trim().length;
                return (
                  charCount >= 250 ||
                  "Description must be at least 250 characters"
                );
              },
            })}
            className="shadow-sm/10 w-full h-50 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </FormRow>
        <FormRow label="Image URL" error={errors?.image_url}>
          <input
            type="url"
            {...register("image_url", {
              required: "Image URL is required",
            })}
            className="shadow-sm/10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </FormRow>
        <div className="flex gap-4 justify-center">
          <FormRow label="Latitude" error={errors?.latitude}>
            <input
              type="number"
              step="any"
              {...register("latitude", {
                required: "Latitude is required",
                validate: (v) =>
                  (v >= -90 && v <= 90) ||
                  "Latitude must be between -90 and 90",
              })}
              className="shadow-sm/10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormRow>
          <FormRow label="Longitude" error={errors?.longitude}>
            <input
              type="number"
              step="any"
              {...register("longitude", {
                required: "Longitude is required",
                validate: (v) =>
                  (v >= -180 && v <= 180) ||
                  "Longitude must be between -180 and 180",
              })}
              className="shadow-sm/10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormRow>
        </div>
        <div className="flex justify-center gap-4 px-8">
          <LoadingButton
            type="submit"
            classes="max-w-[800px] w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
            text1={loadingText}
            text2={text}
            isLoading={isPending}
          />
          {update && setIsEditing && (
            <button
              className="border border-none bg-red-600 rounded-xl text-white px-3 py-1 font-bold hover:bg-red-700"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default AddRestaurantForm;
