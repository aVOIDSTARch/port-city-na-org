import { Component, Show } from "solid-js";
import { HomeGroup } from "../types/bmlt";

interface HomeGroupCardProps {
  group: HomeGroup;
}

const HomeGroupCard: Component<HomeGroupCardProps> = (props) => {
  const nextMeeting = () => {
    // Logic to find next meeting could go here, or just show count for now
    return props.group.meetings.length;
  };

  const primaryMeeting = () => props.group.meetings[0];

  return (
    <a 
      href={`/group/${props.group.slug}`}
      class="block group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-brand-secondary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:-translate-y-1"
    >
      <div class="p-6">
        <h3 class="text-xl font-bold text-brand-text mb-2 group-hover:text-brand-secondary transition-colors">
          {props.group.name}
        </h3>
        
        <div class="flex flex-col gap-1 text-sm text-brand-text/60">
           <div class="flex items-center gap-2">
             <span>📍</span>
             <span>{primaryMeeting()?.city}</span>
           </div>
           
           <div class="flex items-center gap-2 mt-2">
             <span class="px-2 py-0.5 rounded bg-white/10 text-xs">
                {nextMeeting()} Meeting{nextMeeting() !== 1 ? 's' : ''}/Week
             </span>
           </div>
        </div>
      </div>
      
      {/* Decorative gradient */}
      <div class="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </a>
  );
};

export default HomeGroupCard;
