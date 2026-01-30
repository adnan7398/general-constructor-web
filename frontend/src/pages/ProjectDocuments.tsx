import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FileExplorer from '../components/file-manager/FileExplorer';
import { Layout } from 'lucide-react';

const ProjectDocuments: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    // const [project, setProject] = useState<any>(null);

    // Could fetch project details here to show title in header if needed

    if (!id) return <div>Project ID missing</div>;

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Layout className="w-6 h-6 text-blue-600" />
                    </div>
                    Project Documents
                </h1>
                <p className="text-gray-500 mt-1 ml-12">Manage and organize all your project files.</p>
            </div>

            <div className="flex-1 min-h-0">
                <FileExplorer projectId={id} />
            </div>
        </div>
    );
};

export default ProjectDocuments;
