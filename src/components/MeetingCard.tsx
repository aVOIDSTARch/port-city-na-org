import { Component, For, Show } from 'solid-js';
import type { Meeting } from '../types/bmlt';
import { DAYS } from '../constants/days';

interface MeetingCardProps {
  meeting: Meeting;
  showDay?: boolean;
}

const MeetingCard: Component<MeetingCardProps> = (props) => {
  const dayInfo = () => DAYS.find(d => d.id === props.meeting.day);
  const colorClass = () => dayInfo()?.colorClass || 'text-brand-accent decoration-brand-accent';
  const bgColorClass = () => colorClass().split(' ')[2]?.replace('decoration-', 'bg-') || 'bg-brand-accent';

  return (
    <div class="group relative overflow-hidden bg-brand-background/60 hover:bg-brand-background/90 rounded-xl p-5 border border-white/5 hover:border-brand-secondary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
       {/* Color coded accent on left */}
       <div class={`absolute left-0 top-0 bottom-0 w-1 ${bgColorClass()}`}></div>
       
       <div class="pl-3 flex-1 flex flex-col">
          <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-xl text-brand-text leading-tight group-hover:text-brand-secondary transition-colors">
                  {props.meeting.name}
              </h3>
              <div class="flex flex-col items-end gap-1">
                <span class="text-sm font-mono text-brand-accent/70 bg-white/5 px-2 py-1 rounded whitespace-nowrap">
                    {props.meeting.time.slice(0, 5)}
                </span>
                <Show when={props.showDay}>
                    <span class={`text-[10px] font-bold uppercase tracking-wider ${colorClass().split(' ')[0]}`}>
                        {dayInfo()?.name.slice(0, 3)}
                    </span>
                </Show>
              </div>
          </div>
          
          <p class="text-brand-text/80 text-sm mb-3 font-medium">
              {props.meeting.city}
          </p>
          <p class="text-brand-text/60 text-xs mb-3 truncate">
            {props.meeting.street}
          </p>
          
          <div class="flex flex-wrap gap-2 mt-auto">
            <For each={props.meeting.formats}>
                {(format) => (
                    <span class="text-[10px] uppercase tracking-wider text-brand-text/50 border border-white/10 px-2 py-0.5 rounded-full">
                        {format}
                    </span>
                )}
            </For>
          </div>
       </div>
    </div>
  );
};

export default MeetingCard;
