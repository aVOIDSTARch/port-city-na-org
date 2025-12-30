import { Component } from 'solid-js';

const Hero: Component = () => {
  return (
    <section class="relative h-full w-full overflow-hidden flex flex-col justify-end">
      {/* Background Image */}
      <div class="absolute inset-0 z-0">
          <img
            src="/charleston-bridge-hero-image.jpeg"
            alt="Charleston Bridge at Sunset"
            class="h-full w-full object-cover opacity-90"
          />
          {/* Subtle gradient overlay to ensure text contrast at bottom, but keep image clear */}
          <div class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20 mix-blend-multiply"></div>
      </div>
      
      {/* Bottom Bar Content - Glassmorphism */}
      <div class="relative z-10 w-full bg-white/5 backdrop-blur-xl border-t border-white/10 p-6 md:p-10 animate-fade-in-up">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
            
            <div class="text-left">
                <h1 class="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-md tracking-tight leading-tight">
                  Port City Area NA
                </h1>
                <p class="text-lg md:text-xl text-white/80 font-light tracking-wide">
                  Recovery in the Lowcountry
                </p>
            </div>

            <div class="flex gap-4">
                 <a href="/meetings" class="bg-brand-secondary hover:bg-white hover:text-brand-secondary text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:translate-y-[-2px]">
                    Find a Meeting
                 </a>
                 <a href="/local-meetings" class="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg backdrop-blur-md border border-white/10 transition-colors">
                    Local Schedule
                 </a>
            </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
