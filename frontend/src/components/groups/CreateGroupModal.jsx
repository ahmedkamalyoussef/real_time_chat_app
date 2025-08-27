import { useState } from 'react';
import { X, Upload, Check, Users } from 'lucide-react';
import { useFriendsStore } from '../../store/useFriendsStore';
import { useGroupsStore } from '../../store/useGroupsStore'; // ✅ جديد
import toast from 'react-hot-toast';

export const CreateGroupModal = () => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { friends, onlineFriends } = useFriendsStore();
  const { createGroup } = useGroupsStore(); // ✅


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () =>{
        setSelectedImage(reader.result);
      } 
    }
  };

  const handleCreate = async () => {
    try {
      const newGroup = await createGroup({
        name: groupName.trim(),
        description: description.trim(),
        imageBase64: selectedImage,
        memberIds: selectedMembers,
      });

      // قفل المودال
      document.getElementById('create-group-modal')?.close();

      // تفريغ الحالة
      setGroupName('');
      setDescription('');
      setSelectedImage(null);
      setSelectedMembers([]);

      toast.success("Group created successfully");
    } catch (e) {
      // التوست بيتعمل في الستور
    }
  };

  return (
    <dialog id="create-group-modal" className="modal">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Create New Group</h3>
          <form method="dialog">
            <button className="btn btn-ghost btn-sm btn-circle">
              <X className="size-5" />
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Group Info */}
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="size-32 rounded-full bg-base-300 flex items-center justify-center overflow-hidden">
                  {selectedImage ? (
                    <img 
                      src={selectedImage} 
                      alt="Group" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="size-16 opacity-50" />
                  )}
                </div>
                <label className="btn btn-circle btn-sm absolute bottom-0 right-0">
                  <Upload className="size-4" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div className="w-full">
                <input
                  type="text"
                  placeholder="Group Name"
                  className="input input-bordered w-full"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>

              <div className="w-full">
                <textarea
                  placeholder="Group Description"
                  className="textarea textarea-bordered w-full"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Member Selection */}
          <div className="space-y-4">
            <h4 className="font-medium">Add Members</h4>

            <div className="h-[300px] overflow-y-auto border rounded-lg divide-y">
              {friends.map((friend) => (
                <div
                  key={friend._id}
                  className="flex items-center gap-3 p-3 hover:bg-base-200 cursor-pointer"
                  onClick={() => {
                    setSelectedMembers(prev => 
                      prev.includes(friend._id)
                        ? prev.filter(id => id !== friend._id)
                        : [...prev, friend._id]
                    );
                  }}
                >
                  <div className="relative">
                    <div className="avatar">
                      <div className="w-10 rounded-full">
                        <img src={friend.profilePicture} alt={friend.firstName} />
                      </div>
                    </div>
                    {onlineFriends.includes(friend._id) && (
                      <span 
                        className="absolute bottom-0 right-0 size-3 bg-green-500 
                        rounded-full ring-2 ring-base-100"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-medium">
                      {friend.firstName} {friend.lastName}
                    </div>
                    <div className="text-sm opacity-70">
                      {onlineFriends.includes(friend._id) ? "Online" : "Offline"}
                    </div>
                  </div>

                  <div className={`
                    size-5 rounded-full border-2 flex items-center justify-center
                    ${selectedMembers.includes(friend._id)
                      ? 'border-primary bg-primary text-primary-content'
                      : 'border-base-300'}
                  `}>
                    {selectedMembers.includes(friend._id) && <Check className="size-3" />}
                  </div>
                </div>
              ))}

              {friends.length === 0 && (
                <div className="flex items-center justify-center h-full text-base-content/50">
                  No friends found
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-70">
                {selectedMembers.length} members selected
              </span>
              <button 
                onClick={handleCreate}
                className="btn btn-primary"
                disabled={!groupName || selectedMembers.length === 0}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
