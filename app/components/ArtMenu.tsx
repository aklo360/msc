interface ArtMenuProps {
  accentColor?: string;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  filterLabel?: string;
}

/**
 * Art section filter/menu bar.
 * Horizontal bar below the hero: 100px tall, px-60, py-30.
 * Left: "All Series" filter pill with filter icon.
 * Right: gallery view / list view toggle icons + sort icon.
 */
export function ArtMenu({accentColor = '#FF9E70', viewMode, onViewModeChange, filterLabel = 'All Series'}: ArtMenuProps) {

  return (
    <div className="flex items-center justify-between h-[100px] px-[60px] max-md:px-[20px] py-[30px]">
      {/* Filter pill */}
      <div className="flex items-center gap-[10px]">
        <button
          className="flex items-center gap-[8px] rounded-[20px] py-[5px] px-[16px] font-[family-name:var(--font-body,_sans-serif)] text-[18px] max-md:text-[14px] font-medium leading-[1.2] uppercase border-0 cursor-pointer"
          style={{
            backgroundColor: accentColor,
            color: '#000000',
          }}
        >
          {/* Filter icon (Lucide SlidersHorizontal) */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <line x1="21" x2="14" y1="4" y2="4" />
            <line x1="10" x2="3" y1="4" y2="4" />
            <line x1="21" x2="12" y1="12" y2="12" />
            <line x1="8" x2="3" y1="12" y2="12" />
            <line x1="21" x2="16" y1="20" y2="20" />
            <line x1="12" x2="3" y1="20" y2="20" />
            <line x1="14" x2="14" y1="2" y2="6" />
            <line x1="8" x2="8" y1="10" y2="14" />
            <line x1="16" x2="16" y1="18" y2="22" />
          </svg>
          {filterLabel}
        </button>
      </div>

      {/* View toggle + sort icons */}
      <div className="flex items-center gap-[10px]">
        {/* Grid view — no box; active state shown via icon color */}
        <button
          onClick={() => onViewModeChange('grid')}
          className="w-[35px] h-[35px] flex items-center justify-center border-0 bg-transparent cursor-pointer transition-colors duration-200"
          style={{
            color: viewMode === 'grid' ? '#000000' : '#7F7F7F',
          }}
          aria-label="Gallery view"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="0" y="0" width="7" height="7" fill="currentColor" />
            <rect x="9" y="0" width="7" height="7" fill="currentColor" />
            <rect x="0" y="9" width="7" height="7" fill="currentColor" />
            <rect x="9" y="9" width="7" height="7" fill="currentColor" />
          </svg>
        </button>

        {/* List view — no box; active state shown via icon color */}
        <button
          onClick={() => onViewModeChange('list')}
          className="w-[35px] h-[35px] flex items-center justify-center border-0 bg-transparent cursor-pointer transition-colors duration-200"
          style={{
            color: viewMode === 'list' ? '#000000' : '#7F7F7F',
          }}
          aria-label="List view"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="0" y="0" width="16" height="3" fill="currentColor" />
            <rect x="0" y="5" width="16" height="3" fill="currentColor" />
            <rect x="0" y="10" width="16" height="3" fill="currentColor" />
          </svg>
        </button>

        {/* Sort */}
        <button
          className="w-[35px] h-[35px] flex items-center justify-center rounded-[6px] border-0 cursor-pointer transition-colors duration-200 bg-white text-black"
          aria-label="Sort"
        >
          {/* Lucide ArrowUpDown */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21 16-4 4-4-4" />
            <path d="M17 20V4" />
            <path d="m3 8 4-4 4 4" />
            <path d="M7 4v16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
