'use client';

import { useEffect } from 'react';
import ScrollExpandMedia from '@/app/components/ui/scroll-expansion-hero';

export default function KillerZoneIntro() {
  // Always start at the top so the expand animation begins from scratch
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ScrollExpandMedia
      mediaType='video'
      mediaSrc='https://res.cloudinary.com/dxvui0xkz/video/upload/q_auto/v1781549761/Killer_Zone_logo_animation_202606151758_aiux2e.mp4'
      bgImageSrc='https://res.cloudinary.com/dxvui0xkz/image/upload/q_auto,w_1920,c_limit/v1781542712/gaming_lounge_setup_1_kigpow.png'
      title='Killer Zone'
      date='Chennai Gaming Lounge'
      scrollToExpand='Scroll to enter'
      textBlend
    >
      <div className='max-w-3xl mx-auto text-center'>
        <h3
          style={{ fontFamily: 'Orbitron, sans-serif' }}
          className='text-2xl md:text-3xl font-bold mb-4 text-white'
        >
          Press start. Enter the zone.
        </h3>
        <p className='text-base md:text-lg leading-relaxed' style={{ color: 'rgba(248,251,255,0.65)' }}>
          A cinematic PS5 lounge built for squad nights, birthdays, dates, and
          serious gaming sessions. Keep scrolling to explore the rooms, add-ons,
          pricing, and book your slot.
        </p>
      </div>
    </ScrollExpandMedia>
  );
}
