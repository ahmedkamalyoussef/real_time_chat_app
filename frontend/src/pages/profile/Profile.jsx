import { useAuthStore } from '../../store/useAuthStore';
import { Camera, Mail, User, UserCircle } from 'lucide-react';

function Profile() {
  const { authUser, isUpdatingProfilePic, updateProfilePic } = useAuthStore();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfilePic({ profilePicture: base64Image });
    };
  };

  return (
    <div className='h-screen pt-10'>
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-3">
          <div className="text-center">
            <h1 className='text-2xl font-semibold'>Profile</h1>
            <p className='mt-auto'>Your profile information</p>
          </div>

          {/* Avatar uploading */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                className='size-32 rounded-full object-cover border-4'
                src={authUser?.profilePicture}
                alt="profile"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer transition-all duration-200
                  ${isUpdatingProfilePic ? "animate-pulse pointer-events-none" : ""}`}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept='image/*'
                  disabled={isUpdatingProfilePic}
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <p className='text-sm text-zinc-400'>
              {isUpdatingProfilePic ? "Updating profile..." : "Click to change your profile picture"}
            </p>
          </div>

          {/* User information */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className='w-4 h-4' />
                Name
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>
                {authUser?.firstName} {authUser?.lastName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <UserCircle className='w-4 h-4' />
                Handle
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>
                {authUser?.handle}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className='w-4 h-4' />
                Email
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className='text-lg font-medium mb-4'>Account Information</h2>
            <div className="text-sm space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser?.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center py-2 justify-between">
                <span>Account status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;
 