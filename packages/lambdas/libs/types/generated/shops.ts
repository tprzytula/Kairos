// This file was auto-generated from OpenAPI specs. Do not edit manually.

export interface paths {
    "/shops": {
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
                /** @description Shops retrieved */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["shop"][];
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
            requestBody: {
                content: {
                    "application/json": components["schemas"]["createShopRequest"];
                };
            };
            responses: {
                /** @description Shop created successfully */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example shop-123 */
                            id?: string;
                        };
                    };
                };
                /** @description Incorrect shop details */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Shop name already exists */
                409: {
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
    "/shops/{id}": {
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
                     * @description Identifier of the shop to be removed
                     * @example shop-123
                     */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Shop removed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Invalid shop ID */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Shop does not exist */
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
                     * @description Identifier of the shop
                     * @example shop-123
                     */
                    id: string;
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
        patch: {
            parameters: {
                query?: never;
                header: {
                    /** @description Project ID for multi-tenancy data isolation */
                    "X-Project-ID": components["parameters"]["ProjectIDHeader"];
                };
                path: {
                    /**
                     * @description Identifier of the shop to be updated
                     * @example shop-123
                     */
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["updateShopRequest"];
                };
            };
            responses: {
                /** @description Shop updated successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["updateShopRequest"];
                    };
                };
                /** @description Incorrect shop details */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** Shop Details */
        shop: {
            /** @example shop-123 */
            id: string;
            /** @example project-456 */
            projectId: string;
            /** @example Grocery Store */
            name: string;
            /** @example /assets/icons/generic-grocery-item.png */
            icon?: string;
            /**
             * Format: date-time
             * @example 2024-01-01T00:00:00Z
             */
            createdAt: string;
            /**
             * Format: date-time
             * @example 2024-01-01T00:00:00Z
             */
            updatedAt: string;
        };
        /** Create Shop Request */
        createShopRequest: {
            /** @example Chinese Market */
            name: string;
            /** @example /assets/icons/shop.png */
            icon?: string;
        };
        /** Update Shop Request */
        updateShopRequest: {
            /** @example shop-123 */
            id: string;
            /** @example Updated Shop Name */
            name?: string;
            /** @example /assets/icons/updated-shop.png */
            icon?: string;
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
