import request from 'supertest'
import express from 'express'
import { categoriesRouter } from '../../routes/categories'
import { CategoryService } from '../../services/categoryService'

// Mock CategoryService
jest.mock('../../services/categoryService')

const mockCategoryService = CategoryService as jest.Mocked<typeof CategoryService>

// Create test app
const app = express()
app.use(express.json())
app.use('/api/v1/categories', categoriesRouter)

describe('Categories Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/v1/categories', () => {
    it('should get all categories', async () => {
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

      const response = await request(app).get('/api/v1/categories')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toEqual(mockCategories)
    })
  })

  describe('GET /api/v1/categories/:id', () => {
    it('should get category by valid UUID', async () => {
      const categoryId = '123e4567-e89b-12d3-a456-426614174000'
      const mockCategory = {
        id: categoryId,
        name: 'Personality Traits',
        description: 'Questions about personality',
        orderIndex: 1,
        iconName: 'user-circle',
        createdAt: '2025-07-25T10:00:00Z',
      }

      mockCategoryService.getById.mockResolvedValue(mockCategory)

      const response = await request(app).get(`/api/v1/categories/${categoryId}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toEqual(mockCategory)
    })

    it('should return 400 for invalid UUID', async () => {
      const response = await request(app).get('/api/v1/categories/invalid-uuid')

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Invalid id format')
    })
  })

  describe('POST /api/v1/categories', () => {
    it('should create category with valid data', async () => {
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

      const response = await request(app).post('/api/v1/categories').send(categoryData)

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toEqual(mockCreatedCategory)
    })

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        name: '', // Empty name
        orderIndex: -1, // Negative order index
      }

      const response = await request(app).post('/api/v1/categories').send(invalidData)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Validation failed')
      expect(response.body.errors).toContain('Name is required and must be a non-empty string')
      expect(response.body.errors).toContain(
        'Order index is required and must be a non-negative number'
      )
    })

    it('should return 400 when name is too long', async () => {
      const invalidData = {
        name: 'A'.repeat(101), // Too long name
        orderIndex: 1,
      }

      const response = await request(app).post('/api/v1/categories').send(invalidData)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.errors).toContain('Name must be 100 characters or less')
    })
  })

  describe('DELETE /api/v1/categories/:id', () => {
    it('should delete category with valid UUID', async () => {
      const categoryId = '123e4567-e89b-12d3-a456-426614174000'

      mockCategoryService.delete.mockResolvedValue()

      const response = await request(app).delete(`/api/v1/categories/${categoryId}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Category deleted successfully')
      expect(mockCategoryService.delete).toHaveBeenCalledWith(categoryId)
    })

    it('should return 400 for invalid UUID', async () => {
      const response = await request(app).delete('/api/v1/categories/invalid-uuid')

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Invalid id format')
    })
  })
})
