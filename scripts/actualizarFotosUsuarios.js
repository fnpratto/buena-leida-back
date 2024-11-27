const axios = require("axios");

const apiUrl = "https://buena-leida-back-kamk.onrender.com";

const fotosUsuarios = [ 
    { userId: 1, profilePhoto: "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Fcamilarios.jpeg?alt=media&token=d2f3cebf-a8b4-4983-b010-8830eb917709" },
    { userId: 2, profilePhoto: "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Faletorres.jpeg?alt=media&token=2fb5c78a-885b-4c04-b99a-8409421b4b78" },
    { userId: 3, profilePhoto: "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Fcarlitospz.jpg?alt=media&token=e676ed85-abca-4735-a157-fa915169730a" },
    { userId: 4, profilePhoto: "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Ffer_1987.jpeg?alt=media&token=b72fc7ca-f673-4330-993c-924ca769531e" },
    { userId: 5, profilePhoto: "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Fjmartinez.jpg?alt=media&token=49d7d5a5-62aa-42c1-8124-6bed868dc30c" },
    { userId: 6, profilePhoto: "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Fluci_g.jpg?alt=media&token=50d85b17-f900-4fd5-831e-6b89ad991379" },
    { userId: 7, profilePhoto: "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Fmarilop.avif?alt=media&token=8d895e65-74b3-41d1-9fbe-1568ccf22375" },
    { userId: 8, profilePhoto: "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Fmarilop.jpeg?alt=media&token=3eb46649-68c2-4173-aa98-587bd34734b1" },
    { userId: 9, profilePhoto: "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Frodrisal.jpeg?alt=media&token=b5084375-e20f-4da8-95bb-ed6905816c1b" },
    { userId: 10, profilePhoto: "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Fvaleherr.jpeg?alt=media&token=4988f69b-d048-451b-a2ac-302b1c2f739c" },
    // { userId: 11, profilePhoto: "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Fsofiacast.jpeg?alt=media&token=b31379b5-ad79-4205-8ab8-f1bf00c141a6" },
];


async function actualizarFotoUsuario(datosFoto) {
    try {
        const url = `${apiUrl}/users/${datosFoto.userId}/profile-photo`;

        console.log(`Enviando actualización para el usuario: ${datosFoto.userId}`);

        const response = await axios.patch(url, {
            profilePhoto: datosFoto.profilePhoto,
        });

        console.log(`Foto del usuario ${datosFoto.userId} actualizada con éxito.`);
    } catch (error) {
        console.error(`Error al actualizar la foto del usuario ${datosFoto.userId}:`);
        console.error("Mensaje de error:", error.message);

        if (error.response) {
            console.error("Detalles de la respuesta del servidor:");
            console.error("Código de estado:", error.response.status);
            console.error("Datos de respuesta:", error.response.data);
        } else {
            console.error("Error sin respuesta:", error);
        }
    }
}

async function actualizarMultiplesFotosUsuarios() {
    for (const datosFoto of fotosUsuarios) {
        await actualizarFotoUsuario(datosFoto);
    }
}

actualizarMultiplesFotosUsuarios();

module.exports = actualizarMultiplesFotosUsuarios;
