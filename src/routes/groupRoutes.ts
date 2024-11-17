import { Router } from 'express';
import { createGroup,
    getGroupInfo,
    getGroupMembers
} from '../controllers/groupController';

const router = Router();

router.post('/create', createGroup);

router.get('/:groupId/info', getGroupInfo); 
router.get('/:groupId/members', getGroupMembers); 


export default router;
