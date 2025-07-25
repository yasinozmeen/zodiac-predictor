import request from 'supertest'
import express from 'express'
import { CategoryController } from '../../controllers/CategoryController'
import { CategoryService } from '../../services/categoryService'

// Mock CategoryService
jest.mock('../../services/categoryService')

const mockCategoryService = CategoryService as jest.Mocked<typeof CategoryService>

// Create test app
const app = express()
app.use(express.json())
app.get('/categories', CategoryController.getCategories)
app.get('/categories/:id', CategoryController.getCategoryById)
app.post('/categories', CategoryController.createCategory)

describe('CategoryController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /categories', () => {
    it('should return all categories successfully', async () => {
      const mockCategories = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Personality Traits',
          description: 'Questions about personality',
          orderIndex: 1,
          iconName: 'user-circle',
          createdAt: '2025-07-25T10:00:00Z',
        },
      ]

      mockCategoryService.getAll.mockResolvedValue(mockCategories)

      const response = await request(app).get('/categories')

      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        success: true,
        data: mockCategories,
        message: 'Categories retrieved successfully',
      })
      expect(response.body.timestamp).toBeDefined()
    })

    it('should return 500 when service throws error', async () => {
      mockCategoryService.getAll.mockRejectedValue(new Error('Database error'))

      const response = await request(app).get('/categories')

      expect(response.status).toBe(500)
      expect(response.body).toMatchObject({
        success: false,
        message: 'Failed to fetch categories',
        error: 'Database error',
      })
    })
  })

  describe('GET /categories/:id', () => {
    it('should return category by ID successfully', async () => {
      const mockCategory = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Personality Traits',
        description: 'Questions about personality',
        orderIndex: 1,
        iconName: 'user-circle',
        createdAt: '2025-07-25T10:00:00Z',
      }

      mockCategoryService.getById.mockResolvedValue(mockCategory)

      const response = await request(app).get('/categories/123e4567-e89b-12d3-a456-426614174000')

      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        success: true,
        data: mockCategory,
        message: 'Category retrieved successfully',
      })
    })

    it('should return 404 when category not found', async () => {
      mockCategoryService.getById.mockResolvedValue(null)

      const response = await request(app).get('/categories/nonexistent-id')

      expect(response.status).toBe(404)
      expect(response.body).toMatchObject({
        success: false,
        message: 'Category not found',
      })
    })
  })

  describe('POST /categories', () => {
    it('should create category successfully', async () => {
      const categoryData = {
        name: 'New Category',
        description: 'New description',
        orderIndex: 5,
        iconName: 'star',
      }

      const mockCreatedCategory = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...categoryData,
        createdAt: '2025-07-25T10:00:00Z',
      }

      mockCategoryService.create.mockResolvedValue(mockCreatedCategory)

      const response = await request(app).post('/categories').send(categoryData)

      expect(response.status).toBe(201)
      expect(response.body).toMatchObject({
        success: true,
        data: mockCreatedCategory,
        message: 'Category created successfully',
      })
      expect(mockCategoryService.create).toHaveBeenCalledWith(categoryData)
    })

    it('should return 500 when creation fails', async () => {
      const categoryData = {
        name: 'New Category',
        orderIndex: 5,
      }

      mockCategoryService.create.mockRejectedValue(new Error('Creation failed'))

      const response = await request(app).post('/categories').send(categoryData)

      expect(response.status).toBe(500)
      expect(response.body).toMatchObject({
        success: false,
        message: 'Failed to create category',
        error: 'Creation failed',
      })
    })
  })
})
