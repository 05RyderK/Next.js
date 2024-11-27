'use client';
import React, { useState, useEffect } from "react";
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
} from "@mui/material";
import { styled } from "@mui/system";

// Estilo para las tarjetas dinámicas
const StyledCard = styled(Card)(({ theme }) => ({
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
        transform: "translateY(-8px)", // Movimiento suave al hover
    },
    width: "100%", // Ancho completo en pantallas pequeñas
    marginBottom: theme.spacing(3),
    borderRadius: "28px", // Bordes más redondeados
    backgroundColor: "#f9f9f9", // Fondo suave para las tarjetas
    padding: theme.spacing(3), // Espaciado interno
    [theme.breakpoints.up("md")]: {
        width: "75%", // Ancho más grande en pantallas medianas y grandes
        margin: "auto", // Centrado horizontal en pantallas más grandes
    },
}));

// Estilo para los botones de acción personalizados
const ActionButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1.5),
    padding: theme.spacing(1),
    fontSize: "0.875rem",
    fontWeight: "bold",
    textTransform: "none",
    borderRadius: "18px",
    transition: "background-color 0.3s ease",
}));

const UpdateButton = styled(ActionButton)({
    backgroundColor: "#2196f3",
    color: "#fff",
    "&:hover": {
        backgroundColor: "#1976d2",
    },
});

const DeleteButton = styled(ActionButton)({
    backgroundColor: "#f44336",
    color: "#fff",
    "&:hover": {
        backgroundColor: "#d32f2f",
    },
});

const ClienteLista = () => {
    const [clientes, setClientes] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [formValues, setFormValues] = useState({
        nombre_cliente: "",
        email_cliente: "",
        celular_cliente: "",
    });

    const [selectedCliente, setSelectedCliente] = useState<any>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [actionType, setActionType] = useState<'create' | 'update'>('create');

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const respuesta = await fetch('http://localhost:2000/api/clientes');
            if (!respuesta.ok) throw new Error('Error al obtener todos los clientes');
            const data = await respuesta.json();
            setClientes(data);
        } catch (error) {
            console.error('Error al obtener los clientes: ', error);
            setErrorMessage('Error al obtener los clientes');
            setOpenSnackbar(true);
        }
    };

    const handleOpenModal = (cliente: any = null) => {
        setSelectedCliente(cliente);
        if (cliente) {
            setFormValues({
                nombre_cliente: cliente.nombre_cliente,
                email_cliente: cliente.email_cliente,
                celular_cliente: cliente.celular_cliente,
            });
            setActionType('update');
        } else {
            setFormValues({
                nombre_cliente: "",
                email_cliente: "",
                celular_cliente: "",
            });
            setActionType('create');
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedCliente(null);
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSaveCliente = async () => {
        try {
            let url;
            let method;
            if (actionType === 'create') {
                url = 'http://localhost:2000/api/clientes';
                method = 'POST';
            } else if (actionType === 'update') {
                url = `http://localhost:2000/api/clientes/update/${selectedCliente?._id}`;
                method = 'PUT';
            }

            const response = await fetch(`${url}`, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formValues),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al guardar el cliente');
            }

            fetchClientes();
            handleCloseModal();
        } catch (error) {
            console.error('Error al guardar el cliente: ', error);
            setErrorMessage("Error al guardar el cliente");
            setOpenSnackbar(true);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`http://localhost:2000/api/clientes/delete/${id}`, { method: 'DELETE' });
            fetchClientes();
        } catch (error) {
            console.error("Error al eliminar el cliente:", error);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setErrorMessage("");
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: "100px" }}>
            <section style={{
                background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                padding: "20px",
                borderRadius: "10px",
                color: "#fff"
            }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal()}
                    style={{ marginBottom: "30px" }} // Espaciado adicional
                >
                    Crear Cliente
                </Button>
                <Grid container spacing={1}>
                    {clientes.map((cliente: any) => (
                        <Grid item xs={12} md={6} key={cliente._id}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h6" component="div" gutterBottom>
                                        {cliente.nombre_cliente}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {cliente.email_cliente}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {cliente.celular_cliente}
                                    </Typography>
                                    <UpdateButton onClick={() => handleOpenModal(cliente)}>
                                        Actualizar
                                    </UpdateButton>
                                    <DeleteButton onClick={() => handleDelete(cliente._id)}>
                                        Eliminar
                                    </DeleteButton>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
            </section>

            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>
                    {actionType === 'create' ? 'Crear Cliente' : 'Actualizar Cliente'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Nombre"
                        name="nombre_cliente"
                        value={formValues.nombre_cliente}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="email_cliente"
                        value={formValues.email_cliente}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Celular"
                        name="celular_cliente"
                        value={formValues.celular_cliente}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">Cancelar</Button>
                    <Button onClick={handleSaveCliente} color="primary">
                        {actionType === 'create' ? 'Crear' : 'Actualizar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar para mensajes */}
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert severity={errorMessage ? 'error' : 'success'} onClose={handleCloseSnackbar}>
                    {errorMessage || "Operación exitosa"}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ClienteLista;