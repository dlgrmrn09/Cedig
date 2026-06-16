import { Router } from 'express';
import * as personController from '../controllers/personController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { createPersonSchema, updatePersonSchema, getPeopleQuerySchema } from '../validators/people.js';

const router = Router();

router.use(authenticate);

router.get('/', validate(getPeopleQuerySchema), personController.getPeople);
router.get('/:id', personController.getPersonById);
router.post('/', validate(createPersonSchema), personController.createPerson);
router.put('/:id', validate(updatePersonSchema), personController.updatePerson);
router.delete('/:id', personController.deletePerson);

export default router;
