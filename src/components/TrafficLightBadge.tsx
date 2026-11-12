import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { StatusColor } from '../types';

interface TrafficLightBadgeProps {
  status: StatusColor;
  label?: string;
  subtext?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TrafficLightBadge: React.FC<TrafficLightBadgeProps> = ({
  status,
  label,
  subtext,
  size = 'md',
  className = '',
}) => {
  let colorClasses = '';
  let defaultLabel = '';
  let dotColor = '';
  let IconComponent = CheckCircle2;

  switch (status) {
    case 'GREEN':
      colorClasses = 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]';
      defaultLabel = 'Sah';
      dotColor = 'bg-[#16A34A]';
      IconComponent = CheckCircle2;
      break;
    case 'YELLOW':
      colorClasses = 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
      defaultLabel = 'Hampir Tamat';
      dotColor = 'bg-[#D97706]';
      IconComponent = AlertTriangle;
      break;
    case 'RED':
      colorClasses = 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]';
      defaultLabel = 'Tamat Tempoh';
      dotColor = 'bg-[#DC2626]';
      IconComponent = AlertOctagon;
      break;
  }

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px] gap-1.5 font-semibold rounded-md'
      : size === 'lg'
      ? 'px-3 py-1.5 text-xs sm:text-sm gap-2 font-bold rounded-lg'
      : 'px-2.5 py-1 text-xs gap-1.5 font-semibold rounded-md';

  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 13;

  return (
    <span
      className={`inline-flex items-center border tracking-tight transition-colors select-none ${colorClasses} ${sizeClasses} ${className}`}
      title={subtext || label || defaultLabel}
    >
      <IconComponent size={iconSize} className="shrink-0 stroke-[2.3]" />
      <span className="leading-none">{label || defaultLabel}</span>
      {subtext && (
        <span className="opacity-75 font-normal text-[10px] ml-0.5 font-mono">
          ({subtext})
        </span>
      )}
    </span>
  );
};
