'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

import { EyeIcon, EyeOffIcon, Loader } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, register } = useAuth();
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await (login as any)({ email, password })
      router.push('/')
    } catch (err: any) {
      let msg = 'An error occurred'
      if (err.response?.data) {
        if (typeof err.response.data === 'string') msg = err.response.data
        else msg = Object.values(err.response.data).flat().join(' ')
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
      {error && (
        <div className='rounded-md bg-red-50 p-3 text-sm text-red-600'>
          {error}
        </div>
      )}

      {/* Email */}
      <div className='space-y-1'>
        <Label htmlFor='userEmail' className='leading-5'>
          Email address*
        </Label>
        <Input type='email' id='userEmail' placeholder='Enter your email address' value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
      </div>

      {/* Password */}
      <div className='w-full space-y-1'>
        <Label htmlFor='password' className='leading-5'>
          Password*
        </Label>
        <div className='relative'>
          <Input id='password' type={isVisible ? 'text' : 'password'} placeholder='••••••••••••••••' className='pr-9' value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
          <Button
            variant='ghost'
            size='icon'
            type='button'
            onClick={() => setIsVisible(prevState => !prevState)}
            className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'
            disabled={loading}
          >
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
            <span className='sr-only'>{isVisible ? 'Hide password' : 'Show password'}</span>
          </Button>
        </div>
      </div>

      <Button className='w-full' type='submit' disabled={loading}>
        {loading ? (
          <>
            <Loader className='mr-2 h-4 w-4 animate-spin' />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  )
}

export default LoginForm
