import DeviceInfo from "@/components/DeviceInfo";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <h1 className="text-center text-3xl font-bold">Your Device Info</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 bg-gray-100">
        <DeviceInfo />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <p className="text-center">&copy; {new Date().getFullYear()} Your Device Info</p>
      </footer>
    </div>
  );
}
