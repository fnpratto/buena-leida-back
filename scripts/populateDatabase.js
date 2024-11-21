// main.js
const crearGrupos = require('./crearGrupos');
const crearLibros = require('./crearLibros');
const agregarVariosUsuarios = require('./crearUsuarios');
const crearMultiplesReviews = require('./crearReviews');
const actualizarMultiplesFotosUsuarios = require('./actualizarFotosUsuarios');
const actualizarMultiplesFotosGrupos = require('./actualizarFotoGrupo');
const crearMultiplesDiscusiones = require('./crearDiscusiones');
const joinUsersToGroups = require('./unirseGrupos');


const ejecutarScripts = () => {
  console.log('Ejecutando script principal...');
  
  agregarVariosUsuarios();
  crearGrupos();  
  crearLibros();  
  crearMultiplesReviews();
  actualizarMultiplesFotosUsuarios();
  actualizarMultiplesFotosGrupos();
  joinUsersToGroups();
  crearMultiplesDiscusiones();

  console.log('Todos los scripts se ejecutaron correctamente');
};

ejecutarScripts();

module.exports = ejecutarScripts;
