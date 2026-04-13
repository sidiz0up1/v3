import React from 'react';
import { HorizontalValue } from '../types';

interface PostureInputProps {
  label: string;
  value: number | null;
  onChange: (val: number | null) => void;
  unit?: string;
  description?: string;
  range?: { min: number; max: number; label: string }[];
  horizontal?: boolean;
  horizontalValue?: HorizontalValue | null;
  onHorizontalChange?: (val: HorizontalValue | null) => void;
}

export const PostureInput: React.FC<PostureInputProps> = ({
  label,
  value,
  onChange,
  unit = '°',
  description,
  range,
  horizontal = false,
  horizontalValue,
  onHorizontalChange,
}) => {
  const [localValue, setLocalValue] = React.useState<string>(value === null ? '' : value.toString());
  const [localHorizontalValue, setLocalHorizontalValue] = React.useState<string>(horizontalValue?.value === undefined ? '' : horizontalValue.value.toString());

  React.useEffect(() => {
    const parsedLocal = parseFloat(localValue);
    const isPartial = localValue === '-' || localValue === '.' || localValue === '-.' || localValue.endsWith('.');
    if (value !== null && parsedLocal !== value && !isPartial) {
      setLocalValue(value.toString());
    } else if (value === null && localValue !== '') {
      setLocalValue('');
    }
  }, [value]);

  React.useEffect(() => {
    const parsedLocal = parseFloat(localHorizontalValue);
    const isPartial = localHorizontalValue === '-' || localHorizontalValue === '.' || localHorizontalValue === '-.' || localHorizontalValue.endsWith('.');
    if (horizontalValue?.value !== undefined && parsedLocal !== horizontalValue.value && !isPartial) {
      setLocalHorizontalValue(horizontalValue.value.toString());
    } else if (horizontalValue?.value === undefined && localHorizontalValue !== '') {
      setLocalHorizontalValue('');
    }
  }, [horizontalValue?.value]);

  const getStatusColor = () => {
    if (value === null && !horizontalValue) return 'bg-slate-100 text-slate-400';
    
    if (horizontal && horizontalValue) {
      if (horizontalValue.value <= 2) return 'bg-emerald-100 text-emerald-700';
      return 'bg-rose-100 text-rose-700';
    }

    if (range && value !== null) {
      const normalRange = range.find(r => r.label === '정상');
      if (normalRange) {
        if (value >= normalRange.min && value <= normalRange.max) return 'bg-emerald-100 text-emerald-700';
      }
      return 'bg-rose-100 text-rose-700';
    }
    return 'bg-slate-100 text-slate-700';
  };

  const getStatusText = () => {
    if (value === null && !horizontalValue) return '미입력';
    if (horizontal && horizontalValue) {
      return horizontalValue.value <= 2 ? '정상' : '심각';
    }
    if (range && value !== null) {
      const currentRange = range.find(r => value >= r.min && value <= r.max);
      return currentRange ? currentRange.label : '심각';
    }
    return '입력됨';
  };

  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-indigo-200 transition-colors">
      <div className="flex justify-between items-start">
        <label className="text-sm sidiz-voice-3 text-slate-700">{label}</label>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full sidiz-voice-3 ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        {horizontal ? (
          <div className="flex items-center gap-1 w-full">
            <select 
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-eng"
              value={horizontalValue?.direction || 'None'}
              onChange={(e) => onHorizontalChange?.({ 
                direction: e.target.value as 'L' | 'R' | 'None', 
                value: horizontalValue?.value || 0 
              })}
            >
              <option value="None">-</option>
              <option value="L">왼</option>
              <option value="R">오</option>
            </select>
            <input
              type="text"
              inputMode="decimal"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-eng"
              placeholder="0.0"
              value={localHorizontalValue}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || val === '-' || val === '.' || val === '-.' || !isNaN(Number(val))) {
                  setLocalHorizontalValue(val);
                  const parsed = parseFloat(val);
                  if (!isNaN(parsed)) {
                    onHorizontalChange?.({ 
                      direction: horizontalValue?.direction || 'None', 
                      value: parsed 
                    });
                  } else if (val === '') {
                    onHorizontalChange?.({ 
                      direction: horizontalValue?.direction || 'None', 
                      value: 0 
                    });
                  }
                }
              }}
            />
            <span className="text-slate-400 text-sm font-eng">{unit}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              inputMode="decimal"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-eng"
              placeholder="0.0"
              value={localValue}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || val === '-' || val === '.' || val === '-.' || !isNaN(Number(val))) {
                  setLocalValue(val);
                  const parsed = parseFloat(val);
                  if (!isNaN(parsed)) {
                    onChange(parsed);
                  } else if (val === '') {
                    onChange(null);
                  }
                }
              }}
            />
            <span className="text-slate-400 text-sm font-eng">{unit}</span>
          </div>
        )}
      </div>

      {description && (
        <p className="text-[11px] text-slate-400 leading-tight sidiz-voice-1">{description}</p>
      )}
      
      {range && (
        <div className="flex flex-wrap gap-1 mt-1">
          {range.map((r, i) => (
            <span key={i} className="text-[9px] text-slate-400 bg-slate-50 px-1 rounded sidiz-voice-1 font-eng">
              {r.label}: {r.min}~{r.max}°
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
