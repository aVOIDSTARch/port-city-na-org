import { createAsync } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { createSignal, createMemo, Show, Suspense, createEffect } from "solid-js";
import { getMeetings } from "~/server/bmlt";
import FilterBar from "~/components/FilterBar";
import MeetingList from "~/components/MeetingList";
import { getCurrentLocation, geocodeAddress, calculateDistance, type Coordinates } from "~/services/location";

export default function Meetings() {
  const meetingsData = createAsync(() => getMeetings());

  // Filter States
  const [searchText, setSearchText] = createSignal("");
  const [selectedDay, setSelectedDay] = createSignal<number | null>(null);
  const [selectedCity, setSelectedCity] = createSignal<string | null>(null);
  const [selectedFormats, setSelectedFormats] = createSignal<string[]>([]);
  
  // Location States
  const [locationText, setLocationText] = createSignal("");
  const [searchLocation, setSearchLocation] = createSignal<Coordinates | null>(null);
  const [radius, setRadius] = createSignal(25);
  const [isLoadingLocation, setIsLoadingLocation] = createSignal(false);

  // Derived Options
  const cities = createMemo(() => {
    const list = new Set(meetingsData()?.map(m => m.city) || []);
    return Array.from(list);
  });

  const allFormats = createMemo(() => {
     const list = new Set<string>();
     meetingsData()?.forEach(m => m.formats.forEach(f => list.add(f)));
     return Array.from(list);
  });

  // Handle "Use My Location"
  const handleUseLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const coords = await getCurrentLocation();
      setSearchLocation(coords);
      setLocationText("Current Location");
    } catch (error) {
      console.error("Error getting location", error);
      alert("Could not get your location. Please check browser permissions.");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Debounced Geocoding for Text Input
  let debounceTimer: ReturnType<typeof setTimeout>;
  const handleLocationTextChange = (text: string) => {
    setLocationText(text);
    
    // Clear location if text is empty
    if (!text) {
        setSearchLocation(null);
        return;
    }

    // Debounce API call
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
        // Only geocode if it looks like a zip or city (simple check)
        if (text.length > 2 && text !== "Current Location") {
            setIsLoadingLocation(true);
            const coords = await geocodeAddress(text);
            if (coords) {
                setSearchLocation(coords);
            }
            setIsLoadingLocation(false);
        }
    }, 1000); // 1 second debounce
  };

  // Filtering Logic
  const filteredMeetings = createMemo(() => {
    const all = meetingsData();
    if (!all) return [];

    let filtered = all.filter(meeting => {
      // 1. Text Search
      if (searchText()) {
        const lowerText = searchText().toLowerCase();
        const matchName = meeting.name.toLowerCase().includes(lowerText);
        const matchAddress = meeting.street.toLowerCase().includes(lowerText);
        const matchCity = meeting.city.toLowerCase().includes(lowerText);
        if (!matchName && !matchAddress && !matchCity) return false;
      }

      // 2. Day
      if (selectedDay() !== null && meeting.day !== selectedDay()) return false;

      // 3. City (Legacy filter, might overlap with location radius but keeping for specific filtering)
      if (selectedCity() && meeting.city !== selectedCity()) return false;

      // 4. Formats
      if (selectedFormats().length > 0) {
         const hasAll = selectedFormats().every(fmt => meeting.formats.includes(fmt));
         if (!hasAll) return false;
      }

      return true;
    });

    // 5. Radius Filter (Post-filter or pre-filter? Let's do it here)
    const center = searchLocation();
    if (center) {
        // Add distance property to meetings for sorting?
        // We can map first, but filtering is cheaper.
        filtered = filtered.filter(meeting => {
            const dist = calculateDistance(center.lat, center.lng, meeting.latitude, meeting.longitude);
            return dist <= radius();
        });
        
        // Sort by distance
        filtered.sort((a, b) => {
            const distA = calculateDistance(center.lat, center.lng, a.latitude, a.longitude);
            const distB = calculateDistance(center.lat, center.lng, b.latitude, b.longitude);
            return distA - distB;
        });
    }

    return filtered;
  });

  const toggleFormat = (fmt: string) => {
    const current = selectedFormats();
    if (current.includes(fmt)) {
      setSelectedFormats(current.filter(f => f !== fmt));
    } else {
      setSelectedFormats([...current, fmt]);
    }
  };

  return (
    <main class="min-h-screen bg-brand-background text-brand-text">
        <Title>Find a Meeting - Port City NA</Title>
        <Meta name="description" content="Search Narcotics Anonymous meetings in the Port City Area." />

        <Suspense fallback={<div class="p-20 text-center animate-pulse">Loading meeting data...</div>}>
            <Show when={meetingsData()}>
                <FilterBar
                    searchText={searchText()}
                    onSearchChange={setSearchText}
                    selectedDay={selectedDay()}
                    onDayChange={setSelectedDay}
                    cities={cities()}
                    selectedCity={selectedCity()}
                    onCityChange={setSelectedCity}
                    formats={allFormats()}
                    selectedFormats={selectedFormats()}
                    onFormatToggle={toggleFormat}
                    // Location Props
                    locationText={locationText()}
                    onLocationTextChange={handleLocationTextChange}
                    onUseLocation={handleUseLocation}
                    radius={radius()}
                    onRadiusChange={setRadius}
                />
                
                <div class="max-w-6xl mx-auto px-4 py-2 text-sm text-brand-text/50">
                    <Show when={isLoadingLocation()}>
                        <span class="animate-pulse">📍 Locating...</span>
                    </Show>
                    <Show when={!isLoadingLocation() && searchLocation()}>
                        <span>📍 Meetings within {radius()} miles</span>
                    </Show>
                </div>

                <MeetingList meetings={filteredMeetings()} />
            </Show>
        </Suspense>
    </main>
  );
}
