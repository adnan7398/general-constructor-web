export interface FileItem {
    _id: string;
    name: string;
    originalName: string;
    project: string;
    folder: string | null;
    url: string;
    size: number;
    mimeType: string;
    createdAt: string;
    updatedAt: string;
}

export interface FolderItem {
    _id: string;
    name: string;
    project: string;
    parent: string | null;
    path: string;
    createdAt: string;
    updatedAt: string;
}

export interface BreadcrumbItem {
    id: string;
    name: string;
}
