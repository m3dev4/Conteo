"use client"
import { useStoryStore } from '@/app/api/store/storyStore'
import React, {useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type StoryFormData = {
  title: string
  description: string
  content: string
  category: string
  image: FileList
}

const CreateHistory: React.FC = () => {
  const { stories, fetchStories, createStory, updateStory, deleteStory, loading, error } = useStoryStore()
  const { register, handleSubmit, reset } = useForm<StoryFormData>()
  const [editingStory, setEditingStory ] = useState<string | null>(null)

  useEffect(() => {
    fetchStories()
  }, [fetchStories])
  
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  return (
    <div>CreateHistory</div>
  )
}

export default CreateHistory