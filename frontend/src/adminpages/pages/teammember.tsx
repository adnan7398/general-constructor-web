import React, { useEffect, useState } from 'react';
import { getTeamMembers, addTeamMember, deleteTeamMember,getAllProjects } from '../../api/teammember';
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
  assignedProject: string[];
  joinedDate: Date;
  isActive: boolean;
}

const TeamMembers: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<{ _id: string; name: string }[]>([]);

  const [form, setForm] = useState<Omit<TeamMember, '_id'>>({
    name: '',
    role: 'Engineer',
    contact: {
      phone: '',
      email: '',
    },
    profileImage: '',
    assignedProject: [],
    joinedDate: new Date(),
    isActive: true,
  });
  const fetchProjects = async () => {
    try {
      const data = await getAllProjects();
      setProjects(data); // Make sure backend sends `{ _id, name }`
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchProjects();
  }, []);
  const fetchMembers = async () => {
    const data = await getTeamMembers();
    setMembers(data);
  };

  const handleAdd = async () => {
    try {
      // ensure value is array
      const preparedForm = {
        ...form,
        assignedProject: Array.isArray(form.assignedProject)
          ? form.assignedProject
          : [form.assignedProject]
      };
  
      await addTeamMember(preparedForm);
  
      setForm({
        name: '',
        role: 'Engineer',
        contact: { phone: '', email: '' },
        profileImage: '',
        assignedProject: [],
        joinedDate: new Date(),
        isActive: true
      });
  
      setIsOpen(false);
      fetchMembers();
    } catch (error) {
      console.error('Failed to add member:', error);
    }
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
            <button onClick={() => handleDelete(member._id)} className="text-red-500 hover:text-red-700">
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
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as TeamMember['role'] })}
                className="w-full border p-2 rounded"
              >
                <option value="Engineer">Engineer</option>
                <option value="Architect">Architect</option>
                <option value="Contractor">Contractor</option>
                <option value="Manager">Manager</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Worker">Worker</option>
              </select>
              <input
                type="email"
                placeholder="Email"
                value={form.contact.email}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, email: e.target.value } })}
                className="w-full border p-2 rounded"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={form.contact.phone}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Profile Image URL"
                value={form.profileImage}
                onChange={(e) => setForm({ ...form, profileImage: e.target.value })}
                className="w-full border p-2 rounded"
              />
                          <select
              multiple
              value={form.assignedProject}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                setForm({ ...form, assignedProject: selectedOptions });
              }}
              className="w-full border p-2 rounded h-32"
            >
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
              <input
                type="date"
                value={form.joinedDate.toISOString().split('T')[0]}
                onChange={(e) => setForm({ ...form, joinedDate: new Date(e.target.value) })}
                className="w-full border p-2 rounded"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                <label className="text-sm">Is Active</label>
              </div>
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
