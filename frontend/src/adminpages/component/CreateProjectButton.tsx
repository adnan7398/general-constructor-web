import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { addProject } from '../../api/projects'; 
import { Project } from '../../api/projects.ts';

const CreateProjectButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [projectType, setProjectType] = useState<Project['projectType']>('commercial');
  const [startDate, setStartDate] = useState('');
  const [budget, setBudget] = useState<number | ''>('');
  const [description, setDescription] = useState('');

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setName('');
    setProjectType('commercial');
    setStartDate('');
    setBudget('');
    setDescription('');
  };

  const handleCreateProject = async () => {
    try {
      await addProject({
        name,
        projectType,
        status: 'ongoing', 
        startDate,
        budget: Number(budget),
        description,
      });
      alert('Project created successfully!');
      closeModal();
    } catch (err) {
      console.error(err);
      alert('Failed to create project');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        <Plus className="h-5 w-5 mr-2" />
        Create New Project
      </button>

      {isOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Project</h3>
                  <div className="mt-6 space-y-4 text-left">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Project Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter project name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Project Type</label>
                      <select
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value as Project['projectType'])}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="commercial">Commercial</option>
                        <option value="residential">Residential</option>
                        <option value="industrial">Industrial</option>
                        <option value="infrastructure">Infrastructure</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Estimated Budget ($)</label>
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter project description"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateProject}
                  className="w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:text-sm"
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
