// This file was auto-generated from OpenAPI specs. Do not edit manually.

export interface paths {
    "/push-subscriptions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Save a push notification subscription */
        post: operations["savePushSubscription"];
        /** Delete a push notification subscription */
        delete: operations["deletePushSubscription"];
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
        SavePushSubscriptionRequest: {
            /**
             * @description Push subscription endpoint URL
             * @example https://fcm.googleapis.com/fcm/send/example-endpoint
             */
            endpoint: string;
            keys: {
                /**
                 * @description P256DH key for push encryption
                 * @example BNbN3yWjlBSTiZE
                 */
                p256dh: string;
                /**
                 * @description Auth key for push encryption
                 * @example k8JV6sjdbajsbdj
                 */
                auth: string;
            };
        };
        SavePushSubscriptionResponse: {
            /** @example true */
            success?: boolean;
        };
        DeletePushSubscriptionResponse: {
            /** @example true */
            success?: boolean;
        };
        ErrorResponse: {
            error?: {
                /** @description Human-readable error message */
                message?: string;
                /** @description Error type identifier */
                type?: string;
            };
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    savePushSubscription: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "endpoint": "https://fcm.googleapis.com/fcm/send/example-endpoint",
                 *       "keys": {
                 *         "p256dh": "BNbN3yWjlBSTiZE",
                 *         "auth": "k8JV6sjdbajsbdj"
                 *       }
                 *     }
                 */
                "application/json": components["schemas"]["SavePushSubscriptionRequest"];
            };
        };
        responses: {
            /** @description Push subscription saved successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true
                     *     }
                     */
                    "application/json": components["schemas"]["SavePushSubscriptionResponse"];
                };
            };
            /** @description Bad request - invalid request body or missing fields */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "error": {
                     *         "message": "Missing required subscription fields",
                     *         "type": "BAD_REQUEST"
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Unauthorized - user authentication required */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "error": {
                     *         "message": "User authentication required",
                     *         "type": "UNAUTHORIZED"
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Internal server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "error": {
                     *         "message": "Failed to save push subscription",
                     *         "type": "INTERNAL_SERVER_ERROR"
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    deletePushSubscription: {
        parameters: {
            query: {
                /**
                 * @description URL-encoded push subscription endpoint
                 * @example https%3A//fcm.googleapis.com/fcm/send/example-endpoint
                 */
                endpoint: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Push subscription deleted successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true
                     *     }
                     */
                    "application/json": components["schemas"]["DeletePushSubscriptionResponse"];
                };
            };
            /** @description Bad request - missing endpoint parameter */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "error": {
                     *         "message": "Missing endpoint parameter",
                     *         "type": "BAD_REQUEST"
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Unauthorized - user authentication required */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "error": {
                     *         "message": "User authentication required",
                     *         "type": "UNAUTHORIZED"
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Internal server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "error": {
                     *         "message": "Failed to delete push subscription",
                     *         "type": "INTERNAL_SERVER_ERROR"
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
}
