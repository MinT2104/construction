"use client";

import { FC, Suspense } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";

// Placeholder for a logo - replace with your actual logo component or URL
const Logo = () => (
  <div className="flex justify-center items-center">
    {/* If using an SVG or Image component */}
    {/* <Image src="/path-to-your-logo.svg" alt="Logo" width={150} height={50} /> */}
    <Image
      src="/images/logo.png"
      alt="Logo"
      width={70}
      height={70}
      className="rounded-lg object-cover"
    />
  </div>
);

const LoginPageView: FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await login(formData.username, formData.password);
      if (data.success) {
        const from = searchParams.get("from") || "/admin/bai-viet";
        router.push(from);
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense fallback={null}>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl lg:grid lg:grid-cols-2 shadow-xl rounded-lg overflow-hidden bg-white">
          {/* Left Side - Visual/Branding */}
          <div className="hidden lg:flex flex-col justify-center items-center p-12 border-r border-gray-200">
            <Image
              src="/images/login_image.avif" // Replace with a relevant image
              alt="Hình ảnh Đăng nhập"
              width={400} // Adjusted size
              height={400} // Adjusted size
              className="rounded-lg object-cover mb-8"
            />
            <h2 className="text-2xl font-semibold text-gray-700 text-center">
              Chào mừng trở lại!
            </h2>
            <p className="mt-2 text-gray-500 text-center max-w-xs">
              Truy cập bảng điều khiển quản trị của bạn một cách an toàn.
            </p>
          </div>

          {/* Right Side - Login Form */}
          <div className="py-12 px-8 sm:px-12 flex flex-col justify-center">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <Logo />
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Đăng nhập quản trị
                </h1>
                <p className="text-gray-600">Vui lòng đăng nhập để tiếp tục</p>
              </div>
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tên đăng nhập
                  </label>
                  <div className="mt-1">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                      placeholder="Tên đăng nhập của bạn"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mật khẩu
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                               bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out
                               ${
                                 isLoading
                                   ? "opacity-75 cursor-not-allowed"
                                   : "hover:shadow-lg"
                               }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang xử lý...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <LogIn className="w-5 h-5 mr-2" />
                        Đăng nhập
                      </div>
                    )}
                  </button>
                </div>
              </form>
              <p className="mt-10 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Kien Tao Nha Dep. Bảo lưu mọi
                quyền.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default LoginPageView;
