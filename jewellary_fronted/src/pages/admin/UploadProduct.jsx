import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { productSchema } from '../../validation/YupSchema';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { uploadProduct } from '../../features/admin/productSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const jewelleryCategories = {
  rings: [
    'Engagement Rings',
    'Wedding Bands',
    'Solitaire Rings',
    'Cocktail Rings',
    'Adjustable Rings',
    'Toe Rings',
    'Gemstone Rings',
    'Plain Bands',
    'Promise Rings',
    'Birthstone Rings'
  ],
  necklaces: [
    'Statement Necklaces',
    'Choker Necklaces',
    'Long Necklaces',
    'Collar Necklaces',
    'Layered Necklaces',
    'Locket Necklaces',
    'Gemstone Necklaces',
    'Pearl Necklaces',
    'Chain Necklaces'
  ],
  earrings: [
    'Stud Earrings',
    'Hoop Earrings',
    'Drop Earrings',
    'Dangle Earrings',
    'Jhumkas',
    'Ear Cuffs',
    'Chandbalis',
    'Clip-On Earrings',
    'Huggie Earrings'
  ],
  bracelets: [
    'Cuff Bracelets',
    'Charm Bracelets',
    'Bangle Bracelets',
    'Chain Bracelets',
    'Beaded Bracelets',
    'Tennis Bracelets',
    'Kada Bracelets',
    'Adjustable Bracelets'
  ],
  bangles: [
    'Traditional Bangles',
    'Gold Bangles',
    'Glass Bangles',
    'Stone Studded Bangles',
    'Bridal Bangles',
    'Daily Wear Bangles',
    'Designer Bangles',
    'Kada Sets'
  ],
  mangalsutra: [
    'Traditional Mangalsutra',
    'Daily Wear Mangalsutra',
    'Modern Mangalsutra',
    'Double Chain Mangalsutra',
    'Pendant Style Mangalsutra',
    'Beaded Mangalsutra',
    'Short Mangalsutra'
  ],
  anklets: [
    'Single Chain Anklets',
    'Double Chain Anklets',
    'Beaded Anklets',
    'Silver Anklets',
    'Gold Anklets',
    'Bridal Anklets',
    'Charm Anklets',
    'Toe Ring Attached Anklets'
  ],
  nosepins: [
    'Stud Nosepins',
    'Hoop Nosepins',
    'Nath (with chain)',
    'Clip-on Nosepins',
    'Diamond Nosepins',
    'Gold Nosepins',
    'Designer Nosepins'
  ],
  pendants: [
    'Religious Pendants',
    'Alphabet Pendants',
    'Heart Pendants',
    'Gemstone Pendants',
    'Gold Pendants',
    'Name Pendants',
    'Lockets',
    'Zodiac Pendants'
  ],
  chains: [
    'Box Chains',
    'Rope Chains',
    'Curb Chains',
    'Figaro Chains',
    'Snake Chains',
    'Cable Chains',
    'Layered Chains',
    'Thin/Thick Chains'
  ],
  watches: [
    'Analog Watches',
    'Digital Watches',
    'Smart Watches',
    'Bracelet Watches',
    'Chain Watches',
    'Leather Strap Watches',
    'Couple Watches',
    'Luxury Watches',
    'Casual Watches'
  ],
  other: [
    'jewellery Sets',
    'Hair Accessories',
    'Waist Chains (Kamarbandh)',
    'Armlets (Bajubandh)',
    'Brooches',
    'Tiara/Crowns',
    'jewellery Boxes',
    'Custom/Name jewellery'
  ]
};

const materials = ['gold', 'silver', 'platinum', 'diamond', 'pearl', 'gemstone', 'ruby', 'titanium', 'other'];
const purityOptions = ['14k', '18k', '22k', '24k', '925', '950', '990', '999'];
const genders = ['Men', 'Women', 'Unisex', 'Kids'];
const occasions = ['Wedding', 'Engagement', 'Festive', 'Party', 'Daily Wear', 'Gift', 'Office'];

const UploadProduct = () => {
  const navigate = useNavigate();
  const [previewImages, setPreviewImages] = useState([]);
  const [previewDefaultImage, setPreviewDefaultImage] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [subcategories, setSubcategories] = useState([]);
  const [showPurityField, setShowPurityField] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    reset,
    formState: { errors } 
  } = useForm({
  resolver: yupResolver(productSchema),
  defaultValues: {
    isReturnable: false,
    gender: 'Women',
    material: 'gold',
    minQuantity: 1,
    additionalImages: []
  }
  });

  const dispatch = useDispatch();
  const watchMrp = watch('mrp');
  const watchSellingPrice = watch('sellingPrice');
  const watchIsReturnable = watch('isReturnable');
  const watchCategory = watch('category');
  const watchMaterial = watch('material');
  const watchAdditionalImages = watch('additionalImages');

  useEffect(() => {
    if (watchMrp && watchSellingPrice && watchSellingPrice < watchMrp) {
      const discount = ((watchMrp - watchSellingPrice) / watchMrp) * 100;
      setDiscountPercentage(Math.round(discount));
    } else {
      setDiscountPercentage(0);
    }
  }, [watchMrp, watchSellingPrice]);

  useEffect(() => {
    if (watchCategory && jewelleryCategories[watchCategory]) {
      setSubcategories(jewelleryCategories[watchCategory]);
      setValue('subcategory', '');
    } else {
      setSubcategories([]);
    }
  }, [watchCategory, setValue]);

  useEffect(() => {
    setShowPurityField(['gold', 'silver', 'platinum'].includes(watchMaterial));
    if (!['gold', 'silver', 'platinum'].includes(watchMaterial)) {
      setValue('purity', '');
    }
  }, [watchMaterial, setValue]);

  const handleDefaultImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('defaultImage', file);
      setPreviewDefaultImage(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const currentImages = watchAdditionalImages || [];
    
    if (currentImages.length + files.length > 5) {
      alert('You can upload a maximum of 5 additional images');
      return;
    }

    if (files.length > 0) {
      setValue('additionalImages', [...currentImages, ...files], { shouldValidate: true });
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviews]);
    }
  };

  const removeDefaultImage = () => {
    setValue('defaultImage', null);
    setPreviewDefaultImage(null);
  };

  const removeAdditionalImage = (index) => {
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
    
    const currentFiles = watchAdditionalImages || [];
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    setValue('additionalImages', updatedFiles, { shouldValidate: true });
  };

  const resetForm = () => {
    reset({
      isReturnable: false,
      gender: 'Women',
      material: 'gold',
      minQuantity: 1,
      additionalImages: []
    });
    setPreviewImages([]);
    setPreviewDefaultImage(null);
    setDiscountPercentage(0);
    setSubcategories([]);
    setShowPurityField(false);
  };

 const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      formData.append('name', data.productName);
      formData.append('description', data.description);
      formData.append('mrp', data.mrp);
      formData.append('sellingPrice', data.sellingPrice);
      formData.append('discount', discountPercentage);
      formData.append('category', data.category);
      formData.append('subCategory', data.subcategory);
      formData.append('material', data.material);
      formData.append('purity', data.purity);
      formData.append('weight', data.weight);
      formData.append('stock', data.stock);
      formData.append('gender', data.gender);
      formData.append('occasion', data.occasion);
      formData.append('warrantyInMonths', data.warrantyInMonths);
      formData.append('isReturnable', data.isReturnable);
      formData.append('returnPolicyDays', data.returnPolicyDays);

      if (data.defaultImage) {
        formData.append('defaultImage', data.defaultImage);
      }

      if (data.additionalImages && data.additionalImages.length > 0) {
        Array.from(data.additionalImages).forEach((img) => {
          formData.append('images', img);
        });
      }

      await dispatch(uploadProduct(formData)).unwrap();
      
        toast.success('Product successfully created!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        resetForm();
        navigate('/admin/product-list');
      } catch (error) {
        toast.error(error.message || 'Failed to create product. Please try again.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error("Product creation error:", error);
      } finally {
        setIsSubmitting(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 ml-0">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Upload Product</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="productName"
                    type="text"
                    {...register('productName')}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 ${
                      errors.productName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.productName && (
                    <p className="mt-1 text-sm text-red-500">{errors.productName.message}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    {...register('description')}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    {...register('category')}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {Object.keys(jewelleryCategories).map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
                  )}
                </div>

                {subcategories.length > 0 && (
                  <div className="mb-4">
                    <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategory
                    </label>
                    <select
                      id="subcategory"
                      {...register('subcategory')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700"
                    >
                      <option value="">Select a subcategory</option>
                      {subcategories.map((subcategory) => (
                        <option key={subcategory} value={subcategory}>
                          {subcategory}
                        </option>
                      ))}
                    </select>
                    {errors.subcategory && (
                      <p className="mt-1 text-sm text-red-500">{errors.subcategory.message}</p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="mrp" className="block text-sm font-medium text-gray-700 mb-1">
                      MRP (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₹</span>
                      </div>
                      <input
                        id="mrp"
                        type="number"
                        step="0.01"
                        {...register('mrp')}
                        className={`block w-full pl-7 pr-12 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 ${
                          errors.mrp ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.mrp && (
                      <p className="mt-1 text-sm text-red-500">{errors.mrp.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700 mb-1">
                      Selling Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₹</span>
                      </div>
                      <input
                        id="sellingPrice"
                        type="number"
                        step="0.01"
                        {...register('sellingPrice')}
                        className={`block w-full pl-7 pr-12 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 ${
                          errors.sellingPrice ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.sellingPrice && (
                      <p className="mt-1 text-sm text-red-500">{errors.sellingPrice.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                      Discount %
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        id="discount"
                        type="number"
                        value={discountPercentage}
                        readOnly
                        className="block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-1">
                      Material <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="material"
                      {...register('material')}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 ${
                        errors.material ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {materials.map((material) => (
                        <option key={material} value={material}>
                          {material.charAt(0).toUpperCase() + material.slice(1)}
                        </option>
                      ))}
                    </select>
                    {errors.material && (
                      <p className="mt-1 text-sm text-red-500">{errors.material.message}</p>
                    )}
                  </div>

                  {showPurityField && (
                    <div>
                      <label htmlFor="purity" className="block text-sm font-medium text-gray-700 mb-1">
                        Purity <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="purity"
                        {...register('purity')}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 ${
                          errors.purity ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select purity</option>
                        {purityOptions.map((purity) => (
                          <option key={purity} value={purity}>
                            {purity}
                          </option>
                        ))}
                      </select>
                      {errors.purity && (
                        <p className="mt-1 text-sm text-red-500">{errors.purity.message}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (grams) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        id="weight"
                        type="number"
                        step="0.01"
                        {...register('weight')}
                        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 ${
                          errors.weight ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">g</span>
                      </div>
                    </div>
                    {errors.weight && (
                      <p className="mt-1 text-sm text-red-500">{errors.weight.message}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="minQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="minQuantity"
                      type="number"
                      {...register('minQuantity')}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 ${
                        errors.minQuantity ? 'border-red-500' : 'border-gray-300'
                      }`}
                      min="1"
                      defaultValue={1}
                    />
                    {errors.minQuantity && (
                      <p className="mt-1 text-sm text-red-500">{errors.minQuantity.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="stock"
                      type="number"
                      {...register('stock')}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 ${
                        errors.stock ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-500">{errors.stock.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="gender"
                      {...register('gender')}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 ${
                        errors.gender ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {genders.map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="occasion" className="block text-sm font-medium text-gray-700 mb-1">
                      Occasion
                    </label>
                    <select
                      id="occasion"
                      {...register('occasion')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700"
                    >
                      <option value="">Select occasion</option>
                      {occasions.map((occasion) => (
                        <option key={occasion} value={occasion}>
                          {occasion}
                        </option>
                      ))}
                    </select>
                    {errors.occasion && (
                      <p className="mt-1 text-sm text-red-500">{errors.occasion.message}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="warrantyInMonths" className="block text-sm font-medium text-gray-700 mb-1">
                    Warranty (Months)
                  </label>
                  <input
                    id="warrantyInMonths"
                    type="number"
                    {...register('warrantyInMonths')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700"
                  />
                    {errors.warrantyInMonths && (
                      <p className="mt-1 text-sm text-red-500">{errors.warrantyInMonths.message}</p>
                    )}                  
                </div>
              </div>

              <div>
                <div className="mb-4 p-4 border border-gray-200 rounded-md">
                  <div className="flex items-center mb-3">
                    <input
                      id="isReturnable"
                      type="checkbox"
                      {...register('isReturnable')}
                      className="h-4 w-4 text-gray-700 focus:ring-gray-700 border-gray-300 rounded"
                    />
                    <label htmlFor="isReturnable" className="ml-2 block text-sm font-medium text-gray-700">
                      This product is returnable
                    </label>
                  </div>

                  {watchIsReturnable && (
                    <div>
                      <label htmlFor="returnPolicyDays" className="block text-sm font-medium text-gray-700 mb-1">
                        Return Within (Days) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="returnPolicyDays"
                        type="number"
                        {...register('returnPolicyDays')}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 ${
                          errors.returnPolicyDays ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.returnPolicyDays && (
                        <p className="mt-1 text-sm text-red-500">{errors.returnPolicyDays.message}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Image (Main Display) <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {previewDefaultImage ? (
                        <div className="relative">
                          <img
                            src={previewDefaultImage}
                            alt="Default preview"
                            className="h-32 w-32 object-cover rounded-md mx-auto"
                          />
                          <button
                            type="button"
                            onClick={removeDefaultImage}
                            className="absolute top-0 right-0 bg-gray-700 bg-opacity-75 text-white rounded-full p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600 justify-center">
                            <label
                              htmlFor="default-image-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-gray-700 hover:text-gray-900 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-700"
                            >
                              <span>Upload file</span>
                              <input
                                id="default-image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleDefaultImageChange}
                                className="sr-only"
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                        </>
                      )}
                    </div>
                  </div>
                  {errors.defaultImage && (
                    <p className="mt-1 text-sm text-red-500">{errors.defaultImage.message}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Images (Max 5)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="additional-images-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-gray-700 hover:text-gray-900 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-700"
                        >
                          <span>Upload files</span>
                          <input
                            id="additional-images-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleAdditionalImagesChange}
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG up to 2MB each</p>
                      {errors.additionalImages && (
                        <p className="mt-1 text-sm text-red-500">{errors.additionalImages.message}</p>
                      )}
                    </div>
                  </div>

                  {previewImages.length > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-gray-700">Selected Images:</h3>
                        <span className="text-xs text-gray-500">
                          {previewImages.length}/5 images
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {previewImages.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index}`}
                              className="h-24 w-full object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeAdditionalImage(index)}
                              className="absolute top-1 right-1 bg-gray-700 bg-opacity-75 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-gray-700 text-white rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Uploading...' : 'Upload Product'}
          </button>
        </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadProduct;