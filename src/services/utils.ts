async function getCityFromCoordinates(
  latitude: number,
  longitude: number,
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
    );
    const data = await response.json();
    console.log("Reverse geocoding data:", data);
    const city =
      data?.address?.city ||
      data?.address?.town ||
      data?.address?.state_district ||
      null;

    return city;
  } catch (error) {
    console.error("Error fetching city from coordinates:", error);
    return null;
  }
}

function computeDate(isoDate: string): string {
  const date = new Date(isoDate);
  return `${String(date.getUTCMonth() + 1).padStart(2, "0")}/${String(date.getUTCDate()).padStart(2, "0")}/${date.getUTCFullYear()}`;
}

export { getCityFromCoordinates, computeDate };
