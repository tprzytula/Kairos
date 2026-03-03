// This file was auto-generated from OpenAPI specs. Do not edit manually.

export interface paths {
    "/grocery_list/items": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Optional shop ID to filter grocery items
                     * @example shop-123
                     */
                    shopId?: string;
                };
                header: {
                    /** @description Project ID for multi-tenancy data isolation */
                    "X-Project-ID": components["parameters"]["ProjectIDHeader"];
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Grocery list items retrieved */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["details"][];
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
                    "application/json": components["schemas"]["details"];
                };
            };
            responses: {
                /** @description Grocery item added successfully */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["details"];
                    };
                };
                /** @description Incorrect grocery item details */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        post?: never;
        delete: {
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
                /** @description Grocery items removed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Incorrect grocery item details */
                400: {
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
    "/grocery_list/items/{id}": {
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
                     * @description Identifier of the item to be removed
                     * @example c8aef3a0-ead3-4e64-b9ce-4ece324720fb
                     */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Item removed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Item does not exist */
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
                     * @description Identifier of the item to be removed
                     * @example c8aef3a0-ead3-4e64-b9ce-4ece324720fb
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
                     * @description Identifier of the item to be updated
                     * @example c8aef3a0-ead3-4e64-b9ce-4ece324720fb
                     */
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @example c8aef3a0-ead3-4e64-b9ce-4ece324720fb */
                        id: string;
                        /** @example Organic Apples */
                        name?: string;
                        /** @example 5 */
                        quantity?: string;
                        /** @example kg */
                        unit?: string;
                        /** @example shop-123 */
                        shopId?: string;
                        /** @example /images/apples.png */
                        imagePath?: string;
                    };
                };
            };
            responses: {
                /** @description Item updated successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example c8aef3a0-ead3-4e64-b9ce-4ece324720fb */
                            id?: string;
                            /** @example Organic Apples */
                            name?: string;
                            /** @example 5 */
                            quantity?: string;
                            /** @example kg */
                            unit?: string;
                            /** @example shop-123 */
                            shopId?: string;
                            /** @example /images/apples.png */
                            imagePath?: string;
                        };
                    };
                };
                /** @description Incorrect item details */
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
    "/grocery_list/items_defaults": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Grocery items defaults retrieved */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["groceryItemsDefaults"][];
                    };
                };
            };
        };
        put?: never;
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
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** Grocery Item Details */
        details: {
            /** @example 123123 */
            id?: string;
            /** @example Paper Towel */
            name: string;
            /** @example 5 */
            quantity: number;
            /** @example kg */
            unit: string;
            /** @example shop-123 */
            shopId: string;
            /** @example /images/paper-towel.png */
            imagePath?: string;
            /** @example household */
            category?: string;
        };
        /** Grocery Items Defaults */
        groceryItemsDefaults: {
            name: string;
            unit?: string;
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
