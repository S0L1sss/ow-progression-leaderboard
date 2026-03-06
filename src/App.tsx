/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { heroLeaderboardData } from './constants';

export default function App() {
  const handleClaim = () => {
    window.open('https://forms.gle/esV24vw8FoZFC79g9', '_blank');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const HeroImage = ({ hero }: { hero: typeof heroLeaderboardData[0] }) => {
    const [error, setError] = useState(false);

    if (error) {
      return (
        <div className="w-[120px] h-[120px] rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-2xl transform skew-x-[15deg] border-2 border-white">
          {getInitials(hero.heroName)}
        </div>
      );
    }

    return (
      <img 
        src={hero.imageUrl} 
        alt={hero.heroName} 
        className="w-[120px] h-[120px] object-cover block rounded-full border-2 border-white transform skew-x-[15deg]" 
        referrerPolicy="no-referrer"
        onError={() => setError(true)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white p-8 font-sans">
      <header className="mb-12 text-center transform skew-x-[-15deg] bg-[#1A1A2E] p-6 border-b-4 border-[#218FFE]">
        <h1 className="text-5xl font-bold tracking-tighter uppercase italic text-white font-teko">
          Overwatch Hero Level Leaderboard
        </h1>
      </header>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
        {heroLeaderboardData.map((hero) => (
          <div key={hero.heroName} className="group relative bg-[#1e293b] rounded-xl overflow-hidden border border-white/10 transition-all hover:border-[#218FFE] transform skew-x-[-15deg] flex flex-col items-center p-4">
            <div className="flex items-center justify-center overflow-hidden m-4">
              <HeroImage hero={hero} />
            </div>
            <div className="p-4 bg-[#1A1A2E] w-full text-center skew-x-[15deg]">
              <h2 className="text-2xl font-bold font-teko italic uppercase">{hero.heroName}</h2>
              <p className="text-4xl font-bold font-teko italic text-gray-400">
                {hero.highestLevel === 0 ? '--' : hero.highestLevel}
              </p>
              <p className="text-sm text-gray-500 truncate">{hero.playerTag}</p>
            </div>
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-[#1A1A2E]/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={handleClaim}
                className="bg-[#218FFE] text-white font-bold py-2 px-6 rounded-sm transform skew-x-[15deg] hover:bg-[#1a73e8] transition-all"
              >
                SUBMIT RECORD
              </button>
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-12 text-center text-gray-500 text-sm font-teko italic uppercase">
        OVERWATCH LEVEL LEADERBOARD is an unofficial fan project created by SOLIS. Not affiliated with Blizzard Entertainment.
      </footer>
      <div className="mt-4 text-center text-[#888888] font-mono text-xs">
        DATABASE STATUS: <span className="text-[#00ff00] [text-shadow:0_0_5px_#00ff00]">[🟢 ONLINE]</span> | LAST AUDIT: March 5, 2026
      </div>
    </div>
  );
}
