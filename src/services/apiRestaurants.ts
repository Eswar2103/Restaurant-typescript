import { supabase } from "./supabase";
import type { Database } from "../types/database.types";

export type RestaurantInsert =
  Database["public"]["Tables"]["restaurants"]["Insert"];

export type RestaurantData = Database["public"]["Tables"]["restaurants"]["Row"];
type ReviewsData = Database["public"]["Tables"]["reviews"]["Row"];
type RestaurantWithReviews = RestaurantData & {
  reviews: Pick<ReviewsData, "rating">[];
};

type ReviewInsertDataOnly = Omit<
  Database["public"]["Tables"]["reviews"]["Insert"],
  "restaurant_id" | "reviewer_id"
>;

type ReviewDataOnly = Omit<
  Database["public"]["Tables"]["reviews"]["Row"],
  "restaurant_id" | "reviewer_id"
>;

type RestaurantDataUpdate =
  Database["public"]["Tables"]["restaurants"]["Update"];

export type fetchRestaurantData = {
  restaurant: RestaurantWithReviews & {
    averageRating?: number;
    totalReviews?: number;
  };
};

export type fetchAllRestaurantsData = {
  restaurants: Array<fetchRestaurantData["restaurant"]>;
  totalCount: number;
  totalPages: number;
};

type fetchRestaurantByIdData = RestaurantData & {
  name: string;
  owner: {
    name: string;
  };
} & {
  reviews: Array<
    ReviewsData & {
      reviewer: {
        name: string;
      };
    }
  >;
} & {
  averageRating: number;
  totalReviews: number;
};

async function addRestaurant(restaurantData: RestaurantInsert) {
  const { error } = await supabase
    .from("restaurants")
    .insert({
      ...restaurantData,
    })
    .select()
    .single();
  if (error) {
    throw error;
  }
}

async function getOwnRestaurants(
  city: string | null,
  page = 1,
  pageSize = 10,
): Promise<fetchAllRestaurantsData> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  if (!data?.user) {
    throw new Error("User not authenticated");
  }
  const {
    data: restaurants,
    error: restaurantsError,
    count,
  } = await supabase
    .from("restaurants")
    .select("*,name, reviews(rating)", { count: "exact" })
    .eq("owner_id", data.user.id)
    .range(from, to);
  if (restaurantsError) {
    throw restaurantsError;
  }
  const totalCount = count ?? 0;

  return {
    restaurants: restaurants ? calculateReviews(restaurants) : [],
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

async function fetchAllRestaurants(
  city: string | null,
  page = 1,
  pageSize = 10,
): Promise<fetchAllRestaurantsData> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("restaurants")
    .select("*, reviews(rating)", { count: "exact" })
    .range(from, to);

  if (city) {
    query = query.ilike("city", `%${city}%`);
  }
  const { data, error, count } = await query;
  if (error) {
    throw error;
  }
  const totalCount = count ?? 0;
  return {
    restaurants: data ? calculateReviews(data) : [],
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

function calculateReviews(data: RestaurantWithReviews[]) {
  return data.map((restaurant) => {
    if (!restaurant.reviews) {
      restaurant.reviews = [];
    } else if (!Array.isArray(restaurant.reviews)) {
      restaurant.reviews = [restaurant.reviews];
    }
    return {
      ...restaurant,
      averageRating:
        restaurant?.reviews?.length > 0
          ? restaurant.reviews.reduce((sum, r) => sum + r.rating, 0) /
            restaurant.reviews.length
          : 0,
      totalReviews: restaurant?.reviews?.length || 0,
    };
  });
}

async function fetchRestaurantByIdWithReviews(
  id: string,
): Promise<fetchRestaurantByIdData> {
  const { data, error } = await supabase
    .from("restaurants")
    .select(
      "*,owner:users!owner_id(name), reviews(*, reviewer:users!reviewer_id(name))",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Restaurant not found.");

  if (data.reviews) {
    if (!Array.isArray(data.reviews)) {
      data.reviews = [data.reviews];
    }
  } else {
    data.reviews = [];
  }

  return {
    ...data,
    averageRating:
      data?.reviews?.length > 0
        ? data.reviews.reduce((sum, r) => sum + r.rating, 0) /
          data.reviews.length
        : 0,
    totalReviews: data?.reviews?.length || 0,
  };
}

async function addReview(
  restaurantId: string,
  reviewerId: string,
  reviewData: ReviewDataOnly,
) {
  const { error } = await supabase.from("reviews").insert({
    restaurant_id: restaurantId,
    reviewer_id: reviewerId,
    ...reviewData,
  });

  if (error) {
    throw error;
  }
}

async function updateReview(
  restaurantId: string,
  reviewerId: string,
  reviewData: ReviewInsertDataOnly,
) {
  const { error } = await supabase
    .from("reviews")
    .update(reviewData)
    .eq("restaurant_id", restaurantId)
    .eq("reviewer_id", reviewerId);
  if (error) {
    throw error;
  }
}

async function updateRestaurant(data: RestaurantDataUpdate) {
  if (!data?.id) {
    throw new Error("Restaurant data is empty!");
  }
  const { error } = await supabase
    .from("restaurants")
    .update({
      name: data.name,
      description: data.description,
      image_url: data.image_url,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
    })
    .eq("id", data.id)
    .select()
    .single();
  if (error) {
    throw error;
  }
}

async function deleteRestaurant(restaurantId: string) {
  const { error } = await supabase
    .from("restaurants")
    .delete()
    .eq("id", restaurantId);

  if (error) {
    throw error;
  }
}

async function getCities(): Promise<string[]> {
  const { data, error } = await supabase.rpc("get_distinct_cities");
  if (error) {
    throw error;
  }
  return data.map((r) => r.city);
}

async function deleteReview(restaurantId: string, reviewerId: string) {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("restaurant_id", restaurantId)
    .eq("reviewer_id", reviewerId);
  if (error) {
    throw error;
  }
}

export {
  addRestaurant,
  getOwnRestaurants,
  fetchAllRestaurants,
  fetchRestaurantByIdWithReviews,
  updateReview,
  addReview,
  updateRestaurant,
  deleteRestaurant,
  getCities,
  deleteReview,
};
