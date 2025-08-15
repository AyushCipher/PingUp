import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../features/user/userSlice';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

const ProfileModal = ({ setShowEdit }) => {
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const user = useSelector((state) => state.user.value);

  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    location: user?.location || '',
    profile_picture: null,
    cover_photo: null,
    full_name: user?.full_name || '',
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const userData = new FormData();

      const { username, bio, location, profile_picture, cover_photo, full_name } = editForm;

      userData.append('username', username);
      userData.append('bio', bio);
      userData.append('location', location);
      userData.append('full_name', full_name);

      profile_picture && userData.append('profile', profile_picture);
      cover_photo && userData.append('cover', cover_photo);

      const token = await getToken();
      dispatch(updateUser({ userData, token }));

      setShowEdit(false);
    } catch (error) {
      toast.error(error.message || 'Error saving profile');
    }
  };

  const handleFileChange = (field, file) => {
    if (file) {
      setEditForm({ ...editForm, [field]: file });
    }
  };

  return (
    <div className="fixed inset-0 z-50 h-screen overflow-y-scroll bg-black/50">
      <div className="max-w-2xl sm:py-6 mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>
          <form
            className="space-y-4"
            onSubmit={(e) =>
              toast.promise(handleSaveProfile(e), {
                loading: 'Saving...',
                // success: 'Profile updated successfully',
                error: 'Failed to update profile',
              })
            }
          >
            {/* Profile Picture */}
            <div className="flex flex-col items-start gap-3">
              <label
                htmlFor="profile_picture"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Profile Picture
              </label>
              <input
                hidden
                type="file"
                accept="image/*"
                id="profile_picture"
                onChange={(e) => handleFileChange('profile_picture', e.target.files[0])}
              />
              <label htmlFor="profile_picture" className="group/profile relative cursor-pointer">
                <img
                  src={
                    editForm.profile_picture
                      ? URL.createObjectURL(editForm.profile_picture)
                      : user?.profile_picture
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover mt-2"
                />
                <div className="absolute inset-0 hidden group-hover/profile:flex bg-black/30 rounded-full items-center justify-center">
                  <Pencil className="w-5 h-5 text-white" />
                </div>
              </label>
            </div>

            {/* Cover Photo */}
            <div className="flex flex-col items-start gap-3">
              <label
                htmlFor="cover_photo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cover Photo
              </label>
              <input
                hidden
                type="file"
                accept="image/*"
                id="cover_photo"
                onChange={(e) => handleFileChange('cover_photo', e.target.files[0])}
              />
              <label htmlFor="cover_photo" className="group/cover relative cursor-pointer">
                <img
                  src={
                    editForm.cover_photo
                      ? URL.createObjectURL(editForm.cover_photo)
                      : user?.cover_photo
                  }
                  alt="Cover"
                  className="w-80 h-40 rounded-lg bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 object-cover mt-2"
                />
                <div className="absolute inset-0 hidden group-hover/cover:flex bg-black/30 rounded-lg items-center justify-center">
                  <Pencil className="w-5 h-5 text-white" />
                </div>
              </label>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-lg"
                placeholder="Please enter your full name"
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                value={editForm.full_name}
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-lg"
                placeholder="Please enter a username"
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                value={editForm.username}
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                rows={3}
                className="w-full p-3 border border-gray-200 rounded-lg"
                placeholder="Please enter a short bio"
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                value={editForm.bio}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-lg"
                placeholder="Please enter your location"
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                value={editForm.location}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={() => setShowEdit(false)}
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
