import { Box, IconButton, TextField } from '@mui/material';
import '../styles/SearchPage.css'
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from 'react';
import EntityChart from './EntityChart';

const SearchPage = ({ type, updateFields }) => {
    const [entities, setEntities] = useState([]);
    const [filteredEntities, setFilteredEntities] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchCountryId, setSearchCountryId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [debouncedSearchName, setDebouncedSearchName] = useState('');
    const [debouncedSearchCountryId, setDebouncedSearchCountryId] = useState('');
    const [debouncedStartDate, setDebouncedStartDate] = useState('');
    const [debouncedEndDate, setDebouncedEndDate] = useState('');
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');
    const [debouncedLat, setDebouncedLat] = useState('');
    const [debouncedLon, setDebouncedLon] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchName(searchName);
        }, 10);

        return () => clearTimeout(timer);
    }, [searchName]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchCountryId(searchCountryId);
        }, 10);

        return () => clearTimeout(timer);
    }, [searchCountryId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedStartDate(startDate);
        }, 10);
        return () => clearTimeout(timer);
    }, [startDate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedEndDate(endDate);
        }, 10);
        return () => clearTimeout(timer);
    }, [endDate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedLat(lat);
        }, 10);
        return () => clearTimeout(timer);
    }, [lat]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedLon(lon);
        }, 10);
        return () => clearTimeout(timer);
    }, [lon]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/${type}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const result = await response.json();

                if (response.ok) {
                    setEntities(result);
                    setFilteredEntities(result);
                } else {
                    alert('Error fetching data');
                }
            } catch (error) {
                console.log('Error', error);
            }
        };

        fetchCountries();
    }, [type]);

    useEffect(() => {
        if (debouncedSearchCountryId) {
            const fetchCities = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/cities/country/${parseInt(debouncedSearchCountryId)}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    const result = await response.json();

                    if (response.ok) {
                        console.log('Fetched cities for country:', debouncedSearchCountryId, result);
                        setFilteredEntities(result);
                    } else {
                        alert('Error fetching cities for country ID');
                    }
                } catch (error) {
                    console.log('Error fetching cities by country ID', error);
                }
            }

            fetchCities();
        } else {
            setFilteredEntities(entities);
        }
    }, [debouncedSearchCountryId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = `http://localhost:5000/api/temperatures?`;

                if (debouncedSearchCountryId) {
                    url += `countryId=${debouncedSearchCountryId}&`;
                }

                if (debouncedLat) {
                    url += `lat=${debouncedLat}&`
                }

                if (debouncedLon) {
                    url += `lon=${debouncedLon}&`
                }

                if (debouncedStartDate) {
                    url += `from=${debouncedStartDate}&`;
                }

                if (debouncedEndDate) {
                    url += `until=${debouncedEndDate}&`;
                }

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const result = await response.json();

                if (response.ok) {
                    setEntities(result);
                    setFilteredEntities(result);
                } else {
                    alert('Error fetching data');
                }
            } catch (error) {
                console.log('Error', error);
            }
        };

        if (type === 'temperatures') {
            fetchData();
        }
    }, [debouncedStartDate, debouncedEndDate, debouncedSearchCountryId, debouncedLat, debouncedLon]);

    useEffect(() => {
        let filtered = entities;

        if (debouncedSearchName) {
            filtered = filtered.filter(entity =>
                (entity.nume || "").toLowerCase().startsWith(debouncedSearchName.toLowerCase())
            );
        }

        setFilteredEntities(filtered);
    }, [debouncedSearchName, entities]);

    return (
        <div className='search-page'>
            {type !== 'temperatures' && (
                <Box
                    sx={{
                        height: '100px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <TextField
                        id='search-name'
                        variant='outlined'
                        onChange={(e) => setSearchName(e.target.value)}
                        label={`Search ${type.charAt(0).toUpperCase() + type.slice(1)} by Name...`}
                    />

                    <IconButton type="submit" aria-label="search">
                        <SearchIcon style={{ fill: "blue" }} />
                    </IconButton>
                </Box>
            )}

            {type === 'cities' && (
                <Box
                    sx={{
                        height: '100px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <TextField
                        id='search-country-id'
                        variant='outlined'
                        onChange={(e) => setSearchCountryId(e.target.value)}
                        label={`Search ${type.charAt(0).toUpperCase() + type.slice(1)} by Country ID...`}
                    />

                    <IconButton type="submit" aria-label="search">
                        <SearchIcon style={{ fill: "blue" }} />
                    </IconButton>
                </Box>
            )}

            {type === 'temperatures' && (
                <Box>
                    <Box
                        sx={{
                            height: '100px',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <TextField
                            variant='outlined'
                            onChange={(e) => setLat(e.target.value)}
                            label={`Search by Latitude...`}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />

                        <TextField
                            variant='outlined'
                            onChange={(e) => setLon(e.target.value)}
                            label={`Search by Longitude...`}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />

                        <IconButton type="submit" aria-label="search">
                            <SearchIcon style={{ fill: "blue" }} />
                        </IconButton>
                    </Box>

                    <Box
                        sx={{
                            height: '100px',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <TextField
                            type="date"
                            variant='outlined'
                            onChange={(e) => setStartDate(e.target.value)}
                            label={`Search by Start Date...`}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />

                        <TextField
                            type="date"
                            variant='outlined'
                            onChange={(e) => setEndDate(e.target.value)}
                            label={`Search by End Date...`}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />

                        <IconButton type="submit" aria-label="search">
                            <SearchIcon style={{ fill: "blue" }} />
                        </IconButton>
                    </Box>
                </Box>
            )}

            {filteredEntities.length === 0 ? (
                <p>No results found.</p>
            ) : (
                filteredEntities.map(entity => (
                    <EntityChart
                        type={type}
                        entity={entity}
                        entities={entities}
                        setEntities={setEntities}
                        updateFields={updateFields}
                    />
                ))
            )}
        </div>
    );
};

export default SearchPage;
