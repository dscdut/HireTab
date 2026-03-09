'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { PASSWORD_TYPE, TEXT_TYPE } from '@/core/configs/consts';
import { path } from '@/core/constants/path';
import { mutationKeys } from '@/core/helpers/key-tanstack';
import { authApi } from '@/core/services/auth.service';
import {
  setAccessTokenToLS,
  setRefreshTokenToLS,
  setUserToLS,
  getAccessTokenFromLS,
  getUserFromLocalStorage,
} from '@/core/shared/storage/storage';
import { LoginSchema } from '@/core/zod/login.zod';
import { useAppMutation } from '@/hooks/useAppMutation';

const REMEMBER_ME = 'LOCAL_STORAGE_REMEMBER_ME';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [userRole, setUserRole] = useState('Job Seeker');
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem(REMEMBER_ME) === 'true'
  );

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const mutationLogin = useAppMutation(authApi.login, {
    mutationKey: mutationKeys.login,
  });

  const onSubmit = useCallback(() => {
    setIsLoading(true);
    const loginData = form.getValues();

    mutationLogin.mutate(loginData, {
      onSuccess: ({ access_token, refresh_token, user }) => {
        handleLoginSuccess(access_token, refresh_token, user);
      },
      onError: () => {
        toast.error('Login failed!');
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  }, [form, mutationLogin]);

  const handleLoginSuccess = useCallback((accessToken, refreshToken, user) => {
    setAccessTokenToLS(accessToken);
    setRefreshTokenToLS(refreshToken);
    setUserToLS(user);

    if (rememberMe) {
      localStorage.setItem('email', user.email);
    }

    navigate(path.hr.hr_dashboard);
    toast.success('Welcome back to HireTab! 🚀');
  }, [navigate, rememberMe]);

  useEffect(() => {
    if (rememberMe) {
      const savedEmail = localStorage.getItem('email');
      if (savedEmail) {
        form.setValue('email', savedEmail);
      }
    }

    const accessToken = getAccessTokenFromLS();
    const user = getUserFromLocalStorage();

    if (accessToken && user) {
      navigate(path.hr.hr_dashboard);
    }
  }, [form, rememberMe, navigate]);

  return (
    <div className="flex min-h-screen bg-white font-outfit">
      {/* Left Side - Visual Testimonial */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative hidden xl:flex xl:w-[55%] bg-[#F8F8FD] p-12 flex-col justify-between overflow-hidden"
      >
        {/* Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 text-white bg-indigo-600 rounded-full shadow-lg">
            <span className="text-xl font-bold">H</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">HireTab</span>
        </div>

        {/* Hero Image Section */}
        <div className="relative flex flex-col items-center justify-center flex-1 py-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            {/* Main Image Plate */}
            <div className="relative z-0 overflow-hidden rounded-3xl">
              <img
                src="https://images.pexels.com/photos/3777570/pexels-photo-3777570.jpeg"
                alt="Success professional"
                className="w-full h-auto max-w-xl object-cover rounded-3xl shadow-3xl scale-[1.05] grayscale-[0.05]"
              />
            </div>

            {/* Floating Stat Card */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute top-20 -left-20 bg-white p-6 rounded-2xl shadow-2xl z-20 border border-gray-50/50 max-w-[180px]"
            >
              <div className="flex gap-1.5 mb-3 items-end h-8">
                <div className="w-1.5 h-4 bg-indigo-200 rounded-full"></div>
                <div className="w-1.5 h-6 bg-indigo-300 rounded-full"></div>
                <div className="w-1.5 h-12 bg-indigo-600 rounded-full"></div>
                <div className="w-1.5 h-6 bg-indigo-400 rounded-full"></div>
                <div className="w-1.5 h-9 bg-indigo-500 rounded-full"></div>
              </div>
              <h4 className="text-2xl font-bold text-gray-900">100K+</h4>
              <p className="text-sm font-semibold text-gray-400 leading-tight">People got hired</p>
            </motion.div>

            {/* Testimonial Quote */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-16 -right-16 md:-right-28 bg-white p-8 rounded-2xl shadow-2xl z-30 border border-gray-50/50 max-w-sm"
            >
              <div className="flex items-center gap-4 mb-5">
                <img
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
                  alt="Adam Sandler"
                  className="w-14 h-14 rounded-full border-2 border-indigo-50 object-cover shadow-sm"
                />
                <div>
                  <h5 className="font-bold text-gray-900 text-lg">Adam Sandler</h5>
                  <p className="text-sm text-gray-400 font-medium tracking-wide">Lead Engineer at Canva</p>
                </div>
              </div>
              <div className="relative">
                <svg className="absolute -top-4 -left-3 w-8 h-8 text-indigo-100/50 rotate-180" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3L11.017 3V21H14.017ZM5.017 21L5.017 18C5.017 16.8954 5.91243 16 7.017 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H7.017C5.91243 8 5.017 7.10457 5.017 6V3L2.017 3V21H5.017Z" />
                </svg>
                <p className="relative z-10 text-gray-600 font-semibold leading-relaxed italic text-lg pr-4">
                  “Great platform for the job seeker that searching for new career heights.”
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center flex-1 px-6 py-12 lg:px-20 bg-white"
      >
        <div className="w-full max-w-md">
          {/* Role Switcher */}
          <div className="flex p-1 mb-10 bg-gray-100 rounded-lg w-fit mx-auto">
            <button
              onClick={() => setUserRole('Job Seeker')}
              className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${userRole === 'Job Seeker' ? 'bg-[#E0E7FF] text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Job Seeker
            </button>
            <button
              onClick={() => setUserRole('Company')}
              className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${userRole === 'Company' ? 'bg-[#E0E7FF] text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Company
            </button>
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back, Dude</h2>
          </div>

          {/* Google Social Login */}
          <button className="flex items-center justify-center w-full py-3.5 px-4 mb-8 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm group">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="font-bold text-blue-700 tracking-tight">Login with Google</span>
            </div>
          </button>

          {/* Divider */}
          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <span className="relative z-10 px-4 text-sm font-medium text-gray-400 bg-white">Or login with email</span>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-gray-700">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter email address"
                        className="py-6 px-4 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-gray-700">Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter password"
                        type={isPasswordVisible ? TEXT_TYPE : PASSWORD_TYPE}
                        className="py-6 px-4 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center">
                <Checkbox
                  id="remember"
                  className="w-5 h-5 border-gray-300 rounded focus:ring-blue-500 text-blue-600"
                  onCheckedChange={setRememberMe}
                  checked={rememberMe}
                />
                <Label htmlFor="remember" className="ml-3 text-sm font-medium text-gray-500 cursor-pointer">
                  Remember me
                </Label>
              </div>

              <Button
                loading={isLoading}
                className="w-full py-7 text-base font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 mt-2"
                type="submit"
              >
                Login
              </Button>

              <div className="text-center pt-2">
                <p className="text-sm font-medium text-gray-500">
                  Don't have an account?{" "}
                  <Link to={path.register} className="font-bold text-indigo-600 hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </motion.div >
    </div >
  );
};

export default LoginPage;
