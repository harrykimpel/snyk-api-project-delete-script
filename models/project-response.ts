export interface ProjectResponse {
    org: Organisation[];
    projects: Project[];
}

export interface Organisation {
    name: string;
    id: string;
}

export interface Project {
    name: string;
    id: string;
    lastTestedDate: Date;
    branch: string;
}