import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleChatPart = async () => {
    if (!user) return alert("You need to log in first!");
    if (!product || !product.owner)
      return console.error("Product or seller info missing!");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/chats/conversations",
        {
          senderId: user._id,
          receiverId: product.owner._id,
          product: product._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log(res)

      // Navigate to chat page with conversation ID
      navigate(`/chat`);
    } catch (error) {
      console.error("❌ Error starting chat:", error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/product/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setProduct(res.data);
        console.log(res);
        
        if (res.data.images?.length > 0) setMainImage(res.data.images[0]);
      } catch (err) {
        console.error("❌ Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product)
    return (
      <div className="min-h-screen flex justify-center items-center text-white bg-gray-900">
        Loading product details...
      </div>
    );

  // ✅ Determine if current user is the owner of the product
  const isOwner = user?._id === product.owner?._id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white p-6 flex flex-col md:flex-row gap-2">
      {/* Images */}
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-lg border border-gray-700 rounded-lg overflow-hidden">
          <img
            src={mainImage || "/images/default.png"}
            alt={product.title}
            className="w-full h-[400px] object-cover"
          />
        </div>
        <div className="flex gap-3 mt-4 flex-wrap justify-center">
          {product.images?.length > 0 ? (
            product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumbnail-${idx}`}
                className={`w-20 h-20 object-cover rounded-lg border cursor-pointer transition ${
                  mainImage === img ? "border-blue-500" : "border-gray-700"
                }`}
                onClick={() => setMainImage(img)}
              />
            ))
          ) : (
            <p className="text-gray-400">No other images</p>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col gap-6">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-2xl text-green-400 font-semibold">₹{product.price}</p>
        <div className="border-2 w-fit py-1 px-2 rounded-full">
          <p
            className={`text-sm ${
              product.isNegotiable ? "text-green-500" : "text-red-400"
            }`}
          >
            {product.isNegotiable ? "Negotiable" : "Non Negotiable"}
          </p>
        </div>

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

        {/* ✅ Show Chat button only if the viewer is not the owner */}
        {!isOwner && (
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition w-fit"
            onClick={handleChatPart}
          >
            💬 Chat with Seller
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
