import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User, User2, UserCircle } from 'lucide-react';
import Input from '../../components/input/Input';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../../components/authImagePattern/AuthImagePattern';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [show, setShow] = useState({ password: false, confirmPassword: false });
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    handle: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const { signup, isSigningUp } = useAuthStore();

  const toggleShow = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return toast.error('First Name is required');
    if (!formData.lastName.trim()) return toast.error('Last Name is required');
    if (!formData.handle.trim()) return toast.error('Handle is required');
    if (!formData.email.trim()) return toast.error('Email is required');
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error('Please enter a valid email');
    if (!formData.password) return toast.error('Password is required');
    if (formData.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (!formData.confirmPassword) return toast.error('Confirm Password is required');
    if (formData.confirmPassword !== formData.password) return toast.error("Passwords don't match");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) signup(formData, navigate);
  };

  const fields = [
    {
      label: 'First Name',
      name: 'firstName',
      placeholder: 'Ahmed',
      icon: <User className='size-5 text-base-content/40' />,
      type: 'text',
    },
    {
      label: 'Last Name',
      name: 'lastName',
      placeholder: 'Kamal',
      icon: <User2 className='size-5 text-base-content/40' />,
      type: 'text',
    },
    {
      label: 'Handle',
      name: 'handle',
      placeholder: 'Ahmed123',
      icon: <UserCircle className='size-5 text-base-content/40' />,
      type: 'text',
    },
    {
      label: 'Email',
      name: 'email',
      placeholder: 'something@example.com',
      icon: <Mail className='size-5 text-base-content/40' />,
      type: 'email',
    },
    {
      label: 'Password',
      name: 'password',
      placeholder: '******',
      icon: <Lock className='size-5 text-base-content/40' />,
      type: show.password ? 'text' : 'password',
      rightElement: (
        <button
          type='button'
          aria-label='Toggle password visibility'
          className='absolute inset-y-0 right-0 pr-3 flex items-center'
          onClick={() => toggleShow('password')}
        >
          {show.password ? <EyeOff className='size-5 text-base-content/40' /> : <Eye className='size-5 text-base-content/40' />}
        </button>
      ),
    },
    {
      label: 'Confirm Password',
      name: 'confirmPassword',
      placeholder: '******',
      icon: <Lock className='size-5 text-base-content/40' />,
      type: show.confirmPassword ? 'text' : 'password',
      rightElement: (
        <button
          type='button'
          aria-label='Toggle confirm password visibility'
          className='absolute inset-y-0 right-0 pr-3 flex items-center'
          onClick={() => toggleShow('confirmPassword')}
        >
          {show.confirmPassword ? <EyeOff className='size-5 text-base-content/40' /> : <Eye className='size-5 text-base-content/40' />}
        </button>
      ),
    },
  ];

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left side - Form */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors mt-6'>
                <MessageSquare className='size-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold'>Create Account</h1>
              <p className='text-base-content/60'>Get Started With Your Free Account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {fields.map((field) => (
              <Input
                key={field.name}
                {...field}
                value={formData[field.name]}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              />
            ))}

            <button type='submit' className='btn btn-primary w-full' disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className='size-5 animate-spin' />
                  Loading...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className='text-center'>
            <p className='text-base-content/60'>
              Already have an account? <Link to='/login' className='link link-primary'>Sign In</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <AuthImagePattern
        title='Join Our Community'
        subtitle='Connect with friends, share moments, and stay in touch with your loved ones.'
      />
    </div>
  );
}

export default Signup;
