import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Lock, MessageSquare, User } from 'lucide-react';
import AuthImagePattern from '../../components/authImagePattern/AuthImagePattern';
import Input from '../../components/input/Input';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLogingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData, navigate, location);
  };

  const fields = [
    {
      label: 'Email or Handle',
      name: 'identifier',
      placeholder: 'kemo414',
      icon: <User className='size-5 text-base-content/40' />,
      type: 'text',
    },
    {
      label: 'Password',
      name: 'password',
      placeholder: '******',
      icon: <Lock className='size-5 text-base-content/40' />,
      type: showPassword ? 'text' : 'password',
      rightElement: (
        <button
          type='button'
          aria-label='Toggle password visibility'
          className='absolute inset-y-0 right-0 pr-3 flex items-center'
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className='size-5 text-base-content/40' />
          ) : (
            <Eye className='size-5 text-base-content/40' />
          )}
        </button>
      ),
    },
  ];

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left - Form */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors mt-6'>
                <MessageSquare className='size-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold mt-0'>Login Now</h1>
              <p className='text-base-content/60'>Start chatting with your loved ones</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {fields.map((field) => (
              <Input
                key={field.name}
                {...field}
                value={formData[field.name]}
                onChange={(e) =>
                  setFormData({ ...formData, [field.name]: e.target.value })
                }
              />
            ))}

            <button
              type='submit'
              className='btn btn-primary w-full'
              disabled={isLogingIn}
            >
              {isLogingIn ? (
                <>
                  <Loader2 className='size-5 animate-spin' />
                  Loading...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className='text-center'>
            <p className='text-base-content/60'>
              Don't have an account?{' '}
              <Link to='/signup' className='link link-primary'>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right - Image */}
      <AuthImagePattern
        title='Welcome Back'
        subtitle='Connect with friends, share moments, and stay in touch with your loved ones.'
      />
    </div>
  );
}

export default Login;
