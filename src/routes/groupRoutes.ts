import { Router } from 'express';
import { createGroup,
    getGroupInfo,
    getGroupMembers,
    updateGroupBio,
    updateGroupPhoto,
    removeGroup
} from '../controllers/groupController';

const router = Router();

router.post('/create', createGroup);

router.get('/:groupId/info', getGroupInfo); 
router.get('/:groupId/members', getGroupMembers);
router.patch('/:groupId/bio', updateGroupBio);
router.patch('/:groupId/photo', updateGroupPhoto);
router.delete('/:groupId/remove-group', removeGroup)


export default router;
