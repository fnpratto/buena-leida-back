import { Router } from 'express';
import { createGroupDiscussion
} from '../controllers/groupDiscussionController';

const router = Router();


router.post('/:groupId/discussion/', createGroupDiscussion);

export default router;