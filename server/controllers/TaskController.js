import { ApiError } from '../helper/apierror.js'
import { selectAllTasks, insertTask, deleteTask } from '../models/Task.js'

const getTasks = async (req, res, next) => {
    try {
        const result = await selectAllTasks()
        return res.status(200).json(result.rows || [])
    } catch (error) {
        return next(error)
    }
}

const createTask = async (req, res, next) => {
    try {
        const description = req.body.task?.description?.trim()

        if (!description) {
            const error = new ApiError('Task description is required', 400)
            return next(error)
        }

        const result = await insertTask(description)
        return res.status(201).json(result.rows[0])
    } catch (error) {
        return next(error)
    }
}

const removeTask = async (req, res, next) => {
    try {
        const { id } = req.params
    
        console.log(`Deleting task with id: ${id}`)
        const result = await deleteTask(id)

        if (result.rowCount === 0) {
            const error = new ApiError('Task not found', 404)
            return next (error)
        }

        return res.status(200).json({id:id})
    } catch (error) {
        return next(error)
    }
}

export { getTasks, createTask, removeTask }