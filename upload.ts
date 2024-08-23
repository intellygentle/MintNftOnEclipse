import {
    GenericFile,
    request,
    HttpInterface,
    HttpRequest,
    HttpResponse,
} from '@metaplex-foundation/umi';

interface IpfsUploadResponse {
    Name: string;
    Hash: string;  // This is the CID
    Size: string;
}

const createLocalIpfsFetch = (): HttpInterface => ({
    send: async <ResponseData, RequestData = unknown>(
        request: HttpRequest<RequestData>
    ): Promise<HttpResponse<ResponseData>> => {
        const headers = new Headers(
            Object.entries(request.headers).map(([name, value]) => [name, value] as [string, string])
        );

        const isJsonRequest = headers.get('content-type')?.includes('application/json') ?? false;
        const body = isJsonRequest && request.data ? JSON.stringify(request.data) : request.data as string | undefined;

        try {
            const response = await fetch(request.url, {
                method: request.method,
                headers,
                body,
                redirect: 'follow',
                signal: request.signal as AbortSignal,
            });

            const bodyText = await response.text();
            const isJsonResponse = response.headers.get('content-type')?.includes('application/json');
            const data = isJsonResponse ? JSON.parse(bodyText) : bodyText;

            return {
                data,
                body: bodyText,
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
            };
        } catch (error) {
            console.error('Fetch request failed:', error);
            throw error;
        }
    },
});

export const uploadToIpfs = async (file: GenericFile): Promise<string> => {
    const http = createLocalIpfsFetch();
    const endpoint = 'http://127.0.0.1:5001/api/v0/add';
    const formData = new FormData();

    const fileBlob = new Blob([file.buffer], { type: file.contentType || 'application/octet-stream' });
    formData.append('file', fileBlob);

    const ipfsRequest = request()
        .withEndpoint('POST', endpoint)
        .withData(formData);

    try {
        const response = await http.send<IpfsUploadResponse, FormData>(ipfsRequest);
        if (!response.ok) throw new Error(`${response.status} - Failed to send request: ${response.statusText}`);
        return `http://127.0.0.1:8080/ipfs/${response.data.Hash}`;
    } catch (error) {
        console.error('Failed to send request:', error);
        throw error;
    }
};

