import { Component, createSignal, For, Show } from 'solid-js';
import type { Meeting } from '../types/bmlt';
import MeetingCard from './MeetingCard';

interface ThisWeekProps {
  meetings: Meeting[];
}

import { DAYS } from '../constants/days';

const ThisWeek: Component<ThisWeekProps> = (props) => {
  // Adjust JS day (0-6 Sun-Sat) to BMLT standard if needed. 
  // Assuming BMLT uses 1=Sunday...7=Saturday based on generic typical usage, 
  // but standard PHP date('w') is 0=Sunday. 
  // Wait, my service used `weekday_tinyint`. 
  // Let's assume 1=Sunday for now based on typical SQL conventions or adjust.
  // Actually, standard BMLT often uses 1=Sunday.
  // JS Day: 0=Sunday. So currentDay + 1.
  const todayJS = new Date().getDay(); 
  // Map 0 -> 1, 1 -> 2 ...
  const defaultDay = todayJS + 1;

  const [selectedDay, setSelectedDay] = createSignal(defaultDay);

  const filteredMeetings = () => props.meetings.filter(m => m.day === selectedDay());

  return (
    <div class="w-full max-w-6xl mx-auto my-12 px-4">
      <div class="bg-white/5 bg-opacity-10 backdrop-blur-lg rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
        <h2 class="text-3xl font-bold mb-8 text-brand-text text-center md:text-left">
          Meetings This Week
        </h2>
        
        {/* Day Tabs */}
        <div class="flex flex-wrap gap-3 mb-8 justify-center md:justify-start">
          <For each={DAYS}>
            {(day) => (
              <button
                onClick={() => setSelectedDay(day.id)}
                class={`px-5 py-2 rounded-full border transition-all duration-300 font-semibold tracking-wide ${
                  selectedDay() === day.id
                    ? `${day.colorClass} bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] scale-105`
                    : "text-brand-text/50 border-transparent hover:text-brand-text hover:bg-white/5 active:scale-95"
                }`}
              >
                <span class="hidden md:inline">{day.name}</span>
                <span class="md:hidden">{day.name.slice(0, 3)}</span>
              </button>
            )}
          </For>
        </div>

        {/* Meeting List */}
        <div class="grid grid-cols-1 gap-4">
          <Show when={filteredMeetings().length > 0} fallback={
             <div class="col-span-full text-center py-12 text-brand-text/30 italic">
                No meetings found for this day.
             </div>
          }>
            <For each={filteredMeetings()}>
              {(meeting) => (
                <MeetingCard meeting={meeting} showDay={false} />
              )}
            </For>
          </Show>
        </div>
      </div>
    </div>
  );
};
export default ThisWeek;
