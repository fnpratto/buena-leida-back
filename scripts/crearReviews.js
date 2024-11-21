
const axios = require('axios');
const apiUrl = 'http://localhost:3000/reviews/review'; 


const reviews =  [
      {
        "isbn": 100,
        "iduser": 1,
        "calification": 5,
        "texto": "Un libro mágico que marcó mi infancia. La historia de Harry es inspiradora y emocionante."
      },
      {
        "isbn": 100,
        "iduser": 2,
        "calification": 4,
        "texto": "Buena historia, aunque a veces predecible. Sin embargo, la magia de Hogwarts es innegable."
      },
      {
        "isbn": 101,
        "iduser": 3,
        "calification": 5,
        "texto": "Increíble trama distópica que te atrapa desde el primer momento. Katniss es una gran protagonista."
      },
      {
        "isbn": 101,
        "iduser": 4,
        "calification": 3,
        "texto": "Interesante, pero esperaba más desarrollo en ciertos personajes secundarios."
      },
      {
        "isbn": 102,
        "iduser": 5,
        "calification": 2,
        "texto": "Un romance poco creíble y personajes que no evolucionan mucho. No me atrapó tanto."
      },
      {
        "isbn": 102,
        "iduser": 6,
        "calification": 4,
        "texto": "Me gustó mucho la temática y la idea de amor entre especies diferentes."
      },
      {
        "isbn": 103,
        "iduser": 7,
        "calification": 5,
        "texto": "Un thriller excelente que mantiene el suspenso hasta el final. Dan Brown nunca decepciona."
      },
      {
        "isbn": 103,
        "iduser": 8,
        "calification": 3,
        "texto": "La trama es buena, pero a veces la historia se vuelve demasiado rebuscada."
      },
      {
        "isbn": 104,
        "iduser": 9,
        "calification": 4,
        "texto": "Intrigante y bien escrito. El suspense es genial, pero algunas partes son lentas."
      },
      {
        "isbn": 104,
        "iduser": 10,
        "calification": 5,
        "texto": "Un thriller psicológico excelente, me mantuvo enganchado desde el principio."
      },
      {
        "isbn": 105,
        "iduser": 11,
        "calification": 5,
        "texto": "Una historia conmovedora que muestra la inocencia en medio del horror. Absolutamente impactante."
      },
      {
        "isbn": 105,
        "iduser": 12,
        "calification": 4,
        "texto": "Profundamente triste pero muy significativo. Un libro que todos deberían leer."
      },
      {
        "isbn": 106,
        "iduser": 13,
        "calification": 4,
        "texto": "Hermosa narrativa y personajes bien construidos. Una lectura emotiva."
      },
      {
        "isbn": 106,
        "iduser": 14,
        "calification": 3,
        "texto": "Bonita historia, aunque el desarrollo puede ser lento en algunos capítulos."
      },
      {
        "isbn": 107,
        "iduser": 15,
        "calification": 5,
        "texto": "Un libro lleno de emociones y reflexiones sobre la vida y la muerte. Muy recomendable."
      },
      {
        "isbn": 107,
        "iduser": 1,
        "calification": 4,
        "texto": "Una historia que toca temas profundos y difíciles de manera honesta y sincera."
      },
      {
        "isbn": 108,
        "iduser": 2,
        "calification": 4,
        "texto": "Un libro impactante sobre la opresión y el control. Atwood crea una sociedad aterradora pero fascinante."
      },
      {
        "isbn": 108,
        "iduser": 3,
        "calification": 5,
        "texto": "Una historia increíblemente potente sobre resistencia y esperanza en tiempos oscuros."
      },
      {
        "isbn": 109,
        "iduser": 4,
        "calification": 5,
        "texto": "Una mezcla de ciencia y aventura en un entorno único. La supervivencia de Watney es inspiradora."
      },
      {
        "isbn": 109,
        "iduser": 5,
        "calification": 4,
        "texto": "Muy bueno y entretenido, aunque algunos detalles científicos pueden ser complejos."
      }
    ]
  

    async function crearReview(review) {
        try {
          const response = await axios.post(apiUrl, review, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          console.log(`Review created successfully for ISBN ${review.isbn} by User ID ${review.iduser}:`, response.data);
        } catch (error) {
          console.error(
            `Error creating review for ISBN ${review.isbn} by User ID ${review.iduser}:`,
            error.response?.data || error.message
          );
        }
      }
      
    
    
      async function crearMultiplesReviews() {
        for (const review of reviews) {
          await crearReview(review);
        }
      }
      
    
      crearMultiplesReviews();