// This file was auto-generated from OpenAPI specs. Do not edit manually.

export interface paths {
    "/todo_list/items": {
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
                /** @description Todo items retrieved */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["todoItem"][];
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
                    "application/json": components["schemas"]["todoItem"];
                };
            };
            responses: {
                /** @description Todo item added successfully */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Error adding todo item */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        post: {
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
                    "application/json": {
                        items: components["schemas"]["todoItemUpdate"][];
                    };
                };
            };
            responses: {
                /** @description Todo items updated */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["todoItem"][];
                    };
                };
                /** @description Invalid request body */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Error updating todo items */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
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
                /** @description Todo item removed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Todo item does not exist */
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
    "/todo_list/items/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /**
                     * @description Identifier of the todo item
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
                header?: never;
                path: {
                    /**
                     * @description Identifier of the todo item to be updated
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
                        /** @example Complete project documentation */
                        name?: string;
                        /** @example Finish writing the user guide and API documentation */
                        description?: string;
                        /** @example 1672531200 */
                        dueDate?: number;
                        /** @example false */
                        isDone?: boolean;
                    };
                };
            };
            responses: {
                /** @description Todo item updated successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example c8aef3a0-ead3-4e64-b9ce-4ece324720fb */
                            id?: string;
                            /** @example Complete project documentation */
                            name?: string;
                            /** @example Finish writing the user guide and API documentation */
                            description?: string;
                            /** @example 1672531200 */
                            dueDate?: number;
                            /** @example false */
                            isDone?: boolean;
                        };
                    };
                };
                /** @description Incorrect todo item details */
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
        /** Todo Item */
        todoItem: {
            id?: string;
            name?: string;
            description?: string;
            dueDate?: number;
            isDone?: boolean;
        };
        /** Todo Item Update */
        todoItemUpdate: {
            id: string;
            isDone: boolean;
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
