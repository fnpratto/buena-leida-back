import { Router } from 'express';
import { createGroupDiscussion,
    getDiscussions
} from '../controllers/groupDiscussionController';

const router = Router();


router.post('/:groupId/create-discussion/', createGroupDiscussion);
router.get('/:groupId', getDiscussions);


export default router;