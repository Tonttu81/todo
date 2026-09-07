import { Router } from 'express'
import { auth } from '../helper/auth.js'
import { getTasks, createTask, removeTask } from '../controllers/TaskController.js'

const router = Router()

router.get('/', getTasks)
router.post('/', auth, createTask)
router.delete('/:id', auth, removeTask)

export default router