import { Component, For, Show } from "solid-js";
import type { Meeting } from "../types/bmlt";
import MeetingCard from "./MeetingCard";

interface MeetingListProps {
  meetings: Meeting[];
}

const MeetingList: Component<MeetingListProps> = (props) => {
  return (
    <div class="max-w-6xl mx-auto p-4">
      <div class="mb-4 text-brand-text/50 text-sm font-light">
         Showing {props.meetings.length} results
      </div>
      
      <div class="grid grid-cols-1 gap-4">
        <Show when={props.meetings.length > 0} fallback={
           <div class="col-span-full py-20 text-center">
              <div class="text-4xl mb-4">🔍</div>
              <h3 class="text-xl font-bold text-brand-text">No meetings found</h3>
              <p class="text-brand-text/60">Try adjusting your search criteria.</p>
           </div>
        }>
          <For each={props.meetings}>
            {(meeting) => (
              <MeetingCard meeting={meeting} showDay={true} />
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};

export default MeetingList;
