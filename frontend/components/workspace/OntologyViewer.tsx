import React from 'react';
import GlassCard from '../GlassCard';
import { Leaf, Activity, Droplets, Flame, Wind, Stethoscope, Pill } from 'lucide-react';

interface OntologyViewerProps {
  data: any;
  renderSection?: 'translation' | 'details' | 'all';
}

export default function OntologyViewer({ data, renderSection = 'all' }: OntologyViewerProps) {
  if (!data) return null;

  // Helpers to get Dosha balance percentages (just mock logic based on the text if not numeric, but let's try to map it)
  const getDoshaPercentage = (doshaName: string) => {
    // If dosha_influence is provided as dict with +/- numbers
    if (data.dosha_influence && data.dosha_influence[doshaName.toLowerCase()]) {
      const val = data.dosha_influence[doshaName.toLowerCase()];
      if (typeof val === 'number') {
        // e.g. -1 for pacifying, +1 for aggravating. Just map to a width 0-100%
        return val < 0 ? 30 : val > 0 ? 80 : 50; 
      } else if (typeof val === 'string') {
        if (val.toLowerCase().includes('pacif')) return 25;
        if (val.toLowerCase().includes('aggravat') || val.toLowerCase().includes('increas')) return 85;
      }
    }
    // Fallback based on doshas list
    if (data.doshas && data.doshas.some((d: string) => d.toLowerCase() === doshaName.toLowerCase())) {
        return 20; // pacified
    }
    return 50; // neutral
  };

  const vataWidth = getDoshaPercentage('vata');
  const pittaWidth = getDoshaPercentage('pitta');
  const kaphaWidth = getDoshaPercentage('kapha');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      
      {/* 1. Translation & Overview */}
      {(renderSection === 'all' || renderSection === 'translation') && (
      <GlassCard>
        <h3 className="font-serif text-lg font-bold mb-4 text-gold-500">Sanskrit to English Translation</h3>
        <p className="text-[var(--foreground)] text-sm leading-relaxed mb-4">
          {data.translation || "No translation provided."}
        </p>
        
        {data.modern_interpretation && (
          <div className="mt-4 p-4 rounded-xl bg-sandy-500/5 border border-sandy-500/10">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-sandy-500 mb-2">Modern Interpretation</h4>
            <p className="text-sm opacity-90">{data.modern_interpretation}</p>
          </div>
        )}
      </GlassCard>
      )}

      {(renderSection === 'all' || renderSection === 'details') && (
        <>
      <div className="grid grid-cols-1 gap-6">
        {/* Ingredients Table */}
        <GlassCard>
          <h3 className="font-serif text-lg font-bold mb-4 uppercase tracking-widest text-gold-500">
            Ingredients
          </h3>
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto pr-2 custom-scrollbar border border-sandy-500/20 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-[#12141a] z-10 text-sandy-500 font-semibold border-b border-sandy-500/20">
                <tr>
                  <th className="px-4 py-3 border-r border-sandy-500/10">Sanskrit Name</th>
                  <th className="px-4 py-3 border-r border-sandy-500/10">Transliteration</th>
                  <th className="px-4 py-3 border-r border-sandy-500/10">Common Name</th>
                  <th className="px-4 py-3">Botanical Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandy-500/10 bg-[#0a0b0f]">
                {data.ingredients && data.ingredients.length > 0 ? (
                  data.ingredients.map((ing: any, i: number) => (
                    <tr key={i} className="hover:bg-sandy-500/5 transition-colors group">
                      <td className="px-4 py-3 font-semibold text-gray-200 border-r border-sandy-500/10">{ing.sanskrit_name || ing.name || ''}</td>
                      <td className="px-4 py-3 font-semibold text-gray-200 border-r border-sandy-500/10">{ing.transliteration || ''}</td>
                      <td className="px-4 py-3 font-semibold text-gray-200 border-r border-sandy-500/10">{ing.common_name || ''}</td>
                      <td className="px-4 py-3 font-semibold text-gray-200">{ing.botanical_name || ''}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="px-4 py-4 text-center opacity-50">No ingredients found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* 2. Word Meanings */}
        <GlassCard>
          <h3 className="font-serif text-lg font-bold mb-4 uppercase tracking-widest text-gold-500">
            Word Meanings
          </h3>
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto pr-2 custom-scrollbar border border-sandy-500/20 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-[#12141a] z-10 text-sandy-500 font-semibold border-b border-sandy-500/20">
                <tr>
                  <th className="px-4 py-3 border-r border-sandy-500/10">word</th>
                  <th className="px-4 py-3 border-r border-sandy-500/10">transliteration</th>
                  <th className="px-4 py-3">meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandy-500/10 bg-[#0a0b0f]">
                {data.word_meanings && data.word_meanings.length > 0 ? (
                  data.word_meanings.map((wm: any, i: number) => (
                    <tr key={i} className="hover:bg-sandy-500/5 transition-colors group">
                      <td className="px-4 py-3 font-semibold text-gray-200 border-r border-sandy-500/10">{wm.sanskrit || wm.word || ''}</td>
                      <td className="px-4 py-3 font-semibold text-gray-200 border-r border-sandy-500/10">{wm.transliteration || ''}</td>
                      <td className="px-4 py-3 font-semibold text-gray-200">{wm.english || wm.meaning || ''}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3} className="px-4 py-4 text-center opacity-50">No word meanings found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

        {/* 3. Dosha Balance Analysis */}
        <GlassCard>
          <h3 className="font-serif text-lg font-bold mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-gold-500" />
            Dosha Balance Analysis
          </h3>
          
          <div className="space-y-6">
            {/* Vata */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="flex items-center text-blue-400"><Wind className="w-4 h-4 mr-1"/> Vata (Air/Space)</span>
                <span className="text-sandy-500">{vataWidth < 40 ? 'Pacifies' : vataWidth > 60 ? 'Aggravates' : 'Neutral'}</span>
              </div>
              <div className="h-2 w-full bg-sandy-500/20 rounded-full overflow-hidden">
                <div className={`h-full bg-blue-400 rounded-full transition-all duration-1000`} style={{ width: `${vataWidth}%` }}></div>
              </div>
            </div>
            
            {/* Pitta */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="flex items-center text-red-400"><Flame className="w-4 h-4 mr-1"/> Pitta (Fire/Water)</span>
                <span className="text-sandy-500">{pittaWidth < 40 ? 'Pacifies' : pittaWidth > 60 ? 'Aggravates' : 'Neutral'}</span>
              </div>
              <div className="h-2 w-full bg-sandy-500/20 rounded-full overflow-hidden">
                <div className={`h-full bg-red-400 rounded-full transition-all duration-1000`} style={{ width: `${pittaWidth}%` }}></div>
              </div>
            </div>

            {/* Kapha */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="flex items-center text-green-400"><Droplets className="w-4 h-4 mr-1"/> Kapha (Water/Earth)</span>
                <span className="text-sandy-500">{kaphaWidth < 40 ? 'Pacifies' : kaphaWidth > 60 ? 'Aggravates' : 'Neutral'}</span>
              </div>
              <div className="h-2 w-full bg-sandy-500/20 rounded-full overflow-hidden">
                <div className={`h-full bg-green-400 rounded-full transition-all duration-1000`} style={{ width: `${kaphaWidth}%` }}></div>
              </div>
            </div>
          </div>
        </GlassCard>

      {/* 4. Rasa Panchaka & Ingredients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="font-serif text-lg font-bold mb-4 text-gold-500">Rasa Panchaka</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-sandy-500/5 rounded-xl border border-sandy-500/10">
              <p className="text-[10px] text-sandy-500 uppercase font-semibold mb-1">Rasa (Taste)</p>
              <p className="text-sm font-semibold">{Array.isArray(data.rasa) ? data.rasa.join(', ') : data.rasa || 'N/A'}</p>
            </div>
            <div className="p-3 bg-sandy-500/5 rounded-xl border border-sandy-500/10">
              <p className="text-[10px] text-sandy-500 uppercase font-semibold mb-1">Virya (Potency)</p>
              <p className="text-sm font-semibold">{data.virya || 'N/A'}</p>
            </div>
            <div className="p-3 bg-sandy-500/5 rounded-xl border border-sandy-500/10">
              <p className="text-[10px] text-sandy-500 uppercase font-semibold mb-1">Vipaka (Post-Digestive)</p>
              <p className="text-sm font-semibold">{data.vipaka || 'N/A'}</p>
            </div>
            <div className="p-3 bg-sandy-500/5 rounded-xl border border-sandy-500/10">
              <p className="text-[10px] text-sandy-500 uppercase font-semibold mb-1">Guna (Qualities)</p>
              <p className="text-sm font-semibold">{Array.isArray(data.guna) ? data.guna.join(', ') : data.guna || 'N/A'}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-serif text-lg font-bold mb-4 uppercase tracking-widest text-gold-500">
            Dosage
          </h3>
          <div className="border border-gold-500/20 rounded-xl p-6 bg-gold-500/5">
            {data.dosage ? (
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <span className="text-xs text-sandy-500 uppercase tracking-widest mb-3 block">Amount</span>
                  <span className="text-base font-medium opacity-90">{data.dosage.amount || data.dosage.quantity || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-xs text-sandy-500 uppercase tracking-widest mb-3 block">Frequency</span>
                  <span className="text-base font-medium opacity-90">{data.dosage.time || data.dosage.frequency || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-xs text-sandy-500 uppercase tracking-widest mb-3 block">Anupana</span>
                  <span className="text-base font-medium opacity-90">{data.dosage.anupana || data.dosage.vehicle || 'Not specified'}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm opacity-50">No specific dosage information found.</p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* 5. Therapeutic Actions & Indications */}
      <GlassCard className="mt-8 space-y-8">
        {/* Actions */}
        <div>
          <h4 className="font-serif text-lg font-bold mb-4 uppercase tracking-widest text-gold-500">Therapeutic Actions</h4>
          <div className="flex flex-wrap gap-4">
            {data.actions && data.actions.length > 0 ? data.actions.map((act: string, idx: number) => (
              <span key={idx} className="px-4 py-2 border border-gold-500/40 text-gold-600 font-medium text-sm font-serif bg-gold-500/10 rounded-lg shadow-sm">
                {act}
              </span>
            )) : <span className="text-xs opacity-50">None extracted</span>}
          </div>
        </div>

        {/* Diseases */}
        <div>
          <h4 className="font-serif text-lg font-bold mb-4 uppercase tracking-widest text-gold-500">Addressed Conditions</h4>
          <div className="flex flex-wrap gap-4">
            {data.diseases && data.diseases.length > 0 ? data.diseases.map((dis: string, idx: number) => (
              <span key={idx} className="px-4 py-2 border border-gold-500/40 text-gold-600 font-medium text-sm font-serif bg-gold-500/10 rounded-lg shadow-sm">
                {dis}
              </span>
            )) : <span className="text-xs opacity-50">None extracted</span>}
          </div>
        </div>

        {/* Body Systems */}
        <div>
          <h4 className="font-serif text-lg font-bold mb-4 uppercase tracking-widest text-gold-500">Body Systems</h4>
          <div className="flex flex-wrap gap-4">
            {data.body_systems && data.body_systems.length > 0 ? data.body_systems.map((sys: string, idx: number) => (
              <span key={idx} className="px-4 py-2 border border-gold-500/40 text-gold-600 font-medium text-sm font-serif bg-gold-500/10 rounded-lg shadow-sm">
                {sys}
              </span>
            )) : <span className="text-xs opacity-50">None extracted</span>}
          </div>
        </div>
      </GlassCard>
      </>
      )}

    </div>
  );
}
