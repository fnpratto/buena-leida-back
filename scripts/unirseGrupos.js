const axios = require('axios');

const groups = [1, 2, 3];  
const users = [1, 2, 3, 4, 5];  

const apiUrl = 'https://buena-leida-back-kamk.onrender.com/groups/enterGroup';  

async function joinUsersToGroups() {
  for (let userId of users) {
    for (let groupId of groups) {
      if (!userId || !groupId) {
        console.error(`Error: Faltan los datos necesarios para el usuario ${userId} o el grupo ${groupId}`);
        continue; 
      }

      try {
        const response = await axios.post(apiUrl, {
          userId,
          groupId
        });

        
        if (response.status === 201) {
          console.log(`Usuario ${userId} unido al grupo ${groupId}: ${response.data.message}`);
        } else {
          console.error(`Error al unir al usuario ${userId} al grupo ${groupId}: ${response.data.message}`);
        }
      } catch (error) {
        
        if (error.response) {
          console.error(`Error al unir al usuario ${userId} al grupo ${groupId}: ${error.response.data.message}`);
        } else if (error.request) {
          console.error(`No se recibió respuesta al intentar unir al usuario ${userId} al grupo ${groupId}.`);
        } else {
          console.error(`Error al intentar unir al usuario ${userId} al grupo ${groupId}: ${error.message}`);
        }
      }
    }
  }
}

joinUsersToGroups();
module.exports = joinUsersToGroups;


