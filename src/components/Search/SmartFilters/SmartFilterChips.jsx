import SmartFilterChip from './SmartFilterChip';

// Chips rendered inside the omnibox, before the text input: one line, scrolls horizontally in the header.
const SmartFilterChips = ({ chips, onRemove, onBroaden }) => {
  if (!chips.length) return null;

  return (
    <div className="smart-chips flex shrink items-center gap-1 min-w-0 max-w-[70%] overflow-x-auto [scrollbar-width:none]">
      {chips.map(chip => (
        <SmartFilterChip key={chip.key} chip={chip} onRemove={onRemove} onBroaden={onBroaden}/>
      ))}
    </div>
  );
};

export default SmartFilterChips;
