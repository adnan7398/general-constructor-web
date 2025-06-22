import React, { useEffect, useState } from 'react';
import { getTeamMembers, addTeamMember, deleteTeamMember } from '../../api/teammember';
import { Plus, Trash2 } from 'lucide-react';
interface TeamMember {
  _id: string;
  name: string;
  role: 'Engineer' | 'Architect' | 'Contractor' | 'Manager' | 'Supervisor' | 'Worker';
  contact: {
    phone: string;
    email: string;
  };
  profileImage: string;
  assignedProject: string; // ObjectId as string
  joinedDate: Date;
  isActive: boolean;
}

const TeamMembers: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<Omit<TeamMember, '_id'>>({
    name: '',
    role: 'Engineer',
    contact: {
      phone: '',
      email: ''
    },
    profileImage: '',
    assignedProject: '', // Should be ObjectId string
    joinedDate: new Date(),
    isActive: true
  });
  

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const data = await getTeamMembers();
    setMembers(data);
  };

  const handleAdd = async () => {
    await addTeamMember(form);
    setForm({
      name: '',
      role: 'Engineer',
      contact: {
        phone: '',
        email: ''
      },
      profileImage: '',
      assignedProject: '', // Should be ObjectId string
      joinedDate: new Date(),
      isActive: true
    });
    setIsOpen(false);
    fetchMembers();
  };

  const handleDelete = async (id: string) => {
    await deleteTeamMember(id);
    fetchMembers();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Team Members</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded inline-flex items-center"
        >
          <Plus className="mr-2" /> Add Team Member
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {members.map((member) => (
          <div key={member._id} className="border p-4 rounded shadow-sm flex justify-between items-center">
            <div>
              <h2 className="font-medium">{member.name}</h2>
              <p className="text-sm text-gray-600">{member.role} | {member.contact.email}</p>
            </div>
            <button onClick={() => handleDelete(member._id!)} className="text-red-500 hover:text-red-700">
              <Trash2 />
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Team Member</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as TeamMember['role'] })}
                className="w-full border p-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.contact.email}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, email: e.target.value } })}
                className="w-full border p-2 rounded"
              />
               <input
                type="tel"
                pattern="[0-9]{10}"
                placeholder="10-digit number"
                value={form.contact.phone}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Role"
                value={form.profileImage}
                onChange={(e) => setForm({ ...form, profileImage: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.assignedProject}
                onChange={(e) => setForm({ ...form, assignedProject: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Name"
                value={form.joinedDate.toISOString().split('T')[0]}
                onChange={(e) => setForm({ ...form, joinedDate: new Date(e.target.value) })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Role"
                value={form.isActive ? 'Active' : 'Inactive'}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button onClick={() => setIsOpen(false)} className="text-gray-700">Cancel</button>
              <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-1 rounded">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
