import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { OrgProfileForm } from '../components/OrgProfileForm'
import { OrganizationResponse } from '../../../types'
import { useAuth } from '../../../context/AuthContext'
import * as apiService from '../../../services/apiService'

interface ProfileTabProps {
  organization: OrganizationResponse | null
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ organization }) => {
  const { user, refreshUserData } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<OrganizationResponse>({
    defaultValues: organization || user?.organization || {}
  })

  useEffect(() => {
    if (organization) {
      reset(organization)
    }
  }, [organization, reset])

  const onSaveProfile = async (data: OrganizationResponse) => {
    if (!user?.organization?.id) return
    setIsSaving(true)
    setSaveMessage(null)
    try {
      const updatedOrg = await apiService.updateOrganization(
        user.organization.id,
        data
      )
      if (user) {
        refreshUserData({ ...user, organization: updatedOrg })
      }
      reset(updatedOrg)
      setSaveMessage({
        type: 'success',
        text: 'Perfil actualizado correctamente.'
      })
    } catch (error: any) {
      setSaveMessage({
        type: 'error',
        text: error.message || 'Error al actualizar el perfil.'
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <OrgProfileForm
      user={user}
      control={control}
      errors={errors}
      isSaving={isSaving}
      handleSubmit={handleSubmit}
      onSaveProfile={onSaveProfile}
      saveMessage={saveMessage}
    />
  )
}
