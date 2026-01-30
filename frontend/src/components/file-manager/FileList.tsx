import React from 'react';
import { FileText, Folder, MoreVertical, Download, Trash2, File as FileIcon, Image, Film, Music } from 'lucide-react';
import { FileItem, FolderItem } from './types';

interface FileListProps {
    folders: FolderItem[];
    files: FileItem[];
    onFolderClick: (folder: FolderItem) => void;
    onFileClick: (file: FileItem) => void;
    onDeleteFolder: (folderId: string) => void;
    onDeleteFile: (fileId: string) => void;
    viewMode: 'grid' | 'list';
}

const FileList: React.FC<FileListProps> = ({
    folders,
    files,
    onFolderClick,
    onFileClick,
    onDeleteFolder,
    onDeleteFile,
    viewMode
}) => {

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return <Image className="w-8 h-8 text-purple-500" />;
        if (mimeType.startsWith('video/')) return <Film className="w-8 h-8 text-red-500" />;
        if (mimeType.startsWith('audio/')) return <Music className="w-8 h-8 text-yellow-500" />;
        if (mimeType === 'application/pdf') return <FileText className="w-8 h-8 text-red-600" />;
        return <FileIcon className="w-8 h-8 text-gray-500" />;
    };

    if (folders.length === 0 && files.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Folder className="w-16 h-16 mb-4 opacity-20" />
                <p>This folder is empty</p>
            </div>
        );
    }

    if (viewMode === 'list') {
        return (
            <div className="w-full">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-gray-100 text-sm font-medium text-gray-500">
                    <div className="col-span-6">Name</div>
                    <div className="col-span-2">Size</div>
                    <div className="col-span-3">Date Modified</div>
                    <div className="col-span-1"></div>
                </div>
                <div className="divide-y divide-gray-50">
                    {folders.map((folder) => (
                        <div
                            key={folder._id}
                            className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 items-center cursor-pointer group transition-colors"
                            onClick={() => onFolderClick(folder)}
                        >
                            <div className="col-span-6 flex items-center gap-3">
                                <Folder className="w-5 h-5 text-blue-500 fill-blue-500/20" />
                                <span className="text-gray-900 font-medium">{folder.name}</span>
                            </div>
                            <div className="col-span-2 text-sm text-gray-500">-</div>
                            <div className="col-span-3 text-sm text-gray-500">
                                {new Date(folder.updatedAt).toLocaleDateString()}
                            </div>
                            <div className="col-span-1 flex justify-end opacity-0 group-hover:opacity-100">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder._id); }}
                                    className="p-1 hover:bg-gray-200 rounded text-red-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {files.map((file) => (
                        <div
                            key={file._id}
                            className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 items-center cursor-pointer group transition-colors"
                            onClick={() => onFileClick(file)}
                        >
                            <div className="col-span-6 flex items-center gap-3">
                                {getFileIcon(file.mimeType)}
                                <span className="text-gray-900 truncate">{file.name}</span>
                            </div>
                            <div className="col-span-2 text-sm text-gray-500">{formatSize(file.size)}</div>
                            <div className="col-span-3 text-sm text-gray-500">
                                {new Date(file.updatedAt).toLocaleDateString()}
                            </div>
                            <div className="col-span-1 flex justify-end opacity-0 group-hover:opacity-100 gap-2">
                                <a
                                    href={`http://localhost:3000${file.url}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-1 hover:bg-gray-200 rounded text-blue-500"
                                >
                                    <Download className="w-4 h-4" />
                                </a>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteFile(file._id); }}
                                    className="p-1 hover:bg-gray-200 rounded text-red-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {folders.map((folder) => (
                <div
                    key={folder._id}
                    onClick={() => onFolderClick(folder)}
                    className="group relative p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all cursor-pointer hover:border-blue-100"
                >
                    <div className="flex flex-col items-center text-center gap-3">
                        <Folder className="w-12 h-12 text-blue-500 fill-blue-500/10 group-hover:scale-110 transition-transform" />
                        <div className="w-full">
                            <h3 className="font-medium text-gray-900 truncate text-sm" title={folder.name}>{folder.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">{new Date(folder.updatedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder._id); }}
                        className="absolute top-2 right-2 p-1.5 bg-white shadow-sm rounded-full text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            ))}

            {files.map((file) => (
                <div
                    key={file._id}
                    onClick={() => onFileClick(file)}
                    className="group relative p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all cursor-pointer hover:border-blue-100"
                >
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="group-hover:scale-110 transition-transform">
                            {getFileIcon(file.mimeType)}
                        </div>
                        <div className="w-full">
                            <h3 className="font-medium text-gray-900 truncate text-sm" title={file.name}>{file.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">{formatSize(file.size)}</p>
                        </div>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <a
                            href={`http://localhost:3000${file.url}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 bg-white shadow-sm rounded-full text-blue-500 hover:bg-blue-50"
                        >
                            <Download className="w-3.5 h-3.5" />
                        </a>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDeleteFile(file._id); }}
                            className="p-1.5 bg-white shadow-sm rounded-full text-red-500 hover:bg-red-50"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FileList;
