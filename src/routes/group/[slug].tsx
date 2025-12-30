import { createAsync, useParams } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { createMemo, Show, Suspense, For } from "solid-js";
import { getHomeGroups } from "~/server/bmlt";
import MeetingCard from "~/components/MeetingCard";

export default function GroupPage() {
  const params = useParams();
  const groups = createAsync(() => getHomeGroups());

  const group = createMemo(() => {
    return groups()?.find(g => g.slug === params.slug);
  });

  return (
    <main class="min-h-screen bg-brand-background text-brand-text pb-20">
        <Suspense fallback={<div class="p-20 text-center animate-pulse">Loading group details...</div>}>
            <Show when={group()} fallback={
                <div class="p-20 text-center">
                    <h1 class="text-3xl font-bold mb-4">Group Not Found</h1>
                    <p class="text-brand-text/50">The group you are looking for does not exist or has been moved.</p>
                    <a href="/" class="text-brand-secondary underline mt-4 inline-block">Return Home</a>
                </div>
            }>
                {(g) => (
                    <>
                        <Title>{g().name} - Port City NA</Title>
                        <Meta name="description" content={`Meeting schedule and details for ${g().name} homegroup.`} />

                        {/* Group Header */}
                        <div class="bg-brand-surface border-b border-white/10 p-8 md:p-12 text-center md:text-left">
                            <div class="max-w-4xl mx-auto">
                                <h1 class="text-4xl md:text-5xl font-bold text-brand-secondary mb-4">{g().name}</h1>
                                <div class="flex flex-wrap gap-4 text-brand-text/60">
                                    <div class="bg-white/5 py-1 px-3 rounded text-sm uppercase tracking-wider font-bold">
                                        Homegroup
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span>📍</span>
                                        <span>{g().meetings[0]?.city}, {g().meetings[0]?.street}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div class="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            
                            {/* Schedule Column */}
                            <div class="md:col-span-2 space-y-6">
                                <h2 class="text-2xl font-bold border-b border-white/10 pb-4">Meeting Schedule</h2>
                                <div class="grid gap-4">
                                    <For each={g().meetings.sort((a,b) => a.day - b.day || a.time.localeCompare(b.time))}>
                                        {(meeting) => <MeetingCard meeting={meeting} showDay={true} />}
                                    </For>
                                </div>
                            </div>

                            {/* Sidebar / Map Placeholder */}
                            <div class="space-y-6">
                                <div class="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <h3 class="font-bold text-lg mb-4 text-brand-secondary">Location</h3>
                                    <p class="mb-4 text-sm opacity-80">
                                        {g().meetings[0]?.street}<br/>
                                        {g().meetings[0]?.city}, {g().meetings[0]?.province}
                                    </p>
                                    
                                    {/* Map Placeholder */}
                                    <div class="w-full aspect-square bg-black/40 rounded-lg flex items-center justify-center border border-white/10">
                                        <div class="text-center p-4">
                                            <span class="text-3xl block mb-2">🗺️</span>
                                            <span class="text-xs opacity-50">Map View Coming Soon</span>
                                        </div>
                                    </div>
                                    
                                    <a 
                                        href={`https://maps.google.com/?q=${g().meetings[0]?.latitude},${g().meetings[0]?.longitude}`}
                                        target="_blank"
                                        class="block w-full text-center mt-4 bg-white/10 hover:bg-white/20 py-2 rounded transition-colors text-sm font-bold"
                                    >
                                        Get Directions
                                    </a>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Show>
        </Suspense>
    </main>
  );
}
