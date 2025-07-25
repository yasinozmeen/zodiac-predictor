import { describe, it, expect, jest } from '@jest/globals'
import { ApiResponse } from '../../utils/ApiResponse.js'
import { Response } from 'express'

// Mock Express Response
const mockResponse = () => {
  const res = {} as Response
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('ApiResponse', () => {
  describe('success', () => {
    it('should return success response with default status 200', () => {
      const res = mockResponse()
      const testData = { id: '123', name: 'Test' }
      const message = 'Operation successful'

      ApiResponse.success(res, testData, message)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: testData,
        message,
        timestamp: expect.any(String),
      })
    })

    it('should return success response with custom status code', () => {
      const res = mockResponse()
      const testData = { id: '456' }
      const message = 'Custom success'
      const statusCode = 202

      ApiResponse.success(res, testData, message, statusCode)

      expect(res.status).toHaveBeenCalledWith(statusCode)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: testData,
        message,
        timestamp: expect.any(String),
      })
    })
  })

  describe('error', () => {
    it('should return error response with default status 500', () => {
      const res = mockResponse()
      const message = 'Something went wrong'

      ApiResponse.error(res, message)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message,
        error: undefined,
        details: undefined,
        timestamp: expect.any(String),
      })
    })

    it('should return error response with error object', () => {
      const res = mockResponse()
      const message = 'Database error'
      const error = new Error('Connection failed')
      const statusCode = 503

      ApiResponse.error(res, message, statusCode, error)

      expect(res.status).toHaveBeenCalledWith(statusCode)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message,
        error: error.message,
        details: undefined,
        timestamp: expect.any(String),
      })
    })

    it('should include details when provided', () => {
      const res = mockResponse()
      const message = 'Validation failed'
      const details = { field: 'email', reason: 'invalid format' }

      ApiResponse.error(res, message, 400, undefined, details)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message,
        error: undefined,
        details,
        timestamp: expect.any(String),
      })
    })
  })

  describe('validationError', () => {
    it('should return validation error with status 400', () => {
      const res = mockResponse()
      const message = 'Invalid input data'
      const validation = { isValid: false, errors: ['field required'] }

      ApiResponse.validationError(res, message, validation)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message,
        validation,
        timestamp: expect.any(String),
      })
    })
  })

  describe('notFound', () => {
    it('should return not found with default message', () => {
      const res = mockResponse()

      ApiResponse.notFound(res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Resource not found',
        timestamp: expect.any(String),
      })
    })

    it('should return not found with custom message', () => {
      const res = mockResponse()
      const message = 'User not found'

      ApiResponse.notFound(res, message)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message,
        timestamp: expect.any(String),
      })
    })
  })

  describe('created', () => {
    it('should return created response with status 201', () => {
      const res = mockResponse()
      const data = { id: '789', name: 'New Item' }
      const message = 'Item created'

      ApiResponse.created(res, data, message)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data,
        message,
        timestamp: expect.any(String),
      })
    })
  })

  describe('multiStatus', () => {
    it('should return multi-status response with status 207', () => {
      const res = mockResponse()
      const data = { successful: 5, failed: 2 }
      const message = 'Bulk operation completed'

      ApiResponse.multiStatus(res, data, message)

      expect(res.status).toHaveBeenCalledWith(207)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data,
        message,
        timestamp: expect.any(String),
      })
    })
  })

  describe('timestamp format', () => {
    it('should include valid ISO timestamp', () => {
      const res = mockResponse()
      const beforeCall = new Date()

      ApiResponse.success(res, {}, 'test')

      const afterCall = new Date()
      const callArgs = (res.json as jest.Mock).mock.calls[0][0]
      const timestamp = new Date(callArgs.timestamp)

      expect(timestamp.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime())
      expect(timestamp.getTime()).toBeLessThanOrEqual(afterCall.getTime())
      expect(callArgs.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    })
  })
})
