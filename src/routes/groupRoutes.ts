import { Router } from 'express';
import { createGroup,
    getGroupInfo,
    getGroupMembers,
    updateGroupBio,
    updateGroupPhoto,
    removeGroup,
    getGroupsByName,
    getGroupsByGenre,
    getAllGroupGenres
} from '../controllers/groupController';

const router = Router();

router.post('/create', createGroup);

router.get('/', getGroupsByName);
router.get('/groups-by-genre', getGroupsByGenre);
router.get('/genres', getAllGroupGenres);
router.get('/:groupId/info', getGroupInfo); 
router.get('/:groupId/members', getGroupMembers);
router.patch('/:groupId/bio', updateGroupBio);
router.patch('/:groupId/photo', updateGroupPhoto);
router.delete('/:groupId/remove-group', removeGroup)


export default router;
