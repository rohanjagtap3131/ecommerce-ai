import { useState, useEffect } from "react";

import image1 from "../../assest/banner/img1.webp";
import image2 from "../../assest/banner/img2.webp";
import image3 from "../../assest/banner/img3.jpg";
import image4 from "../../assest/banner/img4.jpg";
import image5 from "../../assest/banner/img5.webp";

import image1Mobile from "../../assest/banner/img1_mobile.jpg";
import image2Mobile from "../../assest/banner/img2_mobile.webp";
import image3Mobile from "../../assest/banner/img3_mobile.jpg";
import image4Mobile from "../../assest/banner/img4_mobile.jpg";
import image5Mobile from "../../assest/banner/img5_mobile.png";

export default function BannerProduct() {
  const desktopImages = [image1, image2, image3, image4, image5];
  const mobileImages = [
    image1Mobile,
    image2Mobile,
    image3Mobile,
    image4Mobile,
    image5Mobile,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Change slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === (isMobile ? mobileImages.length - 1 : desktopImages.length - 1)
          ? 0
          : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isMobile]);

  // Listen for screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const images = isMobile ? mobileImages : desktopImages;

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="relative h-60 md:h-72 w-full overflow-hidden rounded-2xl shadow-lg bg-gray-100">
        {/* Sliding Images */}
        <div
          className="flex h-full w-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((el, index) => (
            <div
              key={index}
              className="w-full h-full min-w-full flex-shrink-0"
            >
              <img
                src={el}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === index ? "bg-white" : "bg-white/50"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}
