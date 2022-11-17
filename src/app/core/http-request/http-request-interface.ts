export interface HttpRequestOption {
    url: string;
    icdCodeUrl?: string;
    endpoint: string;
    data: object;
    header?: object;
    async?: boolean;
    queryParams?: string;
    inSecured?: boolean;
    multipart?: boolean;
    assignee?: string;
}

export interface HttpRequestBody {
    option: HttpRequestOption;
    log: string;
    error: string;
    method: string;
}
