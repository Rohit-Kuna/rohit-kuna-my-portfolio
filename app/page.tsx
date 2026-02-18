import App from "./(project)/App";
import { getFinderLocationsFromSanity } from "@/app/(project)/(content)/location.cms";
import type { Location } from "@/app/(project)/(types)/location.types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let locationsData: Record<string, Location> = {};

  try {
    locationsData = await getFinderLocationsFromSanity();
  } catch {
    locationsData = {};
  }

  return <App locationsData={locationsData} />;
}
