import { Router } from 'express'
import { CategoryController } from '../controllers/CategoryController.js'
import { validateUUID, validateCategoryData } from '../middleware/validation.js'

const router = Router()

// GET /api/v1/categories - Get all categories
router.get('/', CategoryController.getCategories)

// GET /api/v1/categories/:id - Get category by ID
router.get('/:id', validateUUID('id'), CategoryController.getCategoryById)

// POST /api/v1/categories - Create new category (for admin/testing purposes)
router.post('/', validateCategoryData, CategoryController.createCategory)

// PUT /api/v1/categories/:id - Update category (for admin/testing purposes)
router.put('/:id', validateUUID('id'), CategoryController.updateCategory)

// DELETE /api/v1/categories/:id - Delete category (for admin/testing purposes)
router.delete('/:id', validateUUID('id'), CategoryController.deleteCategory)

export { router as categoriesRouter }
