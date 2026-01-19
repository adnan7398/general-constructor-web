import React, { useEffect, useState } from 'react';
import { CheckSquare, Clock, ListTodo } from 'lucide-react';

type TaskStatus = 'pending' | 'in-progress' | 'completed';

interface Task {
  id: string;
  title: string;
  project: string;
  assignee: string;
  status: TaskStatus;
  dueDate: string;
}
const TaskOverview: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'all'>('all');
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('https://general-constructor-web-2.onrender.com/project/all', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const projects = await res.json();

        const transformed: Task[] = projects.map((proj: any) => ({
          id: proj._id,
          title: proj.description || proj.name,
          project: proj.name,
          assignee: proj.clientName || 'Unassigned',
          status:
            proj.status === 'completed'
              ? 'completed'
              : proj.status === 'ongoing'
              ? 'in-progress'
              : 'pending',
          dueDate: proj.endDate || '2025-12-31', // fallback for null
        }));

        setTasks(transformed);
      } catch (err) {
        console.error('Error fetching project data:', err);
      }
    };

    fetchProjects();
  }, []);

  const filteredTasks = selectedStatus === 'all'
    ? tasks
    : tasks.filter(task => task.status === selectedStatus);

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return <CheckSquare className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'pending': return <ListTodo className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusClass = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-500/20';
      case 'in-progress': return 'text-amber-400 bg-amber-500/20';
      case 'pending': return 'text-blue-400 bg-blue-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  const statusFilters = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
  ];

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter(task => task.status === 'pending').length,
    'in-progress': tasks.filter(task => task.status === 'in-progress').length,
    completed: tasks.filter(task => task.status === 'completed').length,
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700">
      <div className="px-4 py-5 sm:px-6 border-b border-slate-700">
        <div className="flex items-center">
          <CheckSquare className="h-5 w-5 text-primary-400 mr-2" />
          <h3 className="text-lg leading-6 font-medium text-slate-100">Project Status Overview</h3>
        </div>
      </div>

      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedStatus(filter.value as TaskStatus | 'all')}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedStatus === filter.value ? 'bg-primary-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {filter.label}
              <span className="ml-1.5 bg-slate-600 px-1.5 py-0.5 rounded-full text-xs">{taskCounts[filter.value as keyof typeof taskCounts]}</span>
            </button>
          ))}
        </div>

        <div className="overflow-hidden">
          <ul className="divide-y divide-slate-700">
            {filteredTasks.map((task) => (
              <li key={task.id} className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-100 truncate">{task.title}</p>
                      <div className="flex items-center mt-1">
                        <p className="text-xs text-slate-400 truncate">{task.project}</p>
                        <span className="mx-1.5 text-slate-600">•</span>
                        <p className="text-xs text-slate-400 truncate">{task.assignee}</p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusClass(task.status)}`}>
                      {getStatusIcon(task.status)}
                      <span className="ml-1 capitalize">{task.status.replace('-', ' ')}</span>
                    </span>
                    <span className="text-xs text-slate-500">Due {formatDate(task.dueDate)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskOverview;
