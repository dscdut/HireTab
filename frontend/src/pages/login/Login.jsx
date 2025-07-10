"use client"

import { IconEye, IconNonEye } from "@/assets/icons"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PASSWORD_TYPE, ROLE_ADMIN, ROLE_EMPLOYEE, TEXT_TYPE } from "@/core/configs/consts"
import { path } from "@/core/constants/path"
import { mutationKeys } from "@/core/helpers/key-tanstack"
import { authApi } from "@/core/services/auth.service"
import {
  setAccessTokenToLS,
  setRefreshTokenToLS,
  setUserToLS,
  getAccessTokenFromLS,
  getUserFromLocalStorage,
} from "@/core/shared/storage"
import { LoginSchema } from "@/core/zod/login.zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { isEqual } from "lodash"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import Logo from "@/components/landing/Logo"

export const REMEMBER_ME = "LOCAL_STORAGE_REMEMBER_ME"

// Google OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.REACT_APP_GOOGLE_CLIENT_ID || "your-google-client-id"

export default function Login() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [rememberMe, setRememberMe] = useState(localStorage.getItem(REMEMBER_ME) === "true" ? true : false)

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const mutationLogin = useMutation({
    mutationKey: mutationKeys.login,
    mutationFn: (data) => authApi.login(data),
  })

  const mutationGoogleLogin = useMutation({
    mutationKey: [...mutationKeys.login, "google"],
    mutationFn: (googleToken) => authApi.googleLogin({ token: googleToken }),
  })

  function onSubmit() {
    setIsLoading(true)
    const loginData = form.getValues()

    mutationLogin.mutate(loginData, {
      onSuccess: ({ access_token, refresh_token, user }) => {
        handleLoginSuccess(access_token, refresh_token, user)
      },
      onError: () => {
        toast.error("Login failed!")
      },
      onSettled: () => {
        setIsLoading(false)
      },
    })
  }

  const handleLoginSuccess = (access_token, refresh_token, user) => {
    setAccessTokenToLS(access_token)
    setRefreshTokenToLS(refresh_token)
    setUserToLS(user)

    if (rememberMe) {
      localStorage.setItem("email", user.email)
    }

    navigate(
      isEqual(user.roles[0], ROLE_ADMIN) || isEqual(user.roles[0], ROLE_EMPLOYEE)
        ? path.hr.job_posting
        : path.candidate.job,
    )
    toast.success("Login success 🚀🚀⚡⚡!")
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)

    try {
      // Initialize Google OAuth
      if (!window.google) {
        toast.error("Google OAuth not loaded. Please refresh the page.")
        return
      }

      window.google.accounts.oauth2
        .initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "email profile",
          callback: (response) => {
            if (response.access_token) {
              // Send the token to your backend
              mutationGoogleLogin.mutate(response.access_token, {
                onSuccess: ({ access_token, refresh_token, user }) => {
                  handleLoginSuccess(access_token, refresh_token, user)
                },
                onError: (error) => {
                  console.error("Google login error:", error)
                  toast.error("Google login failed!")
                },
                onSettled: () => {
                  setIsGoogleLoading(false)
                },
              })
            } else {
              toast.error("Google login cancelled")
              setIsGoogleLoading(false)
            }
          },
        })
        .requestAccessToken()
    } catch (error) {
      console.error("Google login error:", error)
      toast.error("Google login failed!")
      setIsGoogleLoading(false)
    }
  }

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible)

  const handleChangeRememberMe = (event) => {
    setRememberMe(event)
    localStorage.setItem(REMEMBER_ME, JSON.stringify(event))
  }

  useEffect(() => {
    // Load Google OAuth script
    const loadGoogleScript = () => {
      if (!document.getElementById("google-oauth-script")) {
        const script = document.createElement("script")
        script.id = "google-oauth-script"
        script.src = "https://accounts.google.com/gsi/client"
        script.async = true
        script.defer = true
        document.head.appendChild(script)
      }
    }

    loadGoogleScript()

    if (rememberMe) {
      const email = localStorage.getItem("email")
      if (email) {
        form.setValue("email", email)
      }
    }

    const accessToken = getAccessTokenFromLS()
    const user = getUserFromLocalStorage()

    if (accessToken && user) {
      navigate(
        user.roles.includes("ROLE_ADMIN") || user.roles.includes("ROLE_EMPLOYEE")
          ? path.hr.job_posting
          : path.candidate.job,
      )
    }
  }, [form, rememberMe, navigate])

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center flex-1 px-4 sm:px-6 lg:px-8"
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Logo className="mx-auto mb-8" />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold text-gray-900"
            >
              Welcome Back!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-2 text-sm text-gray-600"
            >
              Log in to continue with HireTab
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    onChange={(e) => handleChangeRememberMe(e.target.checked)}
                    checked={rememberMe}
                  />
                  <Label htmlFor="remember" className="ml-2 text-sm text-gray-600 cursor-pointer">
                    Remember me
                  </Label>
                </div>

                <Link to={path.forgotPassword} className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>

              <Button
                loading={isLoading}
                className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                type="submit"
              >
                Log In
              </Button>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="relative"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Or</span>
                </div>
              </motion.div>

              {/* Google Login Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-center space-x-3"
                >
                  {isGoogleLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
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
              </div>
            </motion.form>
          </Form>
        </div>
      </motion.div>

      {/* Right Side - Image */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:block lg:w-1/2"
      >
        <div className="relative h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/20" />
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            alt="Login"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-lg p-8 text-center text-white">
              <h2 className="mb-4 text-4xl font-bold">Smart Talent Search</h2>
              <p className="text-lg">
                Use AI to screen resumes and find the most suitable candidates for your business
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
