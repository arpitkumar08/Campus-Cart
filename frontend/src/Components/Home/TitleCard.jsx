import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { MoreVertical } from "lucide-react"; // 1. IMPORTED

const springValues = { damping: 30, stiffness: 120, mass: 1.5 };

export default function TiltedCard({
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
  productId, // 2. ADDED PROP
  onReportClick, // 3. ADDED PROP
}) {
  const ref = useRef(null);

  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const rotateFigcaption = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });
  const [lastY, setLastY] = useState(0);

  // --- 4. ADDED MENU LOGIC ---
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
    e.stopPropagation(); // Prevents card's onClick
    e.preventDefault();
    setIsMenuOpen((prev) => !prev);
  };

  const handleReport = (e) => {
    e.stopPropagation(); // Prevents card's onClick
    e.preventDefault();
    if (onReportClick) {
      onReportClick(productId); // Call parent handler
    }
    setIsMenuOpen(false); // Close menu
  };
  // --- END OF ADDED LOGIC ---

  return (
    <figure
      ref={ref}
      onClick={() => {
        console.log("Card clicked:", altText);
        onClick();
      }}
      className="relative [perspective:800px] flex flex-col items-center cursor-pointer justify-center"
      style={{ height: containerHeight, width: containerWidth }}
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden text-gray-300">
          This effect is not optimized for mobile.
        </div>
      )}

      <motion.div
        className="relative [transform-style:preserve-3d] rounded-xl shadow-lg overflow-hidden"
        style={{ width: imageWidth, height: imageHeight, rotateX, rotateY, scale }}
      >
        <motion.img
          src={imageSrc}
          alt={altText}
          className="absolute top-0 left-0 object-cover w-full h-full"
        />

        {isSold && (
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 bg-black/70 text-white text-center font-bold py-2 z-20 rounded-lg">
            SOLD
          </div>
        )}

        {displayOverlayContent && overlayContent && (
          <motion.div
            className="absolute top-0 left-0 z-10 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {/* --- 5. ADDED MENU RENDER --- */}
      {onReportClick && (
        <div
          className="absolute bottom-3 right-2 z-30" // Positioned on card
          ref={menuRef}
        >
          <div
            className="bg-slate-800 backdrop-blur-sm rounded-full p-1 cursor-pointer"
            onClick={handleMenuClick}
          >
            <MoreVertical className="w-5 h-5 text-white" />
          </div>
          {isMenuOpen && (
            <div
              className="absolute bottom-full right-0 mb-2 z-40 bg-slate-900 shadow-lg rounded-md p-2 w-40 border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleReport}
                className="w-full text-left hover:text-red-600 text-gray-200 px-2 py-1 rounded-md"
              >
                Report Product
              </button>
            </div>
          )}
        </div>
      )}
      {/* --- END OF ADDED MENU --- */}

      {children}
    </figure>
  );
}