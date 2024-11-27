const axios = require("axios");

const apiUrl = "https://buena-leida-back-kamk.onrender.com";

const users = [
  {
    id: 100,
    name: "Carlos Pérez",
    email: "carlos.perez@example.com",
    password: "Contraseña123!",
    username: "carlitospz",
    bio: "Apasionado de las aventuras literarias y siempre en busca de la próxima joya literaria. Si no me encuentras, estoy perdido en una novela de ciencia ficción.",
    favouritegenders: ["Ficción", "Ciencia Ficción", "Aventura"],
    profilePhoto: "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Fcarlitospz.jpg?alt=media&token=e676ed85-abca-4735-a157-fa915169730a",
  },
  {
    id: 101,
    name: "Lucía Gómez",
    email: "lucia.gomez@example.com",
    password: "Luci4segura!",
    username: "luci_g",
    bio: "Diseñadora gráfica y devoradora de romances de época. Aquí para compartir mis obsesiones literarias (spoiler: hay mucho Austen).",
    favouritegenders: ["Romance", "Clásicos", "Drama"],
    profilePhoto: "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Fluci_g.jpg?alt=media&token=50d85b17-f900-4fd5-831e-6b89ad991379",
  },
  {
    "id": 102,
    "name": "Fernando Ruiz",
    "email": "fernando.ruiz@example.com",
    "password": "Ferny2024$",
    "username": "fer_1987",
    "bio": "Lector insaciable de misterios y dramas históricos. Soy ese amigo que siempre te recomienda 'ese' libro que nadie conoce.",
    "favouritegenders": ["Suspenso", "Historia", "Misterio"],
    "profilePhoto": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Ffer_1987.jpeg?alt=media&token=b72fc7ca-f673-4330-993c-924ca769531e"
  },
  {
    "id": 103,
    "name": "Mariana López",
    "email": "mariana.lopez@example.com",
    "password": "MariL0p3z@",
    "username": "marilop",
    "bio": "Enfermera en formación y lectora nocturna de poesía y cuentos cortos. ¿Recomendaciones de historias de terror? ¡Aquí estoy!",
    "favouritegenders": ["Terror", "Poesía", "Cuento"],
    "profilePhoto": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Fmarilop.jpeg?alt=media&token=3eb46649-68c2-4173-aa98-587bd34734b1"
  },
  {
    "id": 104,
    "name": "Alejandro Torres",
    "email": "alejandro.torres@example.com",
    "password": "Torres_123*",
    "username": "aletorres",
    "bio": "Chef de día, explorador de mundos ficticios de noche. Busco las mejores recetas literarias para devorar.",
    "favouritegenders": ["Fantasía", "Aventura", "Gastronomía"],
    "profilePhoto": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Faletorres.jpeg?alt=media&token=2fb5c78a-885b-4c04-b99a-8409421b4b78"
  },
  {
    "id": 105,
    "name": "Sofía Castillo",
    "email": "sofia.castillo@example.com",
    "password": "Sofi#2023",
    "username": "sofiacast",
    "bio": "Bailarina y amante de los clásicos. Me encanta leer en cafés y compartir citas memorables (¡sí, soy esa amiga!).",
    "favouritegenders": ["Clásicos", "Novela Gráfica", "Drama"],
    "profilePhoto": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Fsofiacast.jpeg?alt=media&token=b31379b5-ad79-4205-8ab8-f1bf00c141a6"
  },
  {
    "id": 106,
    "name": "Rodrigo Salinas",
    "email": "rodrigo.salinas@example.com",
    "password": "Rodri_Pass2023",
    "username": "rodrisal",
    "bio": "Desarrollador de día, lector de ciencia ficción por las noches. Aquí para intercambiar teorías locas sobre futuros distópicos.",
    "favouritegenders": ["Ciencia Ficción", "Distopía", "Tecnología"],
    "profilePhoto": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Frodrisal.jpeg?alt=media&token=b5084375-e20f-4da8-95bb-ed6905816c1b"
  },
  {
    "id": 107,
    "name": "Valentina Herrera",
    "email": "valentina.herrera@example.com",
    "password": "Vale_789!",
    "username": "valeherr",
    "bio": "Nutricionista de día, poeta de madrugada. Mis favoritos incluyen historias de viajes y culturas exóticas.",
    "favouritegenders": ["Viajes", "Cuento", "Poesía"],
    "profilePhoto": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Fvaleherr.jpeg?alt=media&token=4988f69b-d048-451b-a2ac-302b1c2f739c"
  },
  {
    "id": 108,
    "name": "Javier Martínez",
    "email": "javier.martinez@example.com",
    "password": "JaviMartinez#",
    "username": "jmartinez",
    "bio": "Ingeniero de lunes a viernes, lector de novelas gráficas y ciencia de viernes a domingo. Compartiré los mejores cómics por aquí.",
    "favouritegenders": ["Novela Gráfica", "Ciencia", "Policíaco"],
    "profilePhoto": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Fjmartinez.jpg?alt=media&token=49d7d5a5-62aa-42c1-8124-6bed868dc30c"
  },
  {
    "id": 109,
    "name": "Camila Ríos",
    "email": "camila.rios@example.com",
    "password": "CamiRios2023*",
    "username": "camilarios",
    "bio": "Psicóloga y amante de la literatura infantil. Busco recomendaciones para lecturas profundas que me dejen pensando.",
    "favouritegenders": ["Literatura Infantil", "Drama", "Realismo Mágico"],
    "profilePhoto": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/profiles%2Fprofiles_json%2Fcamilarios.jpeg?alt=media&token=d2f3cebf-a8b4-4983-b010-8830eb917709"
  }
];

const createUser = async (user) => {
    try {
      const response = await axios.post("http://localhost:3000/users", {
        name: user.name,
        email: user.email,
        password: user.password,
        username: user.username,
        favouritegenders: user.favouritegenders,
        bio: user.bio,
        profilePhoto: user.profilePhoto,
      });
      console.log(`Usuario ${user.username} creado:`, response.data);
    } catch (error) {
      console.error(`Error creando el usuario ${user.username}:`, error.response?.data || error.message);
    }
};


async function agregarVariosUsuarios() {
    for (const user of users) {
        await createUser(user);
    }
}

agregarVariosUsuarios();

module.exports = agregarVariosUsuarios;