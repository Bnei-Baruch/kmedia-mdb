import { useTranslation } from 'react-i18next';

// Omnibox dropdown row for a filter proposed while typing: [filter_alt] Kabbalists: Rashbi › Zohar   «zohar»
const SmartProposal = ({ item, mention, label }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[18px]! leading-none! text-[#2185d0]" aria-hidden="true">filter_alt</span>
      <span className="flex-1 min-w-0 truncate">
        <span className="text-black/60">{t(`filters.aside-filter.${item.name}`)}: </span>
        {label}
      </span>
      <span className="text-[12px] text-black/40 whitespace-nowrap">«{mention}»</span>
    </div>
  );
};

export default SmartProposal;
