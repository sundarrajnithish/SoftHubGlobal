import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductForm.css';
import { useAuth } from '../components/AuthContext';

const ProductFormPage = () => {
  const { productId } = useParams(); // Extract productId from URL
  const [isEditMode, setIsEditMode] = useState(!!productId); // Set edit mode based on productId

  // State for form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('operating-systems');
  const [description, setDescription] = useState('');
  const [developer, setDeveloper] = useState('');
  const [platform, setPlatform] = useState('PC');
  const [price, setPrice] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [size, setSize] = useState('');
  const [titleImage, setTitleImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [features, setFeatures] = useState([]);
  const [licenseType, setLicenseType] = useState('');
  const [version, setVersion] = useState('');
  const [languages, setLanguages] = useState([]);
  const [tags, setTags] = useState('');
  const [stock, setStock] = useState('');
  const [discount, setDiscount] = useState('');
  const [offer, setOffer] = useState('');
  const [providerId, setProviderId] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state
  const { userDetails } = useAuth();


  // Fetch product details if in edit mode
  useEffect(() => {

    const provider_id = userDetails && userDetails['sub']
    console.log("Provider ID:", provider_id);
    if (!provider_id) {
      console.error("Provider ID is not available.");
      return;
    }

    setProviderId(provider_id);

    const fetchProductDetails = async () => {
      if (isEditMode && productId) {
        try {
          const response = await fetch(`https://46x4o900l3.execute-api.ca-central-1.amazonaws.com/productDetails/products?productId=${productId}`);
          if (response.ok) {
            const data = await response.json();
            // Set state with fetched product details
            setName(data.Name || '');
            setCategory(data.Category || 'operating-systems');
            setDescription(data.Description || '');
            setDeveloper(data.Developer || '');
            setPlatform(data.Platform || 'PC');
            setPrice(data.Price || '');
            setReleaseDate(data.ReleaseDate || '');
            setSize(data['Size'] || '');
            setTitleImage(data.TitleImage || null);
            setGalleryImages(data.GalleryImages || []);
            setFeatures(data.Features || []);
            setLicenseType(data['license-type'] || '');
            setVersion(data.version || '');
            setLanguages(data['supported-languages'] || []);
            setTags(data.tags ? data.tags.join(', ') : '');
            setStock(data['stock-availability'] || '');
            setDiscount(data.discount || '');
            setOffer(data.Offer || '');
          } else {
            console.error('Failed to fetch product details');
          }
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      }
    };

    fetchProductDetails();
  }, [isEditMode, productId]);

  // Handle image changes
  const handleTitleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setTitleImage(reader.result.split(',')[1]); // Strip off the data URL part
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryImagesChange = (event) => {
    const files = Array.from(event.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result.split(',')[1]); // Strip off the data URL part
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(setGalleryImages);
  };

  const handleFeatureChange = (e) => {
    const options = e.target.options;
    const selectedFeatures = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedFeatures.push(options[i].value);
      }
    }
    setFeatures(selectedFeatures);
  };

  const handleLanguageChange = (e) => {
    const options = e.target.options;
    const selectedLanguages = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedLanguages.push(options[i].value);
      }
    }
    setLanguages(selectedLanguages);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Software name is required';
    if (!description) newErrors.description = 'Description is required';
    if (!developer) newErrors.developer = 'Developer name is required';
    if (!price || isNaN(price)) newErrors.price = 'Valid price is required';
    if (!releaseDate) newErrors.releaseDate = 'Release date is required';
    if (!size || isNaN(size)) newErrors.size = 'Valid size is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true); // Show loading
      const productData = {
        ProviderId: providerId.toString(), // Ensure ProviderId is a string
        Name: name, // String
        Developer: developer, // String
        Platform: platform, // String
        Description: description, // String
        Category: category, // String
        Features: features, // Array
        Size: size.toString(), // Ensure this is sent as a string
        Price: price.toString(), // Ensure this is sent as a string
        
        ReleaseDate: releaseDate, // String
        'license-type': licenseType, // String
        version: version.toString(), // Ensure version is a string
        'supported-languages': languages, // Array
        tags: tags.split(',').map(tag => tag.trim()), // Convert tags to an array of strings
        'stock-availability': stock.toString(), // Ensure stock is a string
        discount: discount.toString(), // Ensure discount is a string
        'special-offer': offer, // String
        'title-image': titleImage, // String (base64)
        'gallery-images': galleryImages, // Array of strings (base64)
      };

      try {
        let response;
        if (isEditMode && productId) {
          // Update existing product
          response = await fetch(`https://muilwtzap7.execute-api.ca-central-1.amazonaws.com/edit-software/edit-software?productId=${productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData), // Send as JSON
          });
        } else {
          // Create a new product
          response = await fetch(`https://zpfhv3pd3e.execute-api.ca-central-1.amazonaws.com/add-software/add-software`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData), // Send as JSON
          });
        }

        const result = await response.json();
        console.log(result);
        if (response.ok) {
          alert(isEditMode ? 'Software updated successfully!' : 'Software added successfully!');
          // Optionally reset the form or redirect
        } else {
          alert('Failed to save software');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving the software.');
      } finally {
        setLoading(false); // Hide loading
      }
    }
  };

  return (
    <div className="product-form-page">
      <h1>{isEditMode ? 'Edit Software' : 'Add New Software'}</h1>
      <form onSubmit={handleSubmit}>
        {/* Software Name */}
        <div>
          <label htmlFor="name">Software Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="streaming-services">Streaming Services</option>
            <option value="games">Games</option>
            <option value="microsoft">Microsoft</option>
            <option value="video-editors">Video Editors</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter software description"
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

        {/* Developer */}
        <div>
          <label htmlFor="developer">Developer</label>
          <input
            type="text"
            id="developer"
            value={developer}
            onChange={(e) => setDeveloper(e.target.value)}
            placeholder="Enter developer name"
          />
          {errors.developer && <p className="error">{errors.developer}</p>}
        </div>

        {/* Platform */}
        <div>
          <label htmlFor="platform">Platform</label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="PC">PC</option>
            <option value="Mac">Mac</option>
            <option value="Linux">Linux</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
          />
          {errors.price && <p className="error">{errors.price}</p>}
        </div>

        {/* Release Date */}
        <div>
          <label htmlFor="releaseDate">Release Date</label>
          <input
            type="date"
            id="releaseDate"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
          {errors.releaseDate && <p className="error">{errors.releaseDate}</p>}
        </div>

        {/* Size */}
        <div>
          <label htmlFor="size">Size (MB)</label>
          <input
            type="number"
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="Enter size in MB"
          />
          {errors.size && <p className="error">{errors.size}</p>}
        </div>

        {/* Title Image */}
        <div className='image-preview'>
          <label htmlFor="title-image">Title Image</label>
          <input
            type="file"
            id="title-image"
            accept="image/*"
            onChange={handleTitleImageChange}
          />
          {titleImage && <img src={`data:image/jpeg;base64,${titleImage}`} alt="Preview" />}
        </div>

        {/* Gallery Images */}
        <div>
          <label htmlFor="gallery-images">Gallery Images</label>
          <input
            type="file"
            id="gallery-images"
            multiple
            accept="image/*"
            onChange={handleGalleryImagesChange}
          />
          {galleryImages.length > 0 && (
            <div className='image-preview'>
              {galleryImages.map((img, index) => (
                <img key={index} src={`data:image/jpeg;base64,${img}`} alt={`Gallery Preview ${index}`} />
              ))}
            </div>
          )}
        </div>

        {/* Features */}
        <div>
          <label htmlFor="features">Features</label>
          <select
            id="features"
            multiple
            value={features}
            onChange={handleFeatureChange}
          >
            <option value="multiplayer">Multiplayer</option>
            <option value="single-player">Single Player</option>
            <option value="offline">Offline</option>
            <option value="online">Online</option>
            <option value="cross-platform">Cross Platform</option>
          </select>
        </div>

        {/* License Type */}
        <div>
          <label htmlFor="licenseType">License Type</label>
          <input
            type="text"
            id="licenseType"
            value={licenseType}
            onChange={(e) => setLicenseType(e.target.value)}
            placeholder="Enter license type"
          />
        </div>

        {/* Version */}
        <div>
          <label htmlFor="version">Version</label>
          <input
            type="text"
            id="version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="Enter version"
          />
        </div>

        {/* Supported Languages */}
        <div>
          <label htmlFor="languages">Supported Languages</label>
          <select
            id="languages"
            multiple
            value={languages}
            onChange={handleLanguageChange}
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags"
          />
        </div>

        {/* Stock */}
        <div>
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter stock quantity"
          />
        </div>

        {/* Discount */}
        <div>
          <label htmlFor="discount">Discount (%)</label>
          <input
            type="number"
            id="discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="Enter discount percentage"
          />
        </div>

        {/* Offer */}
        <div>
          <label htmlFor="offer">Offer</label>
          <input
            type="text"
            id="offer"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            placeholder="Enter any special offers"
          />
        </div>

        <button type="submit">{isEditMode ? 'Update Software' : 'Add Software'}</button>
      </form>

    </div>
  );
};

export default ProductFormPage;