import React from 'react'
import {
  getTopics,
} from '@/utils/admin/action'
import TopicsUI from '@/components/topicsUI'

export default async function TopicsPage() {
  const topics = await getTopics()

  return <TopicsUI initialTopics={topics} />
}