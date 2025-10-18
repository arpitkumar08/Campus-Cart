import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { MoreVertical } from "lucide-react";
import ReportProductModal from "../Modals/ReportProductModal";

const springValues = { damping: 30, stiffness: 120, mass: 1.5 };

export default function TiltedCard({
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "280px",
  containerWidth = "200px",
  imageHeight = "260px",
  imageWidth = "200px",
  scaleOnHover = 1.05,
  rotateAmplitude = 10,
  showMobileWarning = true,
  displayOverlayContent = false,
  overlayContent = null,
  productId,
  onClick = () => {},
  isSold = false, // ✅ new prop
}) {
  const ref = useRef(null);
  const menuRef = useRef(null);

  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const rotateFigcaption = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });
  const [lastY, setLastY] = useState(0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !ref.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tilt logic
  function handleMouse(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
    rotateFigcaption.set(-(offsetY - lastY) * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
    scale.set(1);
  }

  return (
    <>
      <figure
        ref={ref}
        onClick={onClick}
        className="relative [perspective:800px] flex flex-col items-center cursor-pointer justify-center"
        style={{ height: containerHeight, width: containerWidth }}
        onMouseMove={handleMouse}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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

          {/* ✅ SOLD banner */}
          {isSold && (
            <div className="absolute top-[45%] left-0 w-full bg-gray-950/90 text-white text-center font-bold py-1 z-20">
              SOLD
            </div>
          )}

          {/* 3 dots menu icon (optional) */}
          {/* <div
            className="absolute bottom-2 right-2 z-20 bg-slate-800 backdrop-blur-sm rounded-full p-1 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            <MoreVertical className="w-5 h-5 text-white" />
          </div> */}

          {/* Dropdown menu */}
          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute bottom-10 right-2 z-30 bg-slate-900 shadow-lg rounded-md p-2 w-40 border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full text-left hover:text-red-600 text-gray-200 px-2 py-1 rounded-md"
              >
                Report Product
              </button>
            </div>
          )}

          {/* Overlay content */}
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
      </figure>

      {/* ✅ Report Modal */}
      <ReportProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId} // ✅ pass it here
      />
    </>
  );
}
