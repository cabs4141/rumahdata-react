const SearchBar = ({ searchTerm, handleSearchChange }) => {
  return (
    <TextField
      size="small"
      placeholder="Cari data..."
      value={searchTerm}
      onChange={handleSearchChange}
      sx={{ width: 250 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar;
