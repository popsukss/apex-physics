'use client'

import { FormEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n'

export function ContactForm() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        setStatus('error')
        setErrorMessage(data.error || t('contact_form.error_generic'))
        return
      }

      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
      setErrorMessage(t('contact_form.error_generic'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          {t('contact_form.name_label')}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={cn(
            'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm',
            'placeholder:text-muted-foreground',
            'focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          placeholder={t('contact_form.name_placeholder')}
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          {t('contact_form.email_label')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={cn(
            'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm',
            'placeholder:text-muted-foreground',
            'focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          placeholder="your.email@example.com"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          {t('contact_form.message_label')}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className={cn(
            'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm',
            'placeholder:text-muted-foreground',
            'focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-none'
          )}
          placeholder={t('contact_form.message_placeholder')}
          disabled={loading}
        />
      </div>

      {status === 'success' && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
          {t('contact_form.success')}
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          {errorMessage}
        </div>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? t('contact_form.sending') : t('contact_form.send')}
      </Button>
    </form>
  )
}
