import React, { useState, useEffect, useRef } from 'react';
import { getRequest, putRequest } from '../Services/apiMethods';

export const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    profileImage: ''
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({...profile});
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Get profile data from API
  const getProfile = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage
    
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // API call to get profile - adjust URL based on your backend structure
      const response = await getRequest(`/users/${userId}`, token);
      console.log("Responseee", response)
      
      if (response.isSuccess) {
        setProfile(response.data);
      } else {
        setError(response.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.message || "Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  // Update profile data via API
  const updateProfile = async (updatedData) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (!token) {
      setError("No authentication token found");
      return false;
    }

    try {
      setUpdating(true);
      setError(null);
      
      // Create FormData for file upload if profile image is included
      let requestData;
      let headers = {};
      
      if (previewImage) {
        // If there's a new image, create FormData
        const formDataToSend = new FormData();
        
        // Add all profile fields to FormData
        Object.keys(updatedData).forEach(key => {
          if (key !== 'profileImage') {
            formDataToSend.append(key, updatedData[key]);
          }
        });
        
        // Convert base64 image to blob and add to FormData
        if (previewImage.startsWith('data:')) {
          const response = await fetch(previewImage);
          const blob = await response.blob();
          formDataToSend.append('profileImage', blob, 'profile-image.jpg');
        }
        
        requestData = formDataToSend;
        headers = { 'Content-Type': 'multipart/form-data' };
      } else {
        // If no new image, send as JSON
        requestData = updatedData;
        headers = { 'Content-Type': 'application/json' };
      }
      
      // API call to update profile
      const response = await putRequest(`/users/${userId}`, requestData, token, headers);
      
      if (response.isSuccess) {
        setProfile(response.data);
        setIsModalOpen(false);
        setPreviewImage(null);
        return true;
      } else {
        setError(response.message || "Failed to update profile");
        return false;
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message || "Failed to update profile");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  // Load profile data on component mount
  useEffect(() => {
    getProfile();
  }, []);

  // Update form data when profile changes
  useEffect(() => {
    setFormData({...profile});
    setPreviewImage(null);
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedProfile = {...formData};
    
    // Update profile image if a new one was selected
    if (previewImage) {
      updatedProfile.profileImage = previewImage;
    }
    
    const success = await updateProfile(updatedProfile);
    if (success) {
      console.log('Profile updated successfully');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({...profile}); // Reset form data
    setPreviewImage(null); // Reset preview image
    setError(null); // Clear any errors
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-28">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-600">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-28">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">My Profile</h1>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center">
            <div className="w-36 h-36 rounded-full mb-4 overflow-hidden bg-gray-200">
              {profile.profileImage ? (
                <img 
                  src={profile.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <span className="text-4xl">👤</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors w-full"
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Edit Profile'}
            </button>
          </div>
          
          {/* Profile Details */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="profile-field">
                <label className="block text-sm font-medium text-gray-500">First Name</label>
                <div className="text-lg">{profile.firstName || 'Not provided'}</div>
              </div>
              
              <div className="profile-field">
                <label className="block text-sm font-medium text-gray-500">Last Name</label>
                <div className="text-lg">{profile.lastName || 'Not provided'}</div>
              </div>
              
              <div className="profile-field">
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <div className="text-lg">{profile.email || 'Not provided'}</div>
              </div>
              
              <div className="profile-field">
                <label className="block text-sm font-medium text-gray-500">Phone</label>
                <div className="text-lg">{profile.phone || 'Not provided'}</div>
              </div>
              
              <div className="profile-field md:col-span-2">
                <label className="block text-sm font-medium text-gray-500">Address</label>
                <div className="text-lg">{profile.address || 'Not provided'}</div>
              </div>
              
              <div className="profile-field">
                <label className="block text-sm font-medium text-gray-500">City</label>
                <div className="text-lg">{profile.city || 'Not provided'}</div>
              </div>
              
              <div className="profile-field">
                <label className="block text-sm font-medium text-gray-500">State</label>
                <div className="text-lg">{profile.state || 'Not provided'}</div>
              </div>
              
              <div className="profile-field">
                <label className="block text-sm font-medium text-gray-500">Zip Code</label>
                <div className="text-lg">{profile.zipCode || 'Not provided'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <button 
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                disabled={updating}
              >
                ✕
              </button>
            </div>
            
            {/* Error Display in Modal */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center mb-4">
                <div 
                  className="w-24 h-24 rounded-full overflow-hidden relative cursor-pointer group bg-gray-200"
                  onClick={handleImageClick}
                >
                  {(previewImage || formData.profileImage) ? (
                    <img 
                      src={previewImage || formData.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <span className="text-2xl">👤</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all">
                    <span className="text-white opacity-0 group-hover:opacity-100 text-sm">Change</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={updating}
                />
                <button 
                  type="button"
                  className="mt-2 text-sm text-blue-600 hover:underline"
                  onClick={handleImageClick}
                  disabled={updating}
                >
                  Change Profile Photo
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={updating}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={updating}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={updating}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={updating}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input 
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={updating}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={updating}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input 
                    type="text" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={updating}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                  <input 
                    type="text" 
                    name="zipCode" 
                    value={formData.zipCode} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={updating}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  disabled={updating}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                  disabled={updating}
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;