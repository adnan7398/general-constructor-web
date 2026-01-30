import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { addProject } from '../../api/projects';
import { Project } from '../../api/projects.ts';

const CreateProjectButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [projectType, setProjectType] = useState<string>('Commercial'); // Default to capitalized
  const [startDate, setStartDate] = useState('');
  const [budget, setBudget] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(''); // New state

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setName('');
    setProjectType('Commercial');
    setStartDate('');
    setBudget('');
    setDescription('');
    setLocation('');
  };

  const handleCreateProject = async () => {
    try {
      // Map frontend keys to backend schema
      // Backend expects: title, category, location, images, description, etc.
      const payload: any = {
        title: name,
        category: projectType, // Casing already handled in select
        location: location,
        description: description,
        status: 'upcoming',
        startDate: startDate,
        budget: Number(budget),
        images: ['https://placehold.co/600x400'] // Default image to satisfy required array
      };

      await addProject(payload);
      alert('Project created successfully!');
      closeModal();
      // Optionally trigger refresh here if passed as prop
      window.location.reload(); // Temporary force refresh to see new project
    } catch (err: any) {
      console.error(err);
      alert('Failed to create project: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
      >
        <Plus className="h-4 w-4" />
        Create New Project
      </button>

      {isOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-slate-900/70" onClick={closeModal} />

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-slate-800 rounded-xl border border-slate-700 px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-slate-100">Create New Project</h3>
                  <div className="mt-6 space-y-4 text-left">
                    <div>
                      <label className="block text-sm font-medium text-slate-300">Project Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full sm:text-sm border border-slate-600 bg-slate-700/50 text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 placeholder-slate-500"
                        placeholder="Enter project name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300">Project Type</label>
                      <select
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="mt-1 block w-full sm:text-sm border border-slate-600 bg-slate-700/50 text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                      >
                        <option value="Commercial">Commercial</option>
                        <option value="Residential">Residential</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Renovation">Renovation</option>
                        <option value="Interior">Interior</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300">Location</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="mt-1 block w-full sm:text-sm border border-slate-600 bg-slate-700/50 text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 placeholder-slate-500"
                        placeholder="City, Country"
                      />
                    </div>



                    <div>
                      <label className="block text-sm font-medium text-slate-300">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 block w-full sm:text-sm border border-slate-600 bg-slate-700/50 text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300">Estimated Budget ($)</label>
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="mt-1 block w-full sm:text-sm border border-slate-600 bg-slate-700/50 text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 placeholder-slate-500"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300">Description</label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full sm:text-sm border border-slate-600 bg-slate-700/50 text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 placeholder-slate-500"
                        placeholder="Enter project description"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full inline-flex justify-center rounded-lg border border-slate-600 px-4 py-2 bg-slate-700 text-sm font-medium text-slate-200 hover:bg-slate-600 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateProject}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent px-4 py-2 bg-primary-600 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateProjectButton;
