'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { isEqual } from 'lodash';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/landing/Logo';
import { IconEye, IconNonEye } from '@/assets/icons';
import { PASSWORD_TYPE, ROLE_ADMIN, ROLE_EMPLOYEE, TEXT_TYPE } from '@/core/configs/consts';
import { path } from '@/core/constants/path';
import { mutationKeys } from '@/core/helpers/key-tanstack';
import { authApi } from '@/core/services/auth.service';
import {
  setAccessTokenToLS,
  setRefreshTokenToLS,
  setUserToLS,
  getAccessTokenFromLS,
  getUserFromLocalStorage,
} from '@/core/shared/storage';
import { LoginSchema } from '@/core/zod/login.zod';
import { useAppMutation } from '@/hooks/useAppMutation';
import HireTabLogo from '@/assets/images/hiretab-logo.png'

// Constants
export const REMEMBER_ME = 'LOCAL_STORAGE_REMEMBER_ME';

// Animated Counter Component
const AnimatedCounter = ({ target, suffix = '', label, delay = 0, formatter }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasStarted(true);
      let current = 0;
      const increment = target / 50; 
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 30); // Update every 30ms

      return () => clearInterval(timer);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [target, delay]);

  const displayValue = formatter ? formatter(count) : count.toString();

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <motion.div 
        className="text-xl font-bold sm:text-2xl"
        animate={hasStarted ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3, delay: delay + 1.5 }}
      >
        {displayValue}{suffix}
      </motion.div>
      <div className="text-xs text-blue-100">{label}</div>
    </motion.div>
  );
};

/**
 * LoginPage Component
 * Handles user authentication with email/password and Google OAuth
 * 
 * @returns {React.Component} Login form with authentication options
 */
const LoginPage = () => {
  // Hooks
  const navigate = useNavigate();
  
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem(REMEMBER_ME) === 'true'
  );

  // Form configuration
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // API mutations
  const mutationLogin = useAppMutation({
    mutationKey: mutationKeys.login,
    mutationFn: authApi.login,
  });

  // Event handlers
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

    const targetPath = isEqual(user.roles[0], ROLE_ADMIN) || isEqual(user.roles[0], ROLE_EMPLOYEE)
      ? path.hr.job_posting
      : path.candidate.job;
    
    navigate(targetPath);
    toast.success('Login success 🚀🚀⚡⚡!');
  }, [navigate, rememberMe]);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible(prev => !prev);
  }, []);

  const handleChangeRememberMe = useCallback((checked) => {
    setRememberMe(checked);
    localStorage.setItem(REMEMBER_ME, JSON.stringify(checked));
  }, []);

  /**
   * Deprecated Google OAuth handler
   * @deprecated Google OAuth login is being phased out and will be removed in a future release.
   * This handler keeps the UI functional while providing a clear deprecation message.
  const handleGoogleLogin = useCallback(() => {
    setIsGoogleLoading(true);

    // Keep this short and informative. Remove in next major release.
    setTimeout(() => {
      setIsGoogleLoading(false);
      toast.info('Google login is deprecated and temporarily unavailable.');
    }, 500);
  }, []);
    */


  // Effects
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
      const targetPath = user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_EMPLOYEE')
        ? path.hr.job_posting
        : path.candidate.job;
      
      navigate(targetPath);
    }
  }, [form, rememberMe, navigate]);

  return (
    // Prevent horizontal page scroll caused by absolute decorative elements
    <div className="flex min-h-screen overflow-x-hidden bg-gray-50">
      {/* Left Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center flex-1 px-4 overflow-hidden sm:px-6 lg:px-8 xl:flex-none xl:w-1/2"
      >
        <div className="w-full max-w-md mb-16 sm:mb-24 lg:mb-32">
          <div className="flex flex-col items-center justify-center text-center">
              <img src={HireTabLogo} alt="HireTab logo" className="object-contain w-32 h-32 sm:w-40 sm:h-40" />

            {/* <Logo className="mx-auto mb-8" /> */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl font-bold text-gray-900 sm:text-3xl"
            >
              Welcome Back!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-2 text-base text-gray-600 sm:text-lg"
            >
              Log in to continue with HireTab Admin Panel
            </motion.p>
          </div>

          <Form {...form}>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-gray-700 md:text-lg">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg md:text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      <FormLabel className="text-base font-medium text-gray-700 md:text-lg">Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your password"
                          className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg md:text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          type={isPasswordVisible ? TEXT_TYPE : PASSWORD_TYPE}
                          {...field}
                          icon={isPasswordVisible ? <IconNonEye /> : <IconEye />}
                          iconOnClick={togglePasswordVisibility}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    id="remember"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    onCheckedChange={(checked) => handleChangeRememberMe(checked)}
                    checked={rememberMe}
                  />
                  <Label htmlFor="remember" className="ml-3 text-sm text-gray-700 cursor-pointer md:text-base">
                    Remember me
                  </Label>
                </div>

                {/* <Link to={path.forgotPassword} className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link> */}
              </div>

              <Button
                loading={isLoading}
                className="w-full py-2 text-base font-semibold text-white bg-blue-600 rounded-lg md:py-3 md:text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                type="submit"
              >
                Log In
              </Button>

              {/* Divider */}
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="relative"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-gray-500 bg-gray-50">Or</span>
                </div>
              </motion.div> */}

              {/* Google Login Button */}
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className="flex items-center justify-center w-full px-4 py-3 space-x-3 text-gray-700 transition-all duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {isGoogleLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full border-t-blue-600 animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  <span className="font-medium">{isGoogleLoading ? "Signing in..." : "Continue with Google"}</span>
                </Button>
              </motion.div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link to={path.register} className="font-medium text-blue-600 hover:text-blue-500">
                    Sign up now
                  </Link>
                </p>
              </div> */}
            </motion.form>
          </Form>
        </div>
      </motion.div>

      {/* Right Side - Educational Content */}
<motion.div
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5 }}
  className="hidden xl:flex xl:w-1/2"
>
  <div className="relative flex flex-col justify-center w-full h-full p-4 sm:p-6 lg:p-8">
    {/* Background Image */}
    <div className="absolute inset-0">
      <img 
        src="https://images.pexels.com/photos/3178818/pexels-photo-3178818.jpeg"
        alt="Modern office workspace"
        className="object-cover w-full h-full"
      />
      {/* Enhanced Image Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/90"></div>
    </div>
    
    {/* Main Content */}
    <div className="relative z-10 max-w-sm mx-auto sm:max-w-md lg:max-w-lg">
      {/* Header - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 text-center"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-blue-100 border rounded-full shadow-lg bg-blue-600/20 backdrop-blur-sm border-blue-400/30"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-4 h-4 mr-2"
          >
            ⚡
          </motion.div>
          HireTab Dashboard
        </motion.div>
        <h2 className="mb-4 text-3xl font-bold text-white xl:text-4xl bg-gradient-to-r from-white to-blue-100 bg-clip-text">
          Admin Panel
        </h2>
        <p className="font-medium text-slate-300">
          Manage your hiring process with ease
        </p>
      </motion.div>

      {/* Animated Feature Icons Grid - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        {/* Analytics */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5, y: -5 }}
          className="flex flex-col items-center p-4 transition-all duration-300 shadow-xl group bg-white/95 backdrop-blur-sm rounded-xl hover:shadow-blue-500/25"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            className="flex items-center justify-center w-12 h-12 mb-3 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600"
          >
            <span className="text-xl">📊</span>
          </motion.div>
          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">Analytics</h3>
          <p className="text-xs text-center text-gray-500 group-hover:text-gray-700">Real-time insights</p>
        </motion.div>

        {/* Candidates */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: -5, y: -5 }}
          className="flex flex-col items-center p-4 transition-all duration-300 shadow-xl group bg-white/95 backdrop-blur-sm rounded-xl hover:shadow-emerald-500/25"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="flex items-center justify-center w-12 h-12 mb-3 rounded-lg shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600"
          >
            <span className="text-xl">👥</span>
          </motion.div>
          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">Candidates</h3>
          <p className="text-xs text-center text-gray-500 group-hover:text-gray-700">Smart management</p>
        </motion.div>

        {/* Jobs */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5, y: -5 }}
          className="flex flex-col items-center p-4 transition-all duration-300 shadow-xl group bg-white/95 backdrop-blur-sm rounded-xl hover:shadow-purple-500/25"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="flex items-center justify-center w-12 h-12 mb-3 rounded-lg shadow-lg bg-gradient-to-r from-purple-500 to-pink-600"
          >
            <span className="text-xl">💼</span>
          </motion.div>
          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">Job Posts</h3>
          <p className="text-xs text-center text-gray-500 group-hover:text-gray-700">Quick publishing</p>
        </motion.div>
      </motion.div>

      {/* Enhanced Animated Counter Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="relative p-6 overflow-hidden text-white rounded-xl"
      >
        {/* Enhanced background animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
          animate={{ 
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ backgroundSize: "200% 200%" }}
        />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative z-10">
          <motion.h3
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-4 text-lg font-semibold text-center"
          >
            Platform Statistics
          </motion.h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <AnimatedCounter 
              target={500} 
              suffix="+" 
              label="Active Jobs" 
              delay={0.8}
            />
            <AnimatedCounter 
              target={1200} 
              suffix="+" 
              label="Total Users" 
              delay={1.0}
              formatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}K` : val.toString()}
            />
            <AnimatedCounter 
              target={98} 
              suffix="%" 
              label="Success Rate" 
              delay={1.2}
            />
          </div>
        </div>

        {/* Floating particles */}
        <motion.div
          className="absolute w-2 h-2 rounded-full top-4 right-4 bg-white/30"
          animate={{ y: [0, -10, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-white/20 rounded-full"
          animate={{ y: [0, -8, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        />
      </motion.div>
    </div>
  </div>
</motion.div>
    </div>
  )
}

export default LoginPage