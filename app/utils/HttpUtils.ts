import type { AxiosResponse } from "axios";

import axios, { AxiosError } from "axios";

export default class HttpService {
    async get<T>(
        baseURL: string,
        endPoint?: string,
        params?: { [key: string]: any },
        headers?: { [key: string]: any },
    ): Promise<AxiosResponse<T>> {
        const url = endPoint ? baseURL.concat(endPoint) : baseURL;
        const options = { params, headers };

        return axios.get<T>(url, options);
    }

    async post<T>(
        baseURL: string,
        endPoint?: string,
        body?: any,
        params?: { [key: string]: any },
        headers?: { [key: string]: any },
        asFormEncoded?: boolean,
    ): Promise<AxiosResponse<T>> {
        const url = endPoint ? baseURL.concat(endPoint) : baseURL;
        const options = { params, headers };

        if (asFormEncoded && body) {
            const bodyParams = new URLSearchParams();
            for (const b of Object.keys(body)) {
                bodyParams.append(b, body[b]);
            }
            body = bodyParams;
        }

        return axios.post<T>(url, body, options);
    }

    async getMany(
        baseURL: string,
        endpoint?: string,
        paramMaps?: { [key: string]: any }[],
        headers?: { [key: string]: any },
    ): Promise<AxiosResponse[]> {
        const tasks: any[] = [];
        for (const params of paramMaps || []) {
            tasks.push(this.get(baseURL, endpoint, params, headers));
        }
        return axios
            .all(tasks)
            .then(responses => responses.map(resp => resp.data.data || []));
    }

    async retryHttpPostMechanism<T>(MAX_RETRIES: number, baseURL: string, endPoint?: string, body?: any, params?: { [key: string]: any }, headers?: { [key: string]: any }, asFormEncoded?: boolean): Promise<AxiosResponse<T> | undefined> {
        let currentIteration = 1;
        while (currentIteration <= MAX_RETRIES) {
            await sleep(2000);
            try {
                const response = await this.post<T>(baseURL, endPoint, body, params, headers, asFormEncoded);
                return response;
            }
            catch (error) {
                currentIteration++;
            }
        }

        return undefined;
    }
}
