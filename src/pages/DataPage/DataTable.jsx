import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";
import Popover from "@mui/material/Popover";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import FilterListIcon from "@mui/icons-material/FilterList";
import MenuItem from "@mui/material/MenuItem";

import UploadFile from "@/pages/DataPage/UploadFile";
import ModalDetailUser from "@/features/users/components/ModalDetailUser";
import ModalDetailSekolah from "@/features/sekolah/components/ModalDetailSekolah";
import ModalConfirm from "@/pages/DataPage/Modal";

import { useEffect, useState, useMemo, useCallback, memo, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useNotificationStore } from "@/stores/useNotifStore";
import { useUserStore } from "@/features/users/stores/useUserStore";
import { useSekolahStore } from "@/features/sekolah/stores/useSekolahStore";

const DataTable = ({ isFetching, columns, dataTitle, data, totalPages, isLoading, currentLimit, currentPage, onFetch, onDelete, onUpload, initialSearch = "", filterOptions, filterLabel = "Kabupaten", filterKey = "kabupaten", tahapOptions, tahunOptions, currentFilters, onFilterChange, onFilterOpen, extraActions, onRowClick }) => {
  const { showNotification } = useNotificationStore();
  const { token, getUserDetail, clearSelectedUser } = useUserStore();
  const { getSekolahDetail } = useSekolahStore();

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [open, setOpen] = useState(false);
  const [openSekolah, setOpenSekolah] = useState(false);

  // Column Visibility State
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null); // State for Data Filter popover

  // Unique key for localStorage based on dataTitle (fallback to 'default' if not provided)
  // Remove spaces and convert to lowercase for a clean key
  const storageKey = useMemo(() => {
    const cleanTitle = dataTitle ? dataTitle.replace(/\s+/g, '_').toLowerCase() : 'default_table';
    return `table_columns_${cleanTitle}`;
  }, [dataTitle]);

  const [visibleColumns, setVisibleColumns] = useState(() => {
    // 1. Try to load from localStorage
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with current columns to handle new/removed columns
        const initial = {};
        columns.forEach(col => {
          // If saved has the key, use it. If not, use default from prop.
          if (Object.prototype.hasOwnProperty.call(parsed, col.accessor)) {
            initial[col.accessor] = parsed[col.accessor];
          } else {
            initial[col.accessor] = !col.hide;
          }
        });
        return initial;
      }
    } catch (e) {
      console.error("Failed to load columns from storage", e);
    }

    // 2. Fallback to default props
    const initialVisibility = {};
    columns.forEach((col) => {
      initialVisibility[col.accessor] = !col.hide;
    });
    return initialVisibility;
  });

  // Save to localStorage whenever visibleColumns changes
  useEffect(() => {
    if (Object.keys(visibleColumns).length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(visibleColumns));
    }
  }, [visibleColumns, storageKey]);

  // Effect to handle if columns prop changes significantly (optional, but good for safety)
  // We generally trust the initial state logic, but if columns change dynamically without unmount, we might need this.
  // For now, let's keep it simple: we rely on initial state. 
  // If we wanted to react to `columns` prop changes (like new columns added), the current logic 
  // only runs on mount. 
  // Let's add an effect to sync NEW columns if they are missing from visibleColumns state.
  useEffect(() => {
    setVisibleColumns(prev => {
      const next = { ...prev };
      let changed = false;
      columns.forEach(col => {
        if (!Object.prototype.hasOwnProperty.call(next, col.accessor)) {
          next[col.accessor] = !col.hide;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [columns]);


  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleColumnToggle = (accessor) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [accessor]: !prev[accessor],
    }));
  };

  const openFilter = Boolean(anchorEl);
  const idFilter = openFilter ? "simple-popover" : undefined;

  const totalHalaman = totalPages ? totalPages?.toLocaleString("id-ID") : "0";
  const isSekolah = dataTitle?.toLowerCase().includes("sekolah");
  const isDataUser = dataTitle?.toLowerCase().includes("user");
  const decoded = jwtDecode(token);
  const userRole = decoded?.role;
  const isUserRole = userRole == "user";

  // Filter columns to render
  const renderedColumns = useMemo(() => {
    return columns.filter(col => visibleColumns[col.accessor]);
  }, [columns, visibleColumns]);

  // Use a ref to track if it's the first render to avoid double fetching strictly via debounce
  const isFirstRender = useRef(true);

  // Custom hook for debouncing value
  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
  }

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Effect to trigger search when debounced term changes, OR when filters change
  useEffect(() => {
    // Prevent overriding the initial load if the debounced term is empty on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Optional: you can choose to fetch here once, but only if you assume the parent hasn't already fetched
      onFetch(debouncedSearchTerm, 1, currentLimit);
      return;
    }

    onFetch(debouncedSearchTerm, 1, currentLimit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, currentFilters]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      onFetch(searchTerm, currentPage + 1, currentLimit);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      onFetch(searchTerm, currentPage - 1, currentLimit);
    }
  };

  const handleLimit = (e) => {
    const newLimit = parseInt(e.target.value);
    onFetch(searchTerm, 1, newLimit);
  };

  const handleDelete = async () => {
    try {
      await onDelete();
      showNotification("Data berhasil dihapus", "success");
      onFetch(searchTerm, currentPage, currentLimit);
    } catch (error) {
      showNotification(error.message || "terjadi kesalahan", "error");
    }
  };

  const handleInputSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    onFetch(searchTerm, 1, currentLimit);
  };

  const handleOpenModal = useCallback(
    async (row) => {
      if (isDataUser) {
        try {
          await getUserDetail(row.id);
          setOpen(true);
        } catch (err) {
          showNotification("Gagal mengambil detail user", "error");
          console.log(err);
        }
      } else {
        setOpen(true);
      }
    },
    [isDataUser, getUserDetail, showNotification],
  );

  const handleCloseModal = () => {
    setOpen(false);
    clearSelectedUser();
  };

  const handleSekolahDetail = useCallback(
    async (row) => {
      try {
        await getSekolahDetail(row.sekolah_id);
        setOpenSekolah(true);
      } catch (error) {
        console.log("error func", error);
      }
    },
    [getSekolahDetail],
  );

  const handleCloseModalSekolah = () => {
    setOpenSekolah(false);
  };

  const handleOpenFilterClick = (e) => {
    setFilterAnchorEl(e.currentTarget);
    if (onFilterOpen) {
      onFilterOpen();
    }
  };

  const TableContent = useMemo(() => {
    return (
      <TableContainer component={Paper} sx={{ flexGrow: 1, overflow: "auto" }}>
        <Table stickyHeader size="small">
          <TableHead sx={{ whiteSpace: "nowrap" }}>
            <TableRow>
              {renderedColumns.map((col, index) => (
                <TableCell key={index} sx={{ bgcolor: "#f5f5f5", fontWeight: "bold" }}>
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isFetching ? (
              [...Array(currentLimit || 5)].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {renderedColumns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton variant="text" animation="wave" height={30} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  hover
                  onClick={() => {
                    if (onRowClick) return onRowClick(row);
                    if (isDataUser) handleOpenModal(row);
                  }}
                  sx={{ cursor: (onRowClick || isDataUser) ? "pointer" : "default", whiteSpace: "nowrap" }}
                >
                  {renderedColumns.map((col, colIndex) => (
                    <TableCell onClick={() => isSekolah && handleSekolahDetail(row)} className={isSekolah ? "cursor-pointer" : ""} key={colIndex}>
                      {isSekolah ? (
                        <Tooltip title="Klik untuk lihat detail sekolah" arrow>
                          {/* Bungkus span agar tooltip bekerja sempurna */}
                          <span>{col.render ? col.render(row, rowIndex) : row[col.accessor]}</span>
                        </Tooltip>
                      ) : col.render ? (
                        col.render(row, rowIndex)
                      ) : (
                        row[col.accessor]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={renderedColumns.length} align="center" sx={{ py: 10 }}>
                  <Typography color="textSecondary">Data tidak ditemukan</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }, [isFetching, data, renderedColumns, currentLimit, isDataUser, isSekolah, handleOpenModal, handleSekolahDetail]);

  if (isLoading) {
    return (
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" size={60} />
        <Typography variant="h6" component="div">
          Mohon Tunggu...
        </Typography>
      </Backdrop>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div className="flex flex-row justify-between mb-4 mx-2 ">
        <div className="flex items-center gap-4">
          <Typography variant="h6" sx={{ flexShrink: 0 }}>
            {dataTitle}
          </Typography>

          {/* Filter Kolom Button */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<ViewColumnIcon />}
            onClick={handleFilterClick}
            sx={{ textTransform: 'none', color: 'text.secondary', borderColor: 'divider' }}
          >
            Filter Kolom
          </Button>

          {/* Filter Data Button - Only show if onFilterChange is provided */}
          {onFilterChange && (
            <>
              <Button
                variant="outlined"
                size="small"
                startIcon={<FilterListIcon />}
                onClick={handleOpenFilterClick}
                sx={{ textTransform: 'none', color: 'text.secondary', borderColor: 'divider' }}
              >
                Filter Data
              </Button>
              <Popover
                open={Boolean(filterAnchorEl)}
                anchorEl={filterAnchorEl}
                onClose={() => setFilterAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              >
                <Box sx={{ p: 2, minWidth: 250 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>Filter Data</Typography>
                  {/* Primary Filter (Kabupaten / Jenjang / etc.) */}
                  {filterOptions?.length > 0 ? (
                    <TextField
                      select
                      label={filterLabel}
                      fullWidth
                      size="small"
                      value={currentFilters?.[filterKey] || ""}
                      onChange={(e) => {
                        onFilterChange({ [filterKey]: e.target.value });
                      }}
                      sx={{ mb: 2 }}
                    >
                      <MenuItem value="">
                        <em>Semua {filterLabel}</em>
                      </MenuItem>
                      {filterOptions.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : filterOptions && onFilterOpen ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, p: 2 }}>
                      <CircularProgress size={24} sx={{ mb: 1 }} />
                      <Typography variant="caption" color="textSecondary">Memuat filter {filterLabel}...</Typography>
                    </Box>
                  ) : null}
                  {/* Tahap Filter */}
                  {tahapOptions?.length > 0 ? (
                    <TextField
                      select
                      label="Tahap"
                      fullWidth
                      size="small"
                      value={currentFilters?.tahap || ""}
                      onChange={(e) => {
                        onFilterChange({ tahap: e.target.value });
                      }}
                      sx={{ mb: 1 }}
                    >
                      <MenuItem value="">
                        <em>Semua Tahap</em>
                      </MenuItem>
                      {tahapOptions.map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : tahapOptions && onFilterOpen ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1, p: 2 }}>
                      <CircularProgress size={24} sx={{ mb: 1 }} />
                      <Typography variant="caption" color="textSecondary">Memuat filter Tahap...</Typography>
                    </Box>
                  ) : null}
                  {/* Tahun Filter */}
                  {tahunOptions?.length > 0 ? (
                    <TextField
                      select
                      label="Tahun"
                      fullWidth
                      size="small"
                      value={currentFilters?.tahun || ""}
                      onChange={(e) => {
                        onFilterChange({ tahun: e.target.value });
                      }}
                      sx={{ mb: 1 }}
                    >
                      <MenuItem value="">
                        <em>Semua Tahun</em>
                      </MenuItem>
                      {tahunOptions.map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : tahunOptions && onFilterOpen ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1, p: 2 }}>
                      <CircularProgress size={24} sx={{ mb: 1 }} />
                      <Typography variant="caption" color="textSecondary">Memuat filter Tahun...</Typography>
                    </Box>
                  ) : null}
                </Box>
              </Popover>
            </>
          )}

          <Popover
            id={idFilter}
            open={openFilter}
            anchorEl={anchorEl}
            onClose={handleFilterClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Box sx={{ p: 2, maxHeight: 400, overflowY: 'auto', minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Tampilkan Kolom:</Typography>
              <FormGroup>
                {columns.map((col) => (
                  <FormControlLabel
                    key={col.accessor}
                    control={
                      <Checkbox
                        checked={!!visibleColumns[col.accessor]}
                        onChange={() => handleColumnToggle(col.accessor)}
                        size="small"
                      />
                    }
                    label={<Typography variant="body2">{col.header}</Typography>}
                  />
                ))}
              </FormGroup>
            </Box>
          </Popover>
        </div>

        {isDataUser ? (
          <div className="flex gap-2">
            <TextField
              size="small"
              placeholder="cari user..."
              value={searchTerm}
              onChange={handleInputSearch}
              sx={{ width: 250 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            {isUserRole !== true && extraActions}
          </div>
        ) : (
          <form onSubmit={handleSearch} className="flex gap-2">
            <TextField
              size="small"
              placeholder="cari data..."
              value={searchTerm}
              onChange={handleInputSearch}
              sx={{ width: 250 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <>
              {extraActions}
              {onUpload && (
                <UploadFile open={openModal} setOpen={setOpenModal} onUpload={onUpload} />
              )}
              {onDelete && (
                <Button onClick={() => setOpenDelete(true)} color="error" variant="contained" startIcon={<DeleteIcon fontSize="small" />} size="small" disabled={!data || data.length === 0}>
                  Hapus Data
                </Button>
              )}
            </>
          </form>
        )}
      </div>

      <ModalConfirm
        title={" Apakah Anda yakin ingin menghapus seluruh data? Tindakan ini tidak dapat dibatalkan dan semua data yang ada di tabel ini akan hilang secara permanen."}
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
      <ModalDetailUser isOpen={open} handleClose={handleCloseModal} onRefresh={() => onFetch(searchTerm, currentPage, currentLimit)} />
      <ModalDetailSekolah open={openSekolah} handleClose={handleCloseModalSekolah} />

      {/* Render Tabel yang sudah di-memoize */}
      {TableContent}

      <Box sx={{ p: 2, flexShrink: 0, borderTop: "1px solid #eee" }}>
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-2 ">
            <label className="text-sm">Tampilkan:</label>
            <select value={currentLimit} onChange={handleLimit} className="rounded border border-stroke bg-transparent py-1 px-2 outline-none focus:border-primary dark:border-strokedark">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm">data per halaman</span>
          </div>
          <div className="flex flex-row gap-8 justify-end items-center">
            <div className="text-sm">
              halaman <span>{currentPage}</span> dari <span>{totalHalaman}</span>
            </div>
            <div className="flex gap-2">
              <button
                className={`flex items-center justify-center p-1 rounded border transition-colors ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600 "}`}
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                <NavigateBeforeIcon />
              </button>

              <button
                className={`flex items-center justify-center p-1 rounded border transition-colors ${currentPage >= totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600 "}`}
                onClick={nextPage}
                disabled={currentPage >= totalPages}
              >
                <NavigateNextIcon />
              </button>
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
};

// Bungkus dengan memo untuk optimasi extra di level parent
export default memo(DataTable);
