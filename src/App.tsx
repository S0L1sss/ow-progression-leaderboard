/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { heroLeaderboardData } from './constants';
import { Star, Award, Crown, Shield, Crosshair, Plus } from 'lucide-react';

export default function App() {
  const [showFabMessage, setShowFabMessage] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'All' | 'Tank' | 'Damage' | 'Support'>('All');

  const handleClaim = () => {
    window.open('https://forms.gle/esV24vw8FoZFC79g9', '_blank');
  };

  const getTier = (level: number) => {
    if (level >= 1000) return 4;
    if (level >= 500) return 3;
    if (level >= 300) return 2;
    if (level >= 100) return 1;
    return 0;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Tank': return <Shield size={16} className="text-blue-400" />;
      case 'Damage': return <Crosshair size={16} className="text-red-400" />;
      case 'Support': return <Plus size={16} className="text-green-400" />;
      default: return null;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const sortedHeroes = useMemo(() => {
    let filtered = heroLeaderboardData;
    if (selectedRole !== 'All') {
      filtered = filtered.filter(h => h.role === selectedRole);
    }
    
    const roleOrder: Record<string, number> = { 'Tank': 1, 'Damage': 2, 'Support': 3 };
    
    return [...filtered].sort((a, b) => {
      if (a.role !== b.role) {
        return (roleOrder[a.role] || 4) - (roleOrder[b.role] || 4);
      }
      return a.heroName.localeCompare(b.heroName);
    });
  }, [selectedRole]);

  const HeroImage = ({ hero, tier }: { hero: typeof heroLeaderboardData[0], tier: number }) => {
    const [error, setError] = useState(false);
    
    const glowClass = tier === 1 ? 'tier-100-glow' : tier === 2 ? 'tier-300-glow' : tier === 3 ? 'tier-500-glow' : '';

    if (error) {
      return (
        <div className={`w-[120px] h-[120px] rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-2xl transform skew-x-[15deg] border-2 border-white ${glowClass}`}>
          {getInitials(hero.heroName)}
        </div>
      );
    }

    return (
      <div className="relative">
        {tier === 4 && [...Array(5)].map((_, i) => (
          <div key={i} className="absolute inset-0 animate-gold-dust" style={{ animationDelay: `${i * 0.5}s` }}>
            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
          </div>
        ))}
        <img 
          src={hero.imageUrl} 
          alt={hero.heroName} 
          className={`w-[120px] h-[120px] object-cover block rounded-full border-2 border-white transform skew-x-[15deg] ${glowClass}`} 
          referrerPolicy="no-referrer"
          onError={() => setError(true)}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white p-4 md:p-8 font-sans overflow-x-hidden">
      <header className="mb-12 text-center transform skew-x-[-15deg] bg-[#1A1A2E] p-6 border-b-4 border-[#218FFE]">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase italic text-white font-teko">
          OW Progression Leaderboard | Global Bounties
        </h1>
        
        <div className="flex justify-center gap-4 mt-6">
          {['All', 'Tank', 'Damage', 'Support'].map(role => (
            <button 
              key={role}
              onClick={() => setSelectedRole(role as any)}
              className={`px-6 py-2 font-teko text-xl italic uppercase transition-all ${selectedRole === role ? 'bg-[#218FFE]' : 'bg-[#1e293b] hover:bg-[#2d3748]'}`}
            >
              {role}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {sortedHeroes.map((hero) => {
          const tier = getTier(hero.highestLevel);
          const borderClass = tier === 2 ? 'tier-300-border' : tier === 4 ? 'tier-1000-border' : 'border-white/10';
          
          return (
            <div key={hero.heroName} className={`group relative bg-[#1e293b] rounded-xl overflow-hidden border transition-all hover:border-[#218FFE] transform skew-x-[-15deg] flex flex-col items-center p-2 md:p-4 ${borderClass}`}>
              {tier === 3 && <Crown className="absolute top-2 text-purple-500" size={24} />}
              <div className="absolute top-2 left-2 bg-[#1A1A2E]/80 p-1 rounded-full">
                {getRoleIcon(hero.role)}
              </div>
              <div className="flex items-center justify-center overflow-hidden m-2 md:m-4">
                <HeroImage hero={hero} tier={tier} />
              </div>
              <div className="p-2 md:p-4 bg-[#1A1A2E] w-full text-center skew-x-[15deg]">
                <h2 className="text-xl md:text-2xl font-bold font-teko italic uppercase">{hero.heroName}</h2>
                <p className="text-2xl md:text-4xl font-bold font-teko italic text-gray-400 flex items-center justify-center gap-2">
                  {hero.highestLevel === 0 ? '--' : hero.highestLevel}
                  {tier === 1 && <Star className="text-gray-300" size={16} />}
                  {tier === 2 && <Award className="text-blue-500" size={16} />}
                </p>
                <p className={`text-xs md:text-sm text-gray-500 truncate ${tier === 4 ? 'burning-text' : ''}`}>{hero.playerTag}</p>
              </div>
              
              <div className="mt-2 md:absolute md:inset-0 md:bg-[#1A1A2E]/90 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:flex md:items-center md:justify-center">
                <button
                  onClick={handleClaim}
                  className="bg-[#218FFE] text-white font-bold py-2 px-4 md:px-6 rounded-sm transform skew-x-[15deg] hover:bg-[#1a73e8] transition-all min-h-[44px] min-w-[44px]"
                >
                  SUBMIT
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => {
          setShowFabMessage(true);
          setTimeout(() => setShowFabMessage(false), 3000);
        }}
        className="fixed bottom-6 right-6 bg-[#FF9C00] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-[#ffb033] transition-all z-50 text-2xl"
      >
        +
      </button>

      {showFabMessage && (
        <div className="fixed bottom-24 right-6 bg-white text-[#1A1A2E] p-4 rounded-lg shadow-lg z-50 animate-bounce">
          Found a new record? Tap a hero to submit your screenshot!
        </div>
      )}

      <footer className="mt-12 text-center text-gray-500 text-xs md:text-sm font-teko italic uppercase">
        OVERWATCH LEVEL LEADERBOARD is an unofficial fan project created by SOLIS. Not affiliated with Blizzard Entertainment.
      </footer>
      <div className="mt-4 text-center text-[#888888] font-mono text-[10px] md:text-xs">
        DATABASE STATUS: <span className="text-[#00ff00] [text-shadow:0_0_5px_#00ff00]">[🟢 ONLINE]</span> | LAST AUDIT: March 5, 2026
      </div>
    </div>
  );
}
