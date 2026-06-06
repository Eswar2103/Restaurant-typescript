import { useQuery } from "@tanstack/react-query";
import { fetchAllRestaurants, getCities } from "../services/apiRestaurants";
import RestaurantsCard from "../components/RestaurantsCard";

function AllRestaurants() {
  const { data: cities, error: citiesError } = useQuery({
    queryKey: ["cities"],
    queryFn: getCities,
  });

  if (citiesError) {
    console.error("Unable to fetch cities:", citiesError);
  }

  return (
    <RestaurantsCard
      path="restaurants"
      cities={cities ? cities : []}
      queryFunction={fetchAllRestaurants}
      queryKey="all-restaurants"
    />
  );
}

export default AllRestaurants;
