import EnhancedDeviceInfo from "@/components/EnhancedDeviceInfo";
import ThemeToggle from "@/components/ThemeToggle";
import PWAManager from "@/components/PWAManager";
import { ComputerDesktopIcon } from "@heroicons/react/24/solid";

export default function Home() {
  return (
    <PWAManager>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <ComputerDesktopIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Enhanced Device Info
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Comprehensive system monitoring • PWA Ready
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
                  Real-time monitoring active
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EnhancedDeviceInfo />
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Enhanced Device Info App - Built with ❤️ by @sahinurdev
              </p>
              <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  v2.0 - PWA • Real-time Monitoring • Offline Ready
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PWAManager>
  );
}
