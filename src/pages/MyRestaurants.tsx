import { getOwnRestaurants } from "../services/apiRestaurants";
import RestaurantsCard from "../components/RestaurantsCard";

function MyRestaurants() {
  return (
    <RestaurantsCard
      path="my-restaurants"
      queryFunction={getOwnRestaurants}
      queryKey="own-restaurants"
    />
  );
}

export default MyRestaurants;
