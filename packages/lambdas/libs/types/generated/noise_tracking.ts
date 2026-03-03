// This file was auto-generated from OpenAPI specs. Do not edit manually.

export interface paths {
    "/noise_tracking/items": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header: {
                    /** @description Project ID for multi-tenancy data isolation */
                    "X-Project-ID": components["parameters"]["ProjectIDHeader"];
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Noise tracking items retrieved */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["noiseTrackingItem"][];
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header: {
                    /** @description Project ID for multi-tenancy data isolation */
                    "X-Project-ID": components["parameters"]["ProjectIDHeader"];
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Noise tracking item added successfully */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Error adding noise tracking item */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        post?: never;
        delete?: never;
        options: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description 200 response */
                200: {
                    headers: {
                        "Access-Control-Allow-Origin"?: string;
                        "Access-Control-Allow-Methods"?: string;
                        "Access-Control-Allow-Headers"?: string;
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/noise_tracking/items/{timestamp}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header: {
                    /** @description Project ID for multi-tenancy data isolation */
                    "X-Project-ID": components["parameters"]["ProjectIDHeader"];
                };
                path: {
                    /**
                     * @description Timestamp of the noise tracking item to be removed
                     * @example 1714003200000
                     */
                    timestamp: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Noise tracking item removed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Noise tracking item does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /**
                     * @description Timestamp of the noise tracking item to be removed
                     * @example 1714003200000
                     */
                    timestamp: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description 200 response */
                200: {
                    headers: {
                        "Access-Control-Allow-Origin"?: string;
                        "Access-Control-Allow-Methods"?: string;
                        "Access-Control-Allow-Headers"?: string;
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** Noise Tracking Item */
        noiseTrackingItem: {
            timestamp: number;
        };
    };
    responses: never;
    parameters: {
        /** @description Project ID for multi-tenancy data isolation */
        ProjectIDHeader: string;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
