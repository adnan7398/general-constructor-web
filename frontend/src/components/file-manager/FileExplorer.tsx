import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FolderPlus, Upload, Search, Grid, List as ListIcon, ChevronRight, Home, ArrowLeft } from 'lucide-react';
import FileList from './FileList';
import { FileItem, FolderItem } from './types';

interface FileExplorerProps {
    projectId: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ projectId }) => {
    const [currentFolder, setCurrentFolder] = useState<FolderItem | null>(null);
    const [folders, setFolders] = useState<FolderItem[]>([]);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [breadcrumbs, setBreadcrumbs] = useState<FolderItem[]>([]); // Simplified breadcrumb
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Fetch Content
    const fetchContent = async (folderId: string | null = null) => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:3000/directory/projects/${projectId}/content`, {
                params: { folderId }
            });
            setFolders(res.data.folders);
            setFiles(res.data.files);
            if (res.data.currentFolder) {
                // Simple breadcrumb logic (for now just stacking current folders isn't persistent on refresh without full path, but sufficient for nav)
                // A better way is to rely on the backend to return full path or store history.
                // For MVP, we will rely on local history state management or just single level up.
            }
        } catch (error) {
            console.error("Error fetching content", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent(currentFolder?._id || null);
    }, [projectId, currentFolder]);

    // Handle Folder Navigation
    const handleFolderClick = (folder: FolderItem) => {
        setBreadcrumbs([...breadcrumbs, folder]); // Add to breadcrumbs
        setCurrentFolder(folder);
    };

    const handleBreadcrumbClick = (index: number) => {
        if (index === -1) {
            setBreadcrumbs([]);
            setCurrentFolder(null);
        } else {
            const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
            setBreadcrumbs(newBreadcrumbs);
            setCurrentFolder(newBreadcrumbs[newBreadcrumbs.length - 1]);
        }
    };

    const handleGoUp = () => {
        if (breadcrumbs.length > 0) {
            const newBreadcrumbs = [...breadcrumbs];
            newBreadcrumbs.pop();
            setBreadcrumbs(newBreadcrumbs);
            setCurrentFolder(newBreadcrumbs.length > 0 ? newBreadcrumbs[newBreadcrumbs.length - 1] : null);
        }
    };

    // Create Folder
    const handleCreateFolder = async () => {
        const name = prompt("Enter folder name:");
        if (!name) return;

        try {
            await axios.post('http://localhost:3000/directory/folders', {
                name,
                projectId,
                parentId: currentFolder?._id
            });
            fetchContent(currentFolder?._id || null);
        } catch (error) {
            alert("Error creating folder");
        }
    };

    // Upload File
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectId', projectId);
        if (currentFolder) {
            formData.append('folderId', currentFolder._id);
        }

        try {
            setIsUploading(true);
            await axios.post('http://localhost:3000/directory/files', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchContent(currentFolder?._id || null);
        } catch (error) {
            console.error(error);
            alert("Error uploading file");
        } finally {
            setIsUploading(false);
        }
    };

    // Deletion
    const handleDeleteFolder = async (id: string) => {
        if (!confirm("Are you sure? Folder must be empty.")) return;
        try {
            await axios.delete(`http://localhost:3000/directory/folders/${id}`);
            fetchContent(currentFolder?._id || null);
        } catch (error: any) {
            alert(error.response?.data?.message || "Error deleting folder");
        }
    };

    const handleDeleteFile = async (id: string) => {
        if (!confirm("Are you sure you want to delete this file?")) return;
        try {
            await axios.delete(`http://localhost:3000/directory/files/${id}`);
            fetchContent(currentFolder?._id || null);
        } catch (error) {
            alert("Error deleting file");
        }
    };

    // Filter
    const filteredFolders = folders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-140px)] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-hidden">
                    <button
                        onClick={() => handleBreadcrumbClick(-1)}
                        className={`p-2 rounded-lg hover:bg-gray-100 text-gray-600 ${!currentFolder ? 'bg-gray-100 font-medium text-blue-600' : ''}`}
                    >
                        <Home className="w-5 h-5" />
                    </button>
                    {breadcrumbs.map((crumb, idx) => (
                        <div key={crumb._id} className="flex items-center">
                            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                            <button
                                onClick={() => handleBreadcrumbClick(idx)}
                                className={`px-3 py-1.5 rounded-md hover:bg-gray-50 text-sm whitespace-nowrap ${idx === breadcrumbs.length - 1 ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'}`}
                            >
                                {crumb.name}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
                        />
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <ListIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                    {currentFolder && (
                        <button
                            onClick={handleGoUp}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                    )}
                    <span className="text-sm text-gray-500 ml-2">
                        {filteredFolders.length} folders, {filteredFiles.length} files
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCreateFolder}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm"
                    >
                        <FolderPlus className="w-4 h-4 text-blue-500" />
                        New Folder
                    </button>
                    <label className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm cursor-pointer transition-all ${isUploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        <Upload className="w-4 h-4" />
                        {isUploading ? 'Uploading...' : 'Upload File'}
                        <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                    </label>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <FileList
                        folders={filteredFolders}
                        files={filteredFiles}
                        onFolderClick={handleFolderClick}
                        onFileClick={(file) => window.open(`http://localhost:3000${file.url}`, '_blank')}
                        onDeleteFolder={handleDeleteFolder}
                        onDeleteFile={handleDeleteFile}
                        viewMode={viewMode}
                    />
                )}
            </div>
        </div>
    );
};

export default FileExplorer;
