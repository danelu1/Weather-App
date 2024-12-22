import { useNavigate } from 'react-router-dom';
import '../App.css'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { Box, Drawer, ListItemIcon, TextField, IconButton, ListItemText, ListItemButton, Button, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const StartPage = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [countryOpen, setCountryOpen] = useState(false);
    const [cityOpen, setCityOpen] = useState(false);
    const [temepratureOpen, setTemperatureOpen] = useState(false);

    const [countryName, setCountryName] = useState('');
    const [countryLatitude, setCountryLatitude] = useState('');
    const [countryLongitude, setCountryLongitude] = useState('');

    const [cityCountryID, setCityCountryID] = useState('');
    const [cityName, setCityName] = useState('');
    const [cityLatitude, setCityLatitude] = useState('');
    const [cityLongitude, setCityLongitude] = useState('');

    const [temperatureValue, setTemperatureValue] = useState('');
    const [temperatureCityID, setTemperatureCityID] = useState('');

    const [alert, setAlert] = useState({ open: false, severity: '', message: '' });

    const handleMenuClick = () => {
        setMenuOpen(true);
    };

    const handleMenuClose = () => {
        setMenuOpen(false);
    };

    const handleCountryOpen = () => {
        setCountryOpen(true);
    };

    const handleCountryClose = () => {
        setCountryOpen(false);
    };

    const handleCityOpen = () => {
        setCityOpen(true);
    };

    const handleCityClose = () => {
        setCityOpen(false);
    };

    const handleTemperatureOpen = () => {
        setTemperatureOpen(true);
    };

    const handleTemperatureClose = () => {
        setTemperatureOpen(false);
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert({ ...alert, open: false });
    };

    const handleAddCountry = async () => {
        const data = {
            'nume': countryName,
            'lat': /^-?\d+(\.\d+)?$/.test(countryLatitude) ? parseFloat(countryLatitude) : "NaN",
            'lon': /^-?\d+(\.\d+)?$/.test(countryLongitude) ? parseFloat(countryLongitude) : "NaN"
        };

        try {
            const response = await fetch('http://localhost:5000/api/countries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })

            const result = await response.json();

            if (response.ok) {
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Country added successfully'
                });
                setCountryName('');
                setCountryLatitude('');
                setCountryLongitude('');
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: `Error: ${result.message}`
                });
                if (response.status === 409) {
                    setCountryName('');
                } else if (response.status === 400) {
                    setCountryLatitude('');
                    setCountryLongitude('');
                }
            }
        } catch (error) {
            setAlert({
                open: true,
                severity: 'error',
                message: `Error: ${error}`
            });
        }
    };

    const handleAddCity = async () => {
        const data = {
            'idTara':  /[0-9]+/.test(cityCountryID) ? parseInt(cityCountryID) : "NaN",
            'nume': cityName,
            'lat': /^-?\d+(\.\d+)?$/.test(cityLatitude) ? parseFloat(cityLatitude) : "NaN",
            'lon': /^-?\d+(\.\d+)?$/.test(cityLongitude) ? parseFloat(cityLongitude) : "NaN"
        };

        try {
            const response = await fetch('http://localhost:5000/api/cities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })

            const result = await response.json();

            if (response.ok) {
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'City added successfully'
                });
                setCityCountryID('');
                setCityName('');
                setCityLatitude('');
                setCityLongitude('');
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: `Error: ${result.message}`
                });
                if (response.status === 409) {
                    setCityName('');
                    setCityCountryID('');
                } else if (response.status === 400) {
                    setCityLatitude('');
                    setCityLongitude('');
                }
            }
        } catch (error) {
            console.log('Error ', error);
        }
    };

    const handleAddTemperature = async () => {
        const data = {
            'idOras': /[0-9]+/.test(temperatureCityID) ? parseInt(temperatureCityID) : "NaN",
            'valoare': /^-?\d+(\.\d+)?$/.test(temperatureValue) ? parseFloat(temperatureValue) : "NaN"
        };

        try {
            const response = await fetch('http://localhost:5000/api/temperatures', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })

            const result = await response.json();

            if (response.ok) {
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Temperature added successfully'
                });
                setTemperatureCityID('');
                setTemperatureValue('');
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: `Error: ${result.message}`
                });
            }
        } catch (error) {
            console.log('Error ', error);
        }
    };

    return (
        <div>
            <ListItemIcon className='options-icon' onClick={handleMenuClick}>
                <MenuIcon />
            </ListItemIcon>

            <Drawer
                anchor="left"
                open={menuOpen}
                onClose={handleMenuClose}
                sx={{ width: 500}}
            >
                <Box
                    sx={{
                            width: 500,
                            padding: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}
                >
                    <IconButton 
                    sx={{ alignSelf: 'flex-end' }} 
                    onClick={handleMenuClose}
                    >
                        <CloseIcon />
                    </IconButton>

                    <ListItemButton onClick={handleCountryOpen}>
                        <ListItemIcon>
                            <AddIcon />
                        </ListItemIcon>
                        <ListItemText primary='New Country'/>
                    </ListItemButton>

                    <ListItemButton onClick={handleCityOpen}>
                        <ListItemIcon>
                            <AddIcon />
                        </ListItemIcon>
                        <ListItemText primary='New City'/>
                    </ListItemButton>

                    <ListItemButton onClick={handleTemperatureOpen}>
                        <ListItemIcon>
                            <AddIcon />
                        </ListItemIcon>
                        <ListItemText primary='New Temperature'/>
                    </ListItemButton>

                    <Drawer
                        anchor="top"
                        open={countryOpen}
                        onClose={handleCountryClose}
                        sx={{ width: 500 }}
                        PaperProps={{
                            sx: {
                                height: 400,
                                width: 300,
                                position: 'fixed',
                                top: '30%',
                                left: '40%',
                                transform: 'translate(-50%, -50%)',
                                borderRadius: 2,
                                boxShadow: 3
                            },
                        }}
                    >
                        <Box
                            sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                        }}
                        >
                            <TextField
                                sx={{
                                    marginTop: '20px',
                                    width: '250px'
                                }}
                                onChange={(e) => setCountryName(e.target.value)}
                                value={countryName}
                                variant='outlined'
                                label='Name'
                                required
                            />

                            <TextField
                                sx={{
                                    marginTop: '10px',
                                    width: '250px'
                                }}
                                onChange={(e) => setCountryLatitude(e.target.value)}
                                value={countryLatitude}
                                variant='outlined'
                                label='Latitude'
                                required
                            />

                            <TextField
                                sx={{
                                    marginTop: '10px',
                                    width: '250px'
                                }}
                                onChange={(e) => setCountryLongitude(e.target.value)}
                                value={countryLongitude}
                                variant='outlined'
                                label='Longitude'
                                required
                            />

                            <Button
                                variant='contained'
                                sx={{
                                    width: '100px'
                                }}
                                onClick={handleAddCountry}
                            >
                                Add
                            </Button>
                        </Box>
                    </Drawer>

                    <Drawer
                        anchor="top"
                        open={cityOpen}
                        onClose={handleCityClose}
                        sx={{ width: 500 }}
                        PaperProps={{
                            sx: {
                                height: 400,
                                width: 300,
                                position: 'fixed',
                                top: '30%',
                                left: '40%',
                                transform: 'translate(-50%, -50%)',
                                borderRadius: 2,
                                boxShadow: 3
                            },
                        }}
                    >
                        <Box
                            sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                        }}
                        >
                            <TextField
                                sx={{
                                    marginTop: '20px',
                                    width: '250px'
                                }}
                                onChange={(e) => setCityCountryID(e.target.value)}
                                value={cityCountryID}
                                variant='outlined'
                                label='Country ID'
                                required
                            />

                            <TextField
                                sx={{
                                    marginTop: '20px',
                                    width: '250px'
                                }}
                                onChange={(e) => setCityName(e.target.value)}
                                value={cityName}
                                variant='outlined'
                                label='Name'
                                required
                            />

                            <TextField
                                sx={{
                                    marginTop: '10px',
                                    width: '250px'
                                }}
                                onChange={(e) => setCityLatitude(e.target.value)}
                                value={cityLatitude}
                                variant='outlined'
                                label='Latitude'
                                required
                            />

                            <TextField
                                sx={{
                                    marginTop: '10px',
                                    width: '250px'
                                }}
                                onChange={(e) => setCityLongitude(e.target.value)}
                                value={cityLongitude}
                                variant='outlined'
                                label='Longitude'
                                required
                            />

                            <Button
                                variant='contained'
                                sx={{
                                    width: '100px'
                                }}
                                onClick={handleAddCity}
                            >
                                Add
                            </Button>
                        </Box>
                    </Drawer>

                    <Drawer
                        anchor="top"
                        open={temepratureOpen}
                        onClose={handleTemperatureClose}
                        sx={{ width: 500 }}
                        PaperProps={{
                            sx: {
                                height: 400,
                                width: 300,
                                position: 'fixed',
                                top: '30%',
                                left: '40%',
                                transform: 'translate(-50%, -50%)',
                                borderRadius: 2,
                                boxShadow: 3
                            },
                        }}
                    >
                        <Box
                            sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                        }}
                        >
                            <TextField
                                sx={{
                                    marginTop: '20px',
                                    width: '250px'
                                }}
                                onChange={(e) => setTemperatureValue(e.target.value)}
                                value={temperatureValue}
                                variant='outlined'
                                label='Value'
                                required
                            />

                            <TextField
                                sx={{
                                    marginTop: '10px',
                                    width: '250px'
                                }}
                                onChange={(e) => setTemperatureCityID(e.target.value)}
                                value={temperatureCityID}
                                variant='outlined'
                                label='City ID'
                                required
                            />

                            <Button
                                variant='contained'
                                sx={{
                                    width: '100px'
                                }}
                                onClick={handleAddTemperature}
                            >
                                Add
                            </Button>
                        </Box>
                    </Drawer>

                    <DropdownButton
                        id='advanced-dropdown'
                        title='Search'
                        variant='primary'
                        onSelect={(eventKey) => navigate(`/search-${eventKey}`)}
                        style={{
                            marginTop: '100px',
                            marginLeft: '175px',
                            width: '200px !important'
                        }}
                    >
                        <Dropdown.Item eventKey='countries'>Countries</Dropdown.Item>
                        <Dropdown.Item eventKey='cities'>Cities</Dropdown.Item>
                        <Dropdown.Item eventKey='temperatures'>Temperatures</Dropdown.Item>
                    </DropdownButton>
                </Box>
            </Drawer>

            <Snackbar
                open={alert.open}
                autoHideDuration={10000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                onClose={handleCloseAlert}
                severity={alert.severity}
                sx={{ width: '100%' }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default StartPage;
