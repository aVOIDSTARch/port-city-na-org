import { Title, Meta } from "@solidjs/meta";
import { createAsync } from "@solidjs/router";
import { createSignal, createMemo, Show, Suspense, For } from "solid-js";
import { getServiceBodies, getHomeGroups } from "~/server/bmlt";
import Hero from "~/components/Hero";
import HomeGroupCard from "~/components/HomeGroupCard";
import { BMLTServiceBody } from "~/types/bmlt";

export default function HomeGroups() {
  const serviceBodies = createAsync(() => getServiceBodies());
  const homeGroups = createAsync(() => getHomeGroups());

  // Default to "Port City Area" (ID check later or just by name)
  const [selectedAreaId, setSelectedAreaId] = createSignal<string>("");

  // Processed Service Bodies for Dropdown
  // 1. Sort Alphabetically
  // 2. Insert "Dividers" for Types (e.g. Region vs Area)
  const dropdownOptions = createMemo(() => {
    const bodies = serviceBodies();
    if (!bodies) return [];

    // Simple sorting for now. BMLT usually returns a hierarchy.
    // If we want dividers, we need to know the types.
    // Let's sort simply by name first.
    return [...bodies].sort((a,b) => a.name.localeCompare(b.name));
  });

  // Set default when bodies load
  const [initialized, setInitialized] = createSignal(false);
  createMemo(() => {
      const bodies = dropdownOptions();
      if (!initialized() && bodies.length > 0) {
          // Find Port City Area
          const pca = bodies.find(b => b.name.includes("Port City Area"));
          if (pca) {
              setSelectedAreaId(pca.id);
          } else {
              // Fallback to first if not found
              setSelectedAreaId(bodies[0].id);
          }
          setInitialized(true);
      }
  });


  const displayedGroups = createMemo(() => {
    const all = homeGroups();
    if (!all) return [];
    
    // In a real implementation with valid area IDs in HomeGroup:
    // return all.filter(g => g.areaId === selectedAreaId());
    
    // For MVP/Mock: Since we don't effectively have Area IDs in the HomeGroup objects yet
    // (BMLT Meeting normalization didn't include service_body_bigint), we show all.
    // However, if we DID, this is where it would happen.
    return all;
  });

  return (
    <main class="min-h-screen bg-brand-background text-brand-text font-sans selection:bg-brand-secondary selection:text-white pb-20">
      <Title>Our Homegroups - Port City NA</Title>
      <Meta name="description" content="Find a Narcotics Anonymous Homegroup in the Port City Area." />
      
      {/* Mini Hero / Header */}
      <div class="bg-brand-surface border-b border-white/10 pt-24 pb-12 px-4">
          <div class="max-w-6xl mx-auto text-center">
              <h1 class="text-4xl md:text-5xl font-bold text-brand-secondary mb-4">Our Homegroups</h1>
              <p class="text-lg text-brand-text/70 max-w-2xl mx-auto">
                A Homegroup is the heartbeat of NA. Find a group to call home, get involved, and support your recovery.
              </p>
          </div>
      </div>
      
      <section class="w-full max-w-6xl mx-auto px-4 py-8">
        
            <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <span class="text-brand-text/70 font-bold">Filter by Service Body:</span>
                
                {/* Area Dropdown */}
                <Suspense fallback={<div class="h-10 w-48 bg-white/5 animate-pulse rounded"></div>}>
                    <div class="relative group">
                        <select
                            onChange={(e) => setSelectedAreaId(e.currentTarget.value)}
                            value={selectedAreaId()}
                            class="appearance-none bg-brand-background border border-white/20 rounded-lg py-2 pl-4 pr-10 min-w-[200px] text-brand-text focus:outline-none focus:border-brand-secondary cursor-pointer"
                        >
                            {/* Logic to insert separators could go here if we had distinct types in the sorted list */}
                            {/* Example: 
                                <option disabled>-- Region --</option> 
                                <option value="region-id">Carolina Region</option>
                                <option disabled>-- Areas --</option>
                            */}
                            
                            <option disabled>-- Select an Area --</option>
                            <For each={dropdownOptions()}>
                                {(body) => (
                                    <option value={body.id}>
                                        {body.name}
                                    </option>
                                )}
                            </For>
                        </select>
                         <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand-text/50">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </Suspense>
            </div>

            <Suspense fallback={<div class="py-20 text-center animate-pulse text-brand-text/50">Loading homegroups...</div>}>
                <div class="grid grid-cols-1 gap-6">
                    <For each={displayedGroups()}>
                        {(group) => <HomeGroupCard group={group} />}
                    </For>
                    <Show when={displayedGroups().length === 0}>
                        <div class="col-span-full py-20 text-center text-brand-text/50 bg-white/5 rounded-xl border border-white/5">
                            <p class="text-xl italic mb-2">No groups found.</p>
                            <p class="text-sm">Try selecting a different area.</p>
                        </div>
                    </Show>
                </div>
            </Suspense>

      </section>
    </main>
  );
}
