import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("🔵 Fetching product with id:", id);

        // Use full URL or proxy
        const res = await axios.get(`http://localhost:5000/api/product/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        console.log("✅ API Response:", res.data);

        setProduct(res.data);

        if (res.data.images && res.data.images.length > 0) {
          console.log("🖼️ Images array:", res.data.images);
          setMainImage(res.data.images[0]);
        } else {
          console.warn("⚠️ No images found for this product!");
        }
      } catch (err) {
        console.error("❌ Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (mainImage) console.log("✨ Main Image Updated:", mainImage);
  }, [mainImage]);

  if (!product)
    return (
      <div className="min-h-screen flex justify-center items-center text-white bg-gray-900">
        Loading product details...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white p-6 flex flex-col md:flex-row gap-10">
      {/* LEFT: Images */}
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-lg border border-gray-700 rounded-lg overflow-hidden">
          <img
            src={mainImage || "/images/default.png"}
            alt={product.title}
            className="w-full h-[400px] object-cover"
            onError={() =>
              console.error("🚨 Main image failed to load:", mainImage)
            }
          />
        </div>
        <div className="flex gap-3 mt-4 flex-wrap justify-center">
          {product.images && product.images.length > 0 ? (
            product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumbnail-${idx}`}
                className={`w-20 h-20 object-cover rounded-lg border cursor-pointer transition ${
                  mainImage === img ? "border-blue-500" : "border-gray-700"
                }`}
                onClick={() => {
                  console.log("👉 Thumbnail clicked:", img);
                  setMainImage(img);
                }}
                onError={() =>
                  console.error(`🚨 Thumbnail failed to load: ${img}`)
                }
              />
            ))
          ) : (
            <p className="text-gray-400">No other images</p>
          )}
        </div>
      </div>

      {/* RIGHT: Details */}
      <div className="flex-1 flex flex-col gap-6">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-2xl text-green-400 font-semibold">₹{product.price}</p>
        <p className="text-sm text-gray-300">
          {product.isNegotiable ? "✅ Price is negotiable" : "❌ Fixed price"}
        </p>
        <div>
          <h3 className="text-lg font-semibold mb-1">Description</h3>
          <p className="text-gray-300">{product.description}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">Location</h3>
          <p className="text-gray-300">{product.location}</p>
        </div>
        {product.category && (
          <div>
            <h3 className="text-lg font-semibold mb-1">Category</h3>
            <p className="text-gray-300">{product.category}</p>
          </div>
        )}
        <button
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition w-fit"
          onClick={() => alert("Chat with Seller UI only")}
        >
          💬 Chat with Seller
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
