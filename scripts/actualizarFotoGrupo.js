const axios = require('axios');

const apiUrl = 'http://localhost:3000';

const fotosGrupo = [
    { groupId: 1, groupPhoto: 'https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/groups%2Fgcienciaficsion.jpeg?alt=media&token=0399ad7f-0361-4371-b873-cc9522cc5fcf', creatorId: 1 },
    { groupId: 2, groupPhoto: 'https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/groups%2Fgfantasia.jpeg?alt=media&token=d7872762-f686-4cec-8994-a3753a1dee9d', creatorId: 1 },
    { groupId: 3, groupPhoto: 'https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/groups%2Fgmisterio.jpeg?alt=media&token=2f21f22e-5cde-412a-8d2b-226305b66ea0', creatorId: 1 },
    { groupId: 4, groupPhoto: 'https://https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/groups%2Fgficcionhistorica.jpeg?alt=media&token=5818fbc1-a7a3-49bf-a37d-b88690f1522b.com/photo4.jpg', creatorId: 1 },
    { groupId: 5, groupPhoto: 'https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/groups%2Fromantica.jpg?alt=media&token=da227541-f658-4ffc-9b21-171e796f35c4://example.com/photo5.jpg', creatorId: 1 },
    { groupId: 6, groupPhoto: 'https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/groups%2Fromantica.jpg?alt=media&token=da227541-f658-4ffc-9b21-171e796f35c4', creatorId: 1 },
    { groupId: 7, groupPhoto: 'https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/groups%2Fnoficcion.jpeg?alt=media&token=c8b89818-0a99-44f1-94dc-7074a69e66b5', creatorId: 1 },
    { groupId: 8, groupPhoto: 'https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/groups%2Fgsuspenso.jpg?alt=media&token=8eb195e7-ab11-4b06-bfd1-36cab2156b24', creatorId: 1 },
    { groupId: 9, groupPhoto: 'https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/groups%2Fgbiografia.png?alt=media&token=1c9f0c5e-5317-4a9b-a169-b4c84db0843b', creatorId: 1 },
    { groupId: 10, groupPhoto: 'https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/groups%2Fgjuvenil.jpeg?alt=media&token=07f3bcef-0355-4df2-b4d0-9783008b7313', creatorId: 1 },
];

async function actualizarFotoGrupo(datosFoto) {
    try {
        const url = `${apiUrl}/groups/${datosFoto.groupId}/update-photo`;
    
        console.log('Enviando actualización para el grupo:', datosFoto);

        console.log('Enviando actualización para el grupo:', datosFoto);

        const response = await axios.patch(`${apiUrl}/groups/${datosFoto.groupId}/update-photo`, {
            groupPhoto: datosFoto.groupPhoto,
            creatorId: datosFoto.creatorId,
        });

        console.log(`Foto del grupo ${datosFoto.groupId} actualizada con éxito.`);
    } catch (error) {
        console.error(`Error al actualizar la foto del grupo ${datosFoto.groupId}:`);
        console.error('Mensaje de error:', error.message);

        if (error.response) {
            console.error('Detalles de la respuesta del servidor:');
            console.error('Código de estado:', error.response.status);
            console.error('Datos de respuesta:', error.response.data);
        } else {
            console.error('Error sin respuesta:', error);
        }
    }
}

async function actualizarMultiplesFotos() {
    for (const datosFoto of fotosGrupo) {
        await actualizarFotoGrupo(datosFoto);
    }
}

actualizarMultiplesFotos();

module.exports = actualizarMultiplesFotos;
