// node fetch module is loaded to be able to make use of fetch function
import axios, { AxiosResponse } from 'axios';
import { ProjectResponse } from './models/project-response';

const organizationId = process.env["SNYK_ORG_ID"]
const apiToken = process.env["SNYK_API_TOKEN"]
const keepProjectBranchName = "master"
const keepProjectLastTestedWithinDays = 10;

const instance = axios.create({
    baseURL: 'https://snyk.io/api/v1/org/' + organizationId + '/',
    timeout: 15000,
    headers: {
        Authorization: "token " + apiToken
    }
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => instance.get(url).then(responseBody),
    post: (url: string, body: {}) => instance.post(url, body).then(responseBody),
    put: (url: string, body: {}) => instance.put(url, body).then(responseBody),
    delete: (url: string) => instance.delete(url).then(responseBody),
};

const Projects = {
    getProjects: (): Promise<ProjectResponse> => requests.post('projects', body),
    deleteProject: (id: string): Promise<void> => requests.delete(`project/${id}`)
};

const body = {
    "filters": {
    }
}

Projects.getProjects()
    .then((data) => {
        data.projects.forEach(function (project) {
            if (project.branch != null &&
                project.branch != keepProjectBranchName) {
                //const projectTestDateLimit = new Date().UTC();
                const projectLastTestedDate = new Date(project.lastTestedDate)
                var now = new Date;
                now.setDate(now.getDate() - keepProjectLastTestedWithinDays)
                var project_utc_timestamp = Date.UTC(projectLastTestedDate.getUTCFullYear(), projectLastTestedDate.getUTCMonth(), projectLastTestedDate.getUTCDate(),
                    projectLastTestedDate.getUTCHours(), projectLastTestedDate.getUTCMinutes(), projectLastTestedDate.getUTCSeconds(), projectLastTestedDate.getUTCMilliseconds());
                var limit_utc_timestamp = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
                    now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
                //projectTestDateLimit.setDate(project_utc_timestamp.getDate() - keepProjectLastTestedWithinDays);
                console.log("project last tested date: " + project_utc_timestamp);
                console.log("project date limit: " + limit_utc_timestamp);

                if (project_utc_timestamp < limit_utc_timestamp) {
                    console.log("project to be deleted: " + project.name);
                    Projects.deleteProject(project.id);
                }
            }
        })
        //console.log(data)
    })
    .catch(console.error)