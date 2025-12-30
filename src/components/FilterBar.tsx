import { Component, For, Show } from "solid-js";
import { DAYS } from "../constants/days";

interface FilterBarProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  selectedDay: number | null;
  onDayChange: (day: number | null) => void;
  cities: string[];
  selectedCity: string | null;
  onCityChange: (city: string | null) => void;
  // Location Props
  locationText: string;
  onLocationTextChange: (text: string) => void;
  onUseLocation: () => void;
  radius: number;
  onRadiusChange: (r: number) => void;
  // Format Props
  formats: string[];
  selectedFormats: string[];
  onFormatToggle: (format: string) => void;
}

const FilterBar: Component<FilterBarProps> = (props) => {
  return (
    <div class="bg-brand-background/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/10 p-4 shadow-lg">
      <div class="max-w-6xl mx-auto flex flex-col gap-4">
        
        {/* Top Row: Search, Location, Radius */}
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Main Search */}
          <div class="md:col-span-4">
             <input
               type="text"
               placeholder="Search by name, venue..."
               value={props.searchText}
               onInput={(e) => props.onSearchChange(e.currentTarget.value)}
               class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-brand-text placeholder-brand-text/40 focus:outline-none focus:border-brand-secondary/50 focus:ring-1 focus:ring-brand-secondary/50 transition-all"
             />
          </div>

          {/* Location Input & Button */}
          <div class="md:col-span-4 flex gap-2">
            <input
               type="text"
               placeholder="Zip or City"
               value={props.locationText}
               onInput={(e) => props.onLocationTextChange(e.currentTarget.value)}
               class="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-brand-text placeholder-brand-text/40 focus:outline-none focus:border-brand-secondary/50"
            />
            <button
               onClick={props.onUseLocation}
               title="Use my location"
               class="bg-white/10 hover:bg-white/20 text-brand-text border border-white/10 rounded-lg px-3 transition-colors"
            >
              📍
            </button>
          </div>

          {/* Radius Select */}
          <div class="md:col-span-2">
            <select
                value={props.radius}
                onChange={(e) => props.onRadiusChange(parseInt(e.currentTarget.value))}
                class="w-full h-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-brand-text/90 focus:outline-none focus:border-brand-secondary/50"
            >
                <option value={5}>5 mi</option>
                <option value={10}>10 mi</option>
                <option value={25}>25 mi</option>
                <option value={50}>50 mi</option>
                <option value={100}>100 mi</option>
            </select>
          </div>
          
          {/* Day Select */}
          <div class="md:col-span-2">
            <select
                value={props.selectedDay || ""}
                onChange={(e) => props.onDayChange(e.currentTarget.value ? parseInt(e.currentTarget.value) : null)}
                class="w-full h-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-brand-text/90 focus:outline-none focus:border-brand-secondary/50"
            >
                <option value="">Any Day</option>
                <For each={DAYS}>
                {(day) => <option value={day.id}>{day.name}</option>}
                </For>
            </select>
          </div>
        </div>

        {/* Format Toggles (Simplified for now, maybe a dropdown later if too many) */}
        <div class="flex flex-wrap gap-2">
           <span class="text-sm text-brand-text/50 py-1 uppercase tracking-wider font-bold mr-2">Formats:</span>
           <For each={props.formats.sort()}>
              {(format) => (
                <button
                  onClick={() => props.onFormatToggle(format)}
                  class={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    props.selectedFormats.includes(format)
                      ? "bg-brand-secondary text-white border-brand-secondary"
                      : "bg-transparent text-brand-text/60 border-white/10 hover:border-white/30"
                  }`}
                >
                  {format}
                </button>
              )}
           </For>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
