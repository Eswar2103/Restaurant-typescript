import { FormRow, LoadingButton } from "./Utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addRestaurant } from "../services/apiRestaurants";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AddRestaurantForm from "../components/AddRestaurantForm";

function AddRestaurant() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: addRestaurant,
    onSuccess: () => {
      toast.success("Successfully added restaurant!");
      queryClient.invalidateQueries({ queryKey: ["own-restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["all-restaurants"] });
      navigate("/my-restaurants");
    },
    onError: (error) => {
      toast.error("Failed to add restaurant. Please try again.");
      console.error("Add restaurant error:", error);
    },
  });
  return <AddRestaurantForm isPending={isPending} mutate={mutate} />;
}

export default AddRestaurant;
