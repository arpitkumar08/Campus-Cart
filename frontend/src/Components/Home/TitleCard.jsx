import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { MoreVertical } from "lucide-react";

const springValues = { damping: 30, stiffness: 120, mass: 1.5 };

const TiltedCard = ({
  imageSrc,
  altText = "Tilted card image",
  containerHeight = "280px",
  containerWidth = "200px",
  imageHeight = "260px",
  imageWidth = "200px",
  scaleOnHover = 1.05,
  rotateAmplitude = 10,
  showMobileWarning = true,
  displayOverlayContent = false,
  overlayContent = null,
  onClick = () => {},
  isSold = false,
  children,
  productId,
  onReportClick,
}) => {
  const ref = useRef(null);

  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsMenuOpen((prev) => !prev);
  };

  const handleReport = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onReportClick) onReportClick(productId);
    setIsMenuOpen(false);
  };

  return (
    // <figure
    //   ref={ref}
    //   onClick={onClick}
    //   className="relative [perspective:800px] flex flex-col items-center cursor-pointer justify-center"
    //   style={{ height: containerHeight, width: containerWidth }}
    // >
    <figure
      ref={ref}
      onClick={(e) => {
        if (typeof onClick === "function") onClick(e);
      }}
      className="relative [perspective:800px] flex flex-col items-center cursor-pointer justify-center"
      style={{ height: containerHeight, width: containerWidth }}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden text-gray-300">
          This effect is not optimized for mobile.
        </div>
      )}

      <div
        className="relative"
        style={{ width: imageWidth, height: imageHeight }}
      >
        {/* Tilted 3D image container */}
        <motion.div
          className="[transform-style:preserve-3d] rounded-xl shadow-lg overflow-hidden z-0"
          style={{ width: "100%", height: "100%", rotateX, rotateY, scale }}
        >
          <motion.img
            src={imageSrc}
            alt={altText}
            className="absolute top-0 left-0 object-cover w-full h-full z-0"
          />

          {isSold && (
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 bg-black/70 text-white text-center font-bold py-2 z-20 rounded-lg">
              SOLD
            </div>
          )}
        </motion.div>

        {/* Move overlay ABOVE the 3D transform container */}
        {displayOverlayContent && overlayContent && (
          <div className="absolute inset-0 z-40 pointer-events-auto">
            {overlayContent}
          </div>
        )}
      </div>

      {/* Report Menu - placed above tilt container */}
      {onReportClick && (
        <div
          className="absolute bottom-3 right-2 z-50 pointer-events-auto"
          ref={menuRef}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          {/* Menu trigger button */}
          <div
            className="bg-slate-800 backdrop-blur-sm rounded-full p-1 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleMenuClick(e);
            }}
          >
            <MoreVertical className="w-5 h-5 text-white" />
          </div>

          {/* Dropdown menu */}
          {isMenuOpen && (
            <div
              className="absolute bottom-full right-0 mb-2 z-50 bg-slate-900 shadow-lg rounded-md p-2 w-40 border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleReport(e);
                }}
                className="w-full text-left hover:text-red-600 text-gray-200 px-2 py-1 rounded-md"
              >
                Report Product
              </button>
            </div>
          )}
        </div>
      )}

      {children}
    </figure>
  );
};

export default React.memo(TiltedCard);
