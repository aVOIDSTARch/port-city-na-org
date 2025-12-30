import { createAsync } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { createSignal, createMemo, Show, Suspense } from "solid-js";
import { getMeetings, getServerInfo } from "~/server/bmlt";
import ThisWeek from "~/components/ThisWeek";
import { calculateDistance } from "~/services/location";

export default function LocalMeetings() {
  const meetingsData = createAsync(() => getMeetings());
  const serverInfo = createAsync(() => getServerInfo());

  // Filter States
  const [radius, setRadius] = createSignal(50);
  const [selectedArea, setSelectedArea] = createSignal("Port City Area");

  // Filtering Logic
  const filteredMeetings = createMemo(() => {
    const all = meetingsData();
    const info = serverInfo();
    
    if (!all || !info) return [];

    // Default center from Server Info
    const centerLat = parseFloat(info.centerLatitude);
    const centerLng = parseFloat(info.centerLongitude);

    return all.filter(meeting => {
        const dist = calculateDistance(centerLat, centerLng, meeting.latitude, meeting.longitude);
        return dist <= radius();
    });
  });

  return (
    <main class="min-h-screen bg-brand-background text-brand-text">
        <Title>Local Meetings - Port City NA</Title>
        <Meta name="description" content="Weekly schedule of Narcotics Anonymous meetings in the Port City Area." />

        <div class="bg-brand-background/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/10 p-4 shadow-lg">
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
                <h1 class="text-xl font-bold text-brand-secondary">Local Meetings</h1>
                
                <div class="flex gap-4">
                    {/* Area Select (Placeholder for now) */}
                    <div class="flex items-center gap-2">
                        <label class="text-sm font-bold text-brand-text/70">Area:</label>
                        <select
                            value={selectedArea()}
                            onChange={(e) => setSelectedArea(e.currentTarget.value)}
                            class="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-brand-text/90 focus:outline-none focus:border-brand-secondary/50"
                        >
                            <option value="Port City Area">Port City Area</option>
                        </select>
                    </div>

                    {/* Radius Select */}
                    <div class="flex items-center gap-2">
                        <label class="text-sm font-bold text-brand-text/70">Distance:</label>
                        <select
                            value={radius()}
                            onChange={(e) => setRadius(parseInt(e.currentTarget.value))}
                            class="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-brand-text/90 focus:outline-none focus:border-brand-secondary/50"
                        >
                            <option value={5}>5 mi</option>
                            <option value={10}>10 mi</option>
                            <option value={25}>25 mi</option>
                            <option value={50}>50 mi</option>
                            <option value={100}>100 mi</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <Suspense fallback={<div class="p-20 text-center animate-pulse">Loading meeting schedule...</div>}>
            <Show when={meetingsData() && serverInfo()}>
                 <div class="mt-4">
                    <ThisWeek meetings={filteredMeetings()} />
                 </div>
            </Show>
        </Suspense>
    </main>
  );
}
