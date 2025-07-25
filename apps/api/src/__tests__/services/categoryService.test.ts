import { CategoryService } from '../../services/categoryService'
import { supabase } from '../../utils/supabase'

// Mock Supabase
jest.mock('../../utils/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

const mockSupabase = supabase as jest.Mocked<typeof supabase>

describe('CategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all categories successfully', async () => {
      const mockData = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Personality Traits',
          description: 'Questions about personality',
          order_index: 1,
          icon_name: 'user-circle',
          created_at: '2025-07-25T10:00:00Z',
        },
      ]

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await CategoryService.getAll()

      expect(mockSupabase.from).toHaveBeenCalledWith('categories')
      expect(mockQuery.select).toHaveBeenCalledWith('*')
      expect(mockQuery.order).toHaveBeenCalledWith('order_index', { ascending: true })
      expect(result).toEqual([
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Personality Traits',
          description: 'Questions about personality',
          orderIndex: 1,
          iconName: 'user-circle',
          createdAt: '2025-07-25T10:00:00Z',
        },
      ])
    })

    it('should throw error when database fails', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      await expect(CategoryService.getAll()).rejects.toThrow(
        'Failed to fetch categories: Database error'
      )
    })
  })

  describe('getById', () => {
    it('should fetch category by ID successfully', async () => {
      const mockData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Personality Traits',
        description: 'Questions about personality',
        order_index: 1,
        icon_name: 'user-circle',
        created_at: '2025-07-25T10:00:00Z',
      }

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await CategoryService.getById('123e4567-e89b-12d3-a456-426614174000')

      expect(mockSupabase.from).toHaveBeenCalledWith('categories')
      expect(mockQuery.eq).toHaveBeenCalledWith('id', '123e4567-e89b-12d3-a456-426614174000')
      expect(result).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Personality Traits',
        description: 'Questions about personality',
        orderIndex: 1,
        iconName: 'user-circle',
        createdAt: '2025-07-25T10:00:00Z',
      })
    })

    it('should return null when category not found', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' },
        }),
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await CategoryService.getById('nonexistent-id')

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('should create category successfully', async () => {
      const categoryData = {
        name: 'New Category',
        description: 'New description',
        orderIndex: 5,
        iconName: 'star',
      }

      const mockCreatedData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'New Category',
        description: 'New description',
        order_index: 5,
        icon_name: 'star',
        created_at: '2025-07-25T10:00:00Z',
      }

      const mockQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockCreatedData, error: null }),
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await CategoryService.create(categoryData)

      expect(mockSupabase.from).toHaveBeenCalledWith('categories')
      expect(mockQuery.insert).toHaveBeenCalledWith({
        name: 'New Category',
        description: 'New description',
        order_index: 5,
        icon_name: 'star',
      })
      expect(result).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'New Category',
        description: 'New description',
        orderIndex: 5,
        iconName: 'star',
        createdAt: '2025-07-25T10:00:00Z',
      })
    })
  })
})
