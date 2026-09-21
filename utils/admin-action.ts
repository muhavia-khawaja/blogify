'use server'

import prisma from '@/prisma/script'

type ResultActionResponse = {
  success: boolean
  message?: string
  error?: string
}

export async function getResults({
  query = '',
  status = 'ALL',
  page = 1,
  limit = 10,
}: {
  query?: string
  status?: 'ALL' | 'ACTIVE' | 'INACTIVE'
  page?: number
  limit?: number
}) {
  try {
    const currentPage = Math.max(1, Number(page) || 1)
    const pageSize = Math.max(1, Number(limit) || 10)
    const skip = (currentPage - 1) * pageSize

    const where: any = {}

    if (query.trim()) {
      where.OR = [
        {
          title: {
            contains: query.trim(),
            mode: 'insensitive',
          },
        },
        {
          url: {
            contains: query.trim(),
            mode: 'insensitive',
          },
        },
        {
          refUrl: {
            contains: query.trim(),
            mode: 'insensitive',
          },
        },
      ]
    }

    if (status === 'ACTIVE') {
      where.status = true
    }

    if (status === 'INACTIVE') {
      where.status = false
    }

    const [results, totalCount] = await Promise.all([
      prisma.result.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: pageSize,
      }),

      prisma.result.count({
        where,
      }),
    ])

    return {
      results,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
      currentPage,
    }
  } catch (error) {
    console.error('Failed to get results:', error)

    return {
      results: [],
      totalCount: 0,
      totalPages: 1,
      currentPage: 1,
      error: 'Failed to load results.',
    }
  }
}

export async function createResult(data: {
  title: string
  url: string
  refUrl?: string | null
  status?: boolean
}): Promise<ResultActionResponse> {
  try {
    const title = data.title?.trim()
    const url = data.url?.trim()
    const refUrl = data.refUrl?.trim() || null

    if (!title) {
      return {
        success: false,
        error: 'Title is required.',
      }
    }

    if (!url) {
      return {
        success: false,
        error: 'Result URL is required.',
      }
    }

    await prisma.result.create({
      data: {
        title,
        url,
        refUrl,
        status: Boolean(data.status),
      },
    })

    return {
      success: true,
      message: 'Result created successfully.',
    }
  } catch (error) {
    console.error('Create result failed:', error)

    return {
      success: false,
      error: 'Failed to create result.',
    }
  }
}

export async function updateResult(
  id: string,
  data: {
    title: string
    url: string
    refUrl?: string | null
    status?: boolean
  },
): Promise<ResultActionResponse> {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Result ID is required.',
      }
    }

    const title = data.title?.trim()
    const url = data.url?.trim()
    const refUrl = data.refUrl?.trim() || null

    if (!title) {
      return {
        success: false,
        error: 'Title is required.',
      }
    }

    if (!url) {
      return {
        success: false,
        error: 'Result URL is required.',
      }
    }

    await prisma.result.update({
      where: {
        id,
      },
      data: {
        title,
        url,
        refUrl,
        status: Boolean(data.status),
      },
    })

    return {
      success: true,
      message: 'Result updated successfully.',
    }
  } catch (error) {
    console.error('Update result failed:', error)

    return {
      success: false,
      error: 'Failed to update result.',
    }
  }
}

export async function toggleResultStatus(
  id: string,
  currentStatus: boolean,
): Promise<ResultActionResponse> {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Result ID is required.',
      }
    }

    await prisma.result.update({
      where: {
        id,
      },
      data: {
        status: !currentStatus,
      },
    })

    return {
      success: true,
      message: `Result ${!currentStatus ? 'published' : 'unpublished'} successfully.`,
    }
  } catch (error) {
    console.error('Toggle result status failed:', error)

    return {
      success: false,
      error: 'Failed to update result status.',
    }
  }
}

export async function deleteResult(id: string): Promise<ResultActionResponse> {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Result ID is required.',
      }
    }

    await prisma.result.delete({
      where: {
        id,
      },
    })

    return {
      success: true,
      message: 'Result deleted successfully.',
    }
  } catch (error) {
    console.error('Delete result failed:', error)

    return {
      success: false,
      error: 'Failed to delete result.',
    }
  }
}

export async function getResultById(id: string) {
  try {
    if (!id) return null

    return await prisma.result.findUnique({
      where: {
        id,
      },
    })
  } catch (error) {
    console.error('Failed to get result:', error)
    return null
  }
}

export async function fetchResultByRollNo(rollno: string) {
  try {
    if (!rollno?.trim()) {
      return {
        success: false,
        error: 'Roll number is required',
      }
    }

    const resultConfig = await prisma.result.findFirst({
      where: {
        status: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!resultConfig) {
      return {
        success: false,
        error: 'Result service is currently unavailable.',
      }
    }

    if (!resultConfig.url) {
      return {
        success: false,
        error: 'Result URL is not configured.',
      }
    }

    const response = await fetch(resultConfig.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: new URLSearchParams({
        rollno: rollno.trim(),
      }).toString(),

      cache: 'no-store',
    })

    if (!response.ok) {
      return {
        success: false,
        error: `Result server returned ${response.status}`,
      }
    }

    const data = await response.json()

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('FETCH RESULT ERROR:', error)

    return {
      success: false,
      error: 'Failed to fetch result from BISE server.',
    }
  }
}
