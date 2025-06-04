import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const CreateProjectButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
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
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={closeModal}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    Create New Project
                  </h3>
                  <div className="mt-6 space-y-4">
                    <div className="text-left">
                      <label htmlFor="project-name" className="block text-sm font-medium text-gray-700">
                        Project Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="project-name"
                          id="project-name"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Enter project name"
                        />
                      </div>
                    </div>
                    <div className="text-left">
                      <label htmlFor="project-type" className="block text-sm font-medium text-gray-700">
                        Project Type
                      </label>
                      <div className="mt-1">
                        <select
                          id="project-type"
                          name="project-type"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option>Commercial</option>
                          <option>Residential</option>
                          <option>Industrial</option>
                          <option>Infrastructure</option>
                        </select>
                      </div>
                    </div>
                    <div className="text-left">
                      <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                        Start Date
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          name="start-date"
                          id="start-date"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="text-left">
                      <label htmlFor="estimated-budget" className="block text-sm font-medium text-gray-700">
                        Estimated Budget ($)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="estimated-budget"
                          id="estimated-budget"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="text-left">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Enter project description"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
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