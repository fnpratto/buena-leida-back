import { Router } from 'express';
import { createGroup,
    getGroupInfo,
    getGroupMembers,
    updateGroupBio,
    updateGroupPhoto,
    removeGroup,
    getGroupsByName,
    getGroupsByGenre,
    getAllGroupGenres,
    enterGroup,
    leaveGroup,
    updateGroupGenre
} from '../controllers/groupController';

const router = Router();

router.post('/create', createGroup);
router.post('/enterGroup', enterGroup);
router.delete('/leaveGroup', leaveGroup);

router.get('/name/:name', getGroupsByName);
router.get('/groups-by-genre/:genre', getGroupsByGenre);
router.get('/genres', getAllGroupGenres);
router.get('/:groupId/info', getGroupInfo); 
router.get('/:groupId/members', getGroupMembers);
router.patch('/:groupId/update-bio', updateGroupBio);
router.patch('/:groupId/update-photo', updateGroupPhoto);
router.delete('/:groupId/remove-group', removeGroup);
router.patch("/:groupId/update-genre", updateGroupGenre);


export default router;
