import React from 'react'

import { getCategories } from '@/utils/admin/action'
import CategoriesUI from '@/components/CategoryUI'

export default async function CategoriesPage() {
  const categories = await getCategories()

  return <CategoriesUI initialCategories={categories} />
}
