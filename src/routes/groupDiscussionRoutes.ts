import { Router } from 'express';
import { createGroupDiscussion,
    getDiscussions
} from '../controllers/groupDiscussionController';
import { createComment, getComments } from "../controllers/discussionCommentController";

const router = Router();

router.post('/:groupId/create-discussion/', createGroupDiscussion);
router.get('/:groupId', getDiscussions);
router.post('/:groupId/discussions/:discussionId/comments', createComment);
router.get('/:groupId/discussions/:discussionId/comments', getComments);

export default router;