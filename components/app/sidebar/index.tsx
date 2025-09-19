"use client";
import Link from "next/link";
import AppSidebarDesktop from "./sidebar-desktop";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { Button } from "@/components/atoms/button";
import { Menu, X } from "lucide-react";
import AppSidebarMobile from "./sidebar-mobile";
import { useState, useEffect } from "react";
import { OptimizedImage } from "@/components/atoms/optimized-image";

export default function AppSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [showAvatar, setShowAvatar] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  // Rotate between avatar and text every 4 seconds (only when not hovered)
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setShowAvatar(prev => !prev);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Change on hover
  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowAvatar(true); // Show avatar on hover
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Will resume auto-rotation after a longer delay
    setTimeout(() => {
      if (!isHovered) {
        setShowAvatar(false);
      }
    }, 2000);
  };

  return (
    <>
      <nav className="md:h-full md:max-w-[65px] w-full flex md:flex-col items-center justify-between bg-background border-b md:border-b-0 border-r py-3 md:py-4 px-5 md:px-0 md:overflow-y-auto">
        <div className="md:min-h-[60px] flex items-center justify-center pt-2">
          <div 
            className="relative w-12 h-12 group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Avatar Image */}
            <button 
              className={`absolute inset-0 cursor-pointer transition-all duration-700 ease-in-out ${
                showAvatar 
                  ? 'opacity-100 scale-100 rotate-0' 
                  : 'opacity-0 scale-75 rotate-12'
              }`}
              onClick={() => setIsImagePreviewOpen(true)}
            >
              <div className="w-full h-full overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                 <OptimizedImage
                   src="/avatar.png"
                   alt="Profile Photo"
                   width={150}
                   height={150}
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                 />
              </div>
            </button>

            {/* Text Logo */}
            <Link 
              href="/" 
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
                showAvatar 
                  ? 'opacity-0 scale-75 -rotate-12' 
                  : 'opacity-100 scale-100 rotate-0'
              }`}
            >
              <h1 className="select-none text-xl font-bold text-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300">
                AA.
              </h1>
            </Link>
          </div>
        </div>

        <div className="md:hidden flex items-center">
          {/* <ThemeToggle /> */}

          <Button size={"icon"} variant={"ghost"} onClick={toggleNavbar}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        <AppSidebarDesktop />
      </nav>

      <AppSidebarMobile isOpen={isOpen} toggleNavbar={toggleNavbar} />

      {/* Image Preview Modal */}
      {isImagePreviewOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setIsImagePreviewOpen(false)}
        >
          <div className="relative max-w-md max-h-[80vh] mx-4">
            <button
              onClick={() => setIsImagePreviewOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative rounded-lg overflow-hidden">
              <OptimizedImage
                src="/avatar.png"
                alt="Profile Photo Preview"
                width={400}
                height={400}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm font-medium">Profile Photo</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
