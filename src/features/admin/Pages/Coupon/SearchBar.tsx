import React, { FC } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Button,
  Box
} from '@mui/material';
import { Search, Tune } from '@mui/icons-material';

interface ISearch {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const SearchBar: FC<ISearch> = ({ searchTerm, setSearchTerm }) => {
  return (
    <Box component="section"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}>
      <Paper
        component="form"
        sx={{
          margin: "20px 4px",
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}
      >
        <IconButton sx={{ p: '10px' }} aria-label="search">
          <Search sx={{ color: 'action.active' }} />
        </IconButton>

        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search for coupon....."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          inputProps={{ 'aria-label': 'search cupon code' }}
        />

        {/* <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /> */}


      </Paper>
      <Button
        startIcon={<Search />}
        sx={{
          mx: 1,
          textTransform: 'none',
        }}
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;