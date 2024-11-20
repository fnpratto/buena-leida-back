//correr con : node crearGrupos.js

const axios = require('axios');


const apiUrl = 'http://localhost:3000/groups/create'; 


const generosLibros = [
    { nombre: 'Fans de Ciencia Ficción', bio: 'Un grupo para los amantes de la ciencia ficción', genero: ['Ciencia Ficción'], creatorId: 1 },
    { nombre: 'Fans de Fantasía', bio: 'Para todos los amantes de la fantasía', genero: ['Fantasía'], creatorId: 1 },
    { nombre: 'Fans de Misterio', bio: 'Historias de detectives y misterios', genero: ['Misterio'], creatorId: 1 },
    { nombre: 'Fans de Ficción Histórica', bio: 'Libros ambientados en el pasado', genero: ['Ficción Histórica'], creatorId: 1 },
    { nombre: 'Fans de Terror', bio: 'Para los que aman las historias de terror', genero: ['Terror'], creatorId: 1 },
    { nombre: 'Fans de Romántica', bio: 'Novelas y relatos de amor', genero: ['Romántica'], creatorId: 1 },
    { nombre: 'Fans de No Ficción', bio: 'Libros informativos y basados en hechos reales', genero: ['No Ficción'], creatorId: 1 },
    { nombre: 'Fans de Suspenso', bio: 'Alta tensión y emoción en cada página', genero: ['Suspenso'], creatorId: 1 },
    { nombre: 'Fans de Biografías', bio: 'Historias de vidas reales', genero: ['Biografía'], creatorId: 1 },
    { nombre: 'Fans de Harry Potter', bio: 'Libros dirigidos a adolescentes y jóvenes', genero: ['Juvenil'], creatorId: 1 }
  ];

  
  async function crearGrupo(grupo) {
    try {
        console.log('Enviando grupo:', grupo);
    
        const response = await axios.post(apiUrl, {
          name: grupo.nombre,
          bio: grupo.bio,
          creatorId: grupo.creatorId,
          genre: grupo.genero
        });
        
        console.log(`Grupo "${grupo.nombre}" creado con éxito.`);
    } catch (error) {
      console.error(`Error al crear el grupo ${grupo.nombre}:`);
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


  async function crearMultiplesGrupos() {
    for (const datosGrupo of generosLibros) {
      await crearGrupo(datosGrupo);
    }
  }
  

  crearMultiplesGrupos();