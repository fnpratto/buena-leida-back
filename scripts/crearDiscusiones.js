//node crearDiscusiones.js

const axios = require('axios');

const apiUrl = 'https://buena-leida-back-kamk.onrender.com/discussions/{groupId}/create-discussion/';  

const discusiones = [
    { name: 'Ciencia Ficción - Debate sobre nuevos libros', creatorId: 1, groupId: 1 },
    { name: 'Fantasía - Nuevas publicaciones en el género', creatorId: 1, groupId: 2 },
    { name: 'Misterio - Análisis de novelas clásicas', creatorId: 1, groupId: 3 },
    { name: 'Ficción Histórica - Libros sobre la Segunda Guerra Mundial', creatorId: 1, groupId: 4 },
    { name: 'Terror - Las mejores novelas de horror de todos los tiempos', creatorId: 1, groupId: 5 },
    { name: 'Romántica - ¿Qué hace que una historia de amor funcione?', creatorId: 1, groupId: 6 },
    { name: 'No Ficción - Documentales recomendados', creatorId: 1, groupId: 7 },
    { name: 'Suspenso - Los thrillers más emocionantes', creatorId: 1, groupId: 8 },
    { name: 'Biografías - Vidas que marcaron la historia', creatorId: 1, groupId: 9 },
    { name: 'Juvenil - Libros imprescindibles para adolescentes', creatorId: 1, groupId: 10 }
];

async function crearDiscusion(discusion) {
    try {
        const url = apiUrl.replace('{groupId}', discusion.groupId);

        console.log('Enviando discusión:', discusion);

        const response = await axios.post(url, {
            name: discusion.name,
            creatorId: discusion.creatorId,
            groupId: discusion.groupId
        });

        console.log(`Discusión "${discusion.name}" creada con éxito.`);
    } catch (error) {
        console.error(`Error al crear la discusión ${discusion.name}:`);
        console.error('Mensaje de error:', error.message);

        if (error.response) {
            console.error('Detalles de la respuesta del servidor:');
            console.error('Código de estado:', error.response.status);
            console.error('Datos de respuesta:', error.response.data);
        }

        if (!error.response) {
            console.error('Error sin respuesta:', error);
        }
    }
}

async function crearMultiplesDiscusiones() {
    for (const datosDiscusion of discusiones) {
        await crearDiscusion(datosDiscusion);
    }
}

crearMultiplesDiscusiones();

module.exports = crearMultiplesDiscusiones;
