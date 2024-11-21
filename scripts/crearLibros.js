const axios = require("axios");

const apiUrl = "http://localhost:3000";

const books = [
    {
        "id": 100,
        "title": "Harry Potter y la piedra filosofal",
        "author": "J.K. Rowling",
        "publication_date": "1997-06-26",
        "genre": "Fantasía",
        "summary": "La historia de Harry Potter, un niño que descubre que es un mago y asiste a la escuela de magia Hogwarts, donde enfrenta al malvado Lord Voldemort.",
        "coverimage": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/books%2Fhp1.jpg?alt=media&token=91860d00-3763-401c-b1cb-0ef5af858a7a"
    },
    {
        "id": 101,
        "title": "Los juegos del hambre",
        "author": "Suzanne Collins",
        "publication_date": "2008-09-14",
        "genre": "Ciencia ficción distópica",
        "summary": "Katniss Everdeen vive en una sociedad distópica donde lucha por sobrevivir en una competencia mortal televisada conocida como 'Los Juegos del Hambre'.",
        "coverimage": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/books%2Fthg1.jpg?alt=media&token=395b3b5f-89b3-4ec8-852c-8d8132c03a6d"
    },
    {
        "id": 102,
        "title": "Crepúsculo",
        "author": "Stephenie Meyer",
        "publication_date": "2005-10-05",
        "genre": "Romance paranormal",
        "summary": "La historia de amor entre Bella Swan, una adolescente humana, y Edward Cullen, un vampiro, en una lucha entre el amor y el peligro.",
        "coverimage": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/books%2Fcrepusculo.jpg?alt=media&token=ffb2c3c6-bf25-491f-92c6-43eae2ba537b"
    },
    {
        "id": 103,
        "title": "El código Da Vinci",
        "author": "Dan Brown",
        "publication_date": "2003-03-18",
        "genre": "Thriller",
        "summary": "El simbologista Robert Langdon desentraña misterios ocultos en obras de arte y arquitectura en una carrera para descubrir un secreto milenario.",
        "coverimage": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/books%2Fcodigodavinci.jpeg?alt=media&token=beb82f0d-a9be-4245-b0fe-ea8cf5b23377"
    },
    {
        "id": 104,
        "title": "La chica del tren",
        "author": "Paula Hawkins",
        "publication_date": "2015-01-13",
        "genre": "Suspenso",
        "summary": "Rachel, una mujer que viaja en tren todos los días, se ve involucrada en la desaparición de una persona tras observar algo inquietante desde la ventana.",
        "coverimage": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/books%2Fportada_la-chica-del-tren_paula-hawkins_201611281622.jpg?alt=media&token=abec5aa0-3ce5-4cde-9ead-2d91842dc4a6"
    },
    {
        "id": 105,
        "title": "El niño con el pijama de rayas",
        "author": "John Boyne",
        "publication_date": "2006-01-05",
        "genre": "Ficción histórica",
        "summary": "La historia de Bruno, un niño alemán que se hace amigo de Shmuel, un niño judío prisionero, a través de la valla de un campo de concentración.",
        "coverimage": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/books%2Fpijama.jpeg?alt=media&token=ec7bf4a0-cf61-4801-af13-65068e8edacc"
    },
    {
        "id": 106,
        "title": "La luz que no puedes ver",
        "author": "Anthony Doerr",
        "publication_date": "2014-05-06",
        "genre": "Ficción histórica",
        "summary": "Durante la Segunda Guerra Mundial, la historia de una joven ciega en Francia y un soldado alemán cuyas vidas se cruzan en circunstancias dramáticas.",
        "coverimage": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/books%2FLa%20luz%20que%20no%20puedes%20ver.jpeg?alt=media&token=6644980c-5dec-4bca-9933-85c753a0e0d7"
    },
    {
        "id": 107,
        "title": "Bajo la misma estrella",
        "author": "John Green",
        "publication_date": "2012-01-10",
        "genre": "Ficción juvenil",
        "summary": "La historia de Hazel y Gus, dos adolescentes con cáncer que encuentran el amor y la amistad mientras enfrentan sus propias luchas personales.",
        "coverimage": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/books%2Fbajolamismaestrella.jpeg?alt=media&token=89b1d8a6-ea14-4a9b-950c-4caeea7e2f1b"
    },
    {
        "id": 108,
        "title": "El cuento de la criada",
        "author": "Margaret Atwood",
        "publication_date": "1985-08-01",
        "genre": "Ciencia ficción distópica",
        "summary": "En una sociedad teocrática y opresiva, Defred, una mujer obligada a ser madre sustituta, lucha por sobrevivir y encontrar esperanza.",
        "coverimage": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/books%2FEl%20cuento%20de%20la%20criada.jpeg?alt=media&token=74ec6a6d-2b11-457b-be75-1d6907328b45"
    },
    {
        "id": 109,
        "title": "El marciano",
        "author": "Andy Weir",
        "publication_date": "2011-02-11",
        "genre": "Ciencia ficción",
        "summary": "La historia de Mark Watney, un astronauta que queda atrapado en Marte y usa su ingenio y conocimientos científicos para sobrevivir en el planeta rojo.",
        "coverimage": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/books%2FEl%20marciano.jpg?alt=media&token=e5ac1054-f934-4d9b-83a6-0c616691e275"
    },
    {
        "id": 1011,
        "title": "Harry Potter y la cámara secreta",
        "author": "J.K. Rowling",
        "publication_date": "1998-07-02",
        "genre": "Fantasía",
        "summary": "Harry Potter regresa a Hogwarts para su segundo año, donde descubre la existencia de una cámara secreta que amenaza a los estudiantes.",
        "coverimage": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/books%2Fhp2.jpg?alt=media&token=860ec07d-b2d0-49b0-942a-dc959b70ef27"
    },
    {
        "id": 1001,
        "title": "Harry Potter y el prisionero de Azkaban",
        "author": "J.K. Rowling",
        "publication_date": "1999-07-08",
        "genre": "Fantasía",
        "summary": "En su tercer año en Hogwarts, Harry descubre que Sirius Black, un prisionero fugado, puede tener una conexión oscura con su pasado.",
        "coverimage": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/books%2Fhp3.jpg?alt=media&token=78a1f353-1206-4fc7-8a17-9a1d736389c3"
    },
    {
        "id": 1111,
        "title": "Harry Potter y el cáliz de fuego",
        "author": "J.K. Rowling",
        "publication_date": "2000-07-08",
        "genre": "Fantasía",
        "summary": "Harry es misteriosamente seleccionado para participar en el peligroso Torneo de los Tres Magos, enfrentando desafíos que pondrán a prueba su valentía.",
        "coverimage": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/books%2Fhp4.gif?alt=media&token=f9950ad1-2c74-4d84-a7bd-9acd65f9329c"
    },
    {
        "id": 100555,
        "title": "Harry Potter y la Orden del Fénix",
        "author": "J.K. Rowling",
        "publication_date": "2003-06-21",
        "genre": "Fantasía",
        "summary": "Mientras Voldemort gana fuerza, Harry y sus amigos se unen a la Orden del Fénix para resistir la amenaza creciente del lado oscuro.",
        "coverimage": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/books%2Fhp5.png?alt=media&token=47028b64-2098-42d8-8d5c-ae1b60d027fa"
    },
    {
        "id": 10078,
        "title": "Harry Potter y el misterio del príncipe",
        "author": "J.K. Rowling",
        "publication_date": "2005-07-16",
        "genre": "Fantasía",
        "summary": "Harry comienza a descubrir los secretos del pasado de Voldemort mientras se prepara para enfrentarse al enemigo cada vez más poderoso.",
        "coverimage": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/books%2Fhp6.gif?alt=media&token=5648a214-fafd-478c-88c2-42ab966d6d37"
    },
    {
        "id": 1009,
        "title": "Harry Potter y las reliquias de la Muerte",
        "author": "J.K. Rowling",
        "publication_date": "2007-07-21",
        "genre": "Fantasía",
        "summary": "Harry, Ron y Hermione se embarcan en una misión para destruir los horrocruxes de Voldemort y poner fin a su reinado de terror.",
        "coverimage": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/books%2Fhp7.jpg?alt=media&token=9b07ca79-4ea4-40a4-94d5-b0d980dbc10d"
    },
    {
        "id": 100779,
        "title": "En llamas",
        "author": "Suzanne Collins",
        "publication_date": "2009-09-01",
        "genre": "Ciencia ficción distópica",
        "summary": "Katniss y Peeta regresan al Capitolio y enfrentan nuevas amenazas en el 75º aniversario de los Juegos del Hambre.",
        "coverimage": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/books%2Fenllamas.jpeg?alt=media&token=e6d2558c-d87d-493c-966d-7b4cd2ac72c9"
    },
    {
        "id": 10560,
        "title": "Sinsajo",
        "author": "Suzanne Collins",
        "publication_date": "2010-08-24",
        "genre": "Ciencia ficción distópica",
        "summary": "Katniss lidera una revolución contra el Capitolio mientras lucha por la supervivencia de los distritos.",
        "coverimage": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/books%2Fsinsajo.jpeg?alt=media&token=965d423a-0207-43c5-bc34-6e1a8960f245"
    },
    {
        "id": 1003245,
        "title": "Vida y muerte: Crepúsculo reinterpretado",
        "author": "Stephenie Meyer",
        "publication_date": "2015-10-06",
        "genre": "Romance paranormal",
        "summary": "Una versión alternativa de Crepúsculo donde los roles de género están invertidos, y la historia sigue a Beau y Edythe.",
        "coverimage": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/books%2Fvida%20y%20muerte.jpg?alt=media&token=587f1391-13c7-4496-bbe7-f8c1f6a09fb6"
    },
    {
        "id": 103520,
        "title": "La huésped",
        "author": "Stephenie Meyer",
        "publication_date": "2008-05-06",
        "genre": "Ciencia ficción romántica",
        "summary": "Melanie lucha por mantener su identidad cuando su cuerpo es invadido por un alienígena que toma el control.",
        "coverimage": "https://firebasestorage.googleapis.com/v0/b/buena-leida.appspot.com/o/books%2Fla%20huesped.jpeg?alt=media&token=0fc5e21f-1cf8-4366-9ac8-676bb17908f5"
    }
];

const createBooks = async (books) => {
    try {
      const response = await axios.post("http://localhost:3000/books", books, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log("Books processed successfully:", response.data);
    } catch (error) {
      console.error("Error processing books:", error.response?.data || error.message);
    }
  };

async function agregarVariosLibros() {
    await createBooks(books);
  
}

agregarVariosLibros();

module.exports = agregarVariosLibros;
