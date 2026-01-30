import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Mail, Phone, Calendar, User, Search, Filter, X } from 'lucide-react';
import {
  getTeamMembers,
  addTeamMember,
  deleteTeamMember,
  TeamMember
} from '../../api/teammember';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';



const TeamMembers: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  // const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<Omit<TeamMember, '_id'>>({
    name: '',
    role: 'Engineer',
    contact: { phone: '', email: '' },
    profileImage: '',
    assignedProject: [],
    joinedDate: new Date(),
    isActive: true,
  });


  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await getTeamMembers();
      setMembers(data);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    // fetchProjects();
  }, []);

  const handleAdd = async () => {
    try {
      const preparedForm = {
        ...form,
        assignedProject: Array.isArray(form.assignedProject) ? form.assignedProject : [form.assignedProject]
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
    if (!confirm('Are you sure you want to remove this team member?')) return;
    try {
      await deleteTeamMember(id);
      fetchMembers();
    } catch (error) {
      console.error('Failed to delete member:', error);
    }
  };

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleVariant = (role: string): any => {
    const map: Record<string, string> = {
      'Engineer': 'brand',
      'Architect': 'purple',
      'Manager': 'neutral',
      'Supervisor': 'warning'
    };
    return map[role] || 'neutral';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Team Members</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your team structure and assignments.</p>
        </div>
        <Button onClick={() => setIsOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Add Member
        </Button>
      </div>

      {/* Toolbar */}
      <Card noPadding className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>Filter</Button>
        </div>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading team members...</div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p>No team members found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member._id} noPadding className="overflow-hidden group hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={member.profileImage || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-100"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getRoleVariant(member.role)} size="sm">{member.role}</Badge>
                        {member.isActive && (
                          <span className="w-2 h-2 rounded-full bg-green-500 ring-2 ring-white" title="Active"></span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(member._id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    {member.contact.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="w-4 h-4 mr-3 text-gray-400" />
                    {member.contact.phone || 'N/A'}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                    Joined {new Date(member.joinedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>{member.assignedProject.length} Projects Assigned</span>
                <Button variant="ghost" size="sm" className="h-auto p-0 text-blue-600 hover:text-blue-700 hover:bg-transparent">View Details</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg shadow-2xl" noPadding>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Add Team Member</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Basic Info */}
              <div className="space-y-4">
                <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm bg-white"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                  >
                    {['Engineer', 'Architect', 'Contractor', 'Manager', 'Supervisor', 'Worker'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <Input label="Email" type="email" value={form.contact.email} onChange={(e) => setForm({ ...form, contact: { ...form.contact, email: e.target.value } })} />
                <Input label="Phone" type="tel" value={form.contact.phone} onChange={(e) => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })} />
                <Input label="Profile Image URL" value={form.profileImage} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} />

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">Active Account</label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd}>Create Member</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;