import { createAsync } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { createSignal, createMemo, Show, Suspense, For } from "solid-js";
import { getMeetings, getServerInfo, getServiceBodies } from "~/server/bmlt";
import ThisWeek from "~/components/ThisWeek";
import { calculateDistance } from "~/services/location";

export default function LocalMeetings() {
  const meetingsData = createAsync(() => getMeetings());
  const serverInfo = createAsync(() => getServerInfo());
  const serviceBodies = createAsync(() => getServiceBodies());

  // Filter States
  const [radius, setRadius] = createSignal(50);

  // Filtering Logic - Distance only for now
  const filteredMeetings = createMemo(() => {
    const all = meetingsData();
    const info = serverInfo();
    
    if (!all || !info) return [];
    
    console.log('[LocalMeetings] Total meetings loaded:', all.length);
    
    // Debug: show sample meeting structure
    if (all.length > 0) {
        console.log('[LocalMeetings] Sample meeting:', all[0]);
    }

    // Default center from Server Info
    const centerLat = parseFloat(info.centerLatitude);
    const centerLng = parseFloat(info.centerLongitude);
    
    console.log('[LocalMeetings] Center point:', centerLat, centerLng, 'Radius:', radius());

    const filtered = all.filter(meeting => {
        const dist = calculateDistance(centerLat, centerLng, meeting.latitude, meeting.longitude);
        return dist <= radius();
    });
    
    console.log('[LocalMeetings] After distance filter:', filtered.length, 'meetings');
    return filtered;
  });

  return (
    <main class="min-h-screen bg-brand-background text-brand-text">
        <Title>Local Meetings - Port City NA</Title>
        <Meta name="description" content="Weekly schedule of Narcotics Anonymous meetings in the Port City Area." />

        <div class="bg-brand-background/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/10 p-4 shadow-lg">
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
                <h1 class="text-xl font-bold text-brand-secondary">Local Meetings</h1>
                
                <div class="flex gap-4">
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
