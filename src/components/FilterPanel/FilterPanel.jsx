import './FilterPanel.css';

function FilterPanel({
  searchQuery,
  onSearchChange,
  emotions = [],
  selectedEmotions = [],
  onEmotionsChange,
  dateFilterSummary,
  onDateFilterClick,
  sortBy,
  onSortChange,
  sortOptions = []
}) {
  return (
    <div className="filter-panel">

      {/* Search */}
      {onSearchChange && (
        <div className="filter-group">
          <label>Search</label>
          <div className="search-input-wrapper">
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search..."
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="clear-btn"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Emotions */}
      {emotions.length > 0 && onEmotionsChange && (
        <div className="filter-group">
          <label>Filter by Emotion</label>
          <div className="checkbox-group">
            {emotions.map(e => (
              <label key={e.id}>
                <input
                  type="checkbox"
                  checked={selectedEmotions.includes(e.id)}
                  onChange={() => {
                    if (selectedEmotions.includes(e.id)) {
                      onEmotionsChange(selectedEmotions.filter(id => id !== e.id));
                    } else {
                      onEmotionsChange([...selectedEmotions, e.id]);
                    }
                  }}
                /> {e.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Date filter */}
      {onDateFilterClick && (
        <div className="filter-group">
          <label>Date</label>
          <button onClick={onDateFilterClick} className="date-btn">
            {dateFilterSummary || 'All Dates'}
          </button>
        </div>
      )}

      {/* Sort */}
      {onSortChange && sortOptions.length > 0 && (
        <div className="filter-group">
          <label>Sort By</label>
          <select value={sortBy} onChange={e => onSortChange(e.target.value)}>
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}

    </div>
  );
}

export default FilterPanel;
