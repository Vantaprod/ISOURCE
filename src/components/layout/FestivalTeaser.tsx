"use client";
import { useEffect, useState } from "react";

// Islamic events shift ~11 days earlier each year. 
// We hardcode 2026 and 2027 dates for perfect accuracy.
const ISLAMIC_DATES: Record<string, Record<number, [number, number]>> = {
  ramadan:   { 2026: [1, 18], 2027: [1, 8] },   // Month is 0-indexed (1 = Feb)
  eid_fitr:  { 2026: [2, 20], 2027: [2, 10] },  // March 20, 2026 / March 10, 2027
  eid_adha:  { 2026: [4, 27], 2027: [4, 17] },  // May 27, 2026 / May 17, 2027
  mawlid:    { 2026: [7, 25], 2027: [7, 14] },  // Aug 25, 2026 / Aug 14, 2027
};

const FESTIVALS = [
  { id: "newyear",    name: "New Year, New Gear",  icon: "✨", bgClass: "bg-[#1E3A8A]", skinStartMonth: 0,  eventMonth: 0,  eventDay: 31 },
  { id: "valentines", name: "Valentine's Day",     icon: "❤️", bgClass: "bg-[#D82C6B]", skinStartMonth: 1,  eventMonth: 1,  eventDay: 14 },
  { id: "eid_fitr",   name: "Ramadan & Eid al-Fitr", icon: "🌙", bgClass: "bg-[#0F766E]", skinStartMonth: 1,  eventMonth: 2,  eventDay: 20 }, // Launches Feb 1
  { id: "easter",     name: "Easter & Spring",     icon: "🐣", bgClass: "bg-[#EAB308]", skinStartMonth: 2,  eventMonth: 3,  eventDay: 30 },
  { id: "mothersday", name: "For Her (Mother's Day)", icon: "🌸", bgClass: "bg-[#E91E63]", skinStartMonth: 3,  eventMonth: 3,  eventDay: 30 },
  { id: "workersday", name: "Workers' Day",        icon: "👷", bgClass: "bg-[#F97316]", skinStartMonth: 4,  eventMonth: 4,  eventDay: 31 },
  { id: "eid_adha",   name: "Eid al-Adha (Kabir)", icon: "🐑", bgClass: "bg-[#D97706]", skinStartMonth: 4,  eventMonth: 4,  eventDay: 27 }, // Launches May 1
  { id: "fathersday", name: "For Him (Father's Day)", icon: "👔", bgClass: "bg-[#4B5563]", skinStartMonth: 5,  eventMonth: 5,  eventDay: 30 },
  { id: "techweek",   name: "Tech Week",           icon: "💻", bgClass: "bg-[#0EA5E9]", skinStartMonth: 6,  eventMonth: 6,  eventDay: 31 },
  { id: "mawlid",     name: "Mawlid & Back to School", icon: "🎒", bgClass: "bg-[#059669]", skinStartMonth: 7,  eventMonth: 7,  eventDay: 31 },
  { id: "independence", name: "Made in Nigeria",   icon: "🇳🇬", bgClass: "bg-[#008751]", skinStartMonth: 8,  eventMonth: 9,  eventDay: 1 },
  { id: "blackfriday", name: "Black Friday",       icon: "🛍️", bgClass: "bg-[#111827]", skinStartMonth: 10, eventMonth: 10, eventDay: 30 },
  { id: "christmas",  name: "Christmas / Detty December", icon: "🎄", bgClass: "bg-[#C0292E]", skinStartMonth: 11, eventMonth: 11, eventDay: 25 },
];

export function FestivalTeaser() {
  const [teaser, setTeaser] = useState<{ festival: any; daysLeft: number } | null>(null);

  useEffect(() => {
    const checkDate = () => {
      const now = new Date();
      const currentYear = now.getFullYear();

      for (const f of FESTIVALS) {
        for (const year of [currentYear, currentYear + 1]) {
          
          // Check if this is an Islamic event and get its specific date
          let eventMonth = f.eventMonth;
          let eventDay = f.eventDay;
          
          if (ISLAMIC_DATES[f.id] && ISLAMIC_DATES[f.id][year]) {
            [eventMonth, eventDay] = ISLAMIC_DATES[f.id][year];
          }

          // The skin launches on the 1st of the skinStartMonth
          const skinStartDate = new Date(year, f.skinStartMonth, 1);
          
          // The teaser starts exactly 7 days before the 1st
          const teaserStartDate = new Date(skinStartDate);
          teaserStartDate.setDate(teaserStartDate.getDate() - 7);

          // If we are between the teaser start and the actual skin launch date
          if (now >= teaserStartDate && now < skinStartDate) {
            const diff = skinStartDate.getTime() - now.getTime();
            const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
            setTeaser({ festival: f, daysLeft });
            return;
          }
        }
      }
      setTeaser(null);
    };

    checkDate();
    const interval = setInterval(checkDate, 1000 * 60 * 60); // Check every hour
    return () => clearInterval(interval);
  }, []);

  if (!teaser) return null;

  return (
    <div className={`${teaser.festival.bgClass} text-white text-center py-2 px-4 text-[11px] md:text-xs font-bold tracking-wide flex items-center justify-center gap-2 animate-pulse`}>
      <span>{teaser.festival.icon}</span>
      <span>Get Ready! The Isource {teaser.festival.name} Sale starts in {teaser.daysLeft} day{teaser.daysLeft !== 1 ? 's' : ''}.</span>
      <span>{teaser.festival.icon}</span>
    </div>
  );
}