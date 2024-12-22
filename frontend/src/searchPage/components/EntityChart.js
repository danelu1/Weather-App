import { Alert, Box, Button, Card, CardContent, Drawer, ListItemIcon, Snackbar, TextField, Typography } from "@mui/material";
import { useState } from "react";
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';

const EntityChart = ({type, entity, entities, setEntities, updateFields }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [alert, setAlert] = useState({ open: false, severity: '', message: '' });
    const [update, setUpdate] = useState(false);

    const [fieldValues, setFieldValues] = useState(
        updateFields.reduce((acc, field) => {
            acc[field] = entity[field];
            return acc;
        }, {})
    );

    const handleFieldChange = (field, value) => {
        setFieldValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCloseAlert = (_, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert({ ...alert, open: false });
    };

    const validateFieldValues = (entity) => {
        for (const [field, value] of Object.entries(fieldValues)) {
            fieldValues[field] =
            typeof entity[field] === 'number' ? (
                /^-?\d+(\.\d+)?$/.test(value) ? parseFloat(value) : parseInt(value)
            ) : value;
        }
    };

    const handleDeleteEntity = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/${type}/${entity.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();

            if (response.ok) {
                setEntities(entities.filter((e) => e.id !== entity.id));
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Deleted successfully'
                });
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: `Error: ${result.message}`
                });
            }
        } catch (error) {
            console.log('Error', error);
        }
    };

    const handleUpdateEntity = async () => {
        validateFieldValues(entity);

        try {
            const response = await fetch(`http://localhost:5000/api/${type}/${entity.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(fieldValues)
            })

            const result = await response.json();

            if (response.ok) {
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Updated successfully'
                });
                setEntities(entities.map(e => (e.id === entity.id ? { ...e, ...fieldValues } : e)));
                setUpdate(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: `Updated failed: ${result.message}`
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Box
            sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Card
                    sx={{ 
                        margin: 2,
                        width: 250, 
                        backgroundColor: "#f0f0f0",
                    }}
                >
                    <CardContent>
                        <Typography variant='h5'>
                            {
                                "nume" in entity ? entity.nume : entity.timestamp
                            }
                        </Typography>
                    </CardContent>
                </Card>

                <ListItemIcon
                    onClick={() => setShowDetails(!showDetails)}
                    className="info-icon"
                >
                    <InfoIcon />
                </ListItemIcon>

                <ListItemIcon
                    className="info-icon"
                    onClick={() => setUpdate(true)}
                >
                    <UpdateIcon />
                </ListItemIcon>

                <ListItemIcon
                    onClick={handleDeleteEntity}
                    className="info-icon">
                    <DeleteIcon />
                </ListItemIcon>
            </Box>

            {showDetails && (
                <Box sx={{ marginRight: 20, backgroundColor: "#f9f9f9", padding: 2, borderRadius: "10px" }}>
                    <Typography variant="body1">
                        <strong>Details:</strong>
                    </Typography>
                    {Object.entries(entity).map(([field, value]) => (
                        <Typography key={field} variant="body1">
                            {`${field.charAt(0).toUpperCase() + field.slice(1)}: ${value}`}
                        </Typography>
                    ))}
                </Box>
            )}

            <Drawer
                anchor="top"
                open={update}
                onClose={() => setUpdate(false)}
                sx={{
                    width: 500
                }}
                PaperProps={{
                    sx: {
                        height: 500,
                        width: 300,
                        position: 'fixed',
                        top: '20%',
                        left: '40%',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: 2,
                        boxShadow: 3
                    },
                }}
            >
                <Box
                    sx={{
                        width: 300,
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    {updateFields.map(
                        field => (
                            <TextField
                                variant="outlined"
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                onChange={(e) => handleFieldChange(field, e.target.value)}
                                required
                                value={fieldValues[field]}
                                contentEditable
                            />
                    ))}

                    <Button
                        onClick={handleUpdateEntity}
                        variant="contained"
                        sx={{
                            width: 100,
                        }}
                    >
                        Update
                    </Button>
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
        </Box>
    );
};

export default EntityChart;
