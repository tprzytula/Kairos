import { Handler } from "aws-lambda";
import { middleware } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { runMigrations } from "./runner";
import { getLastExecutedMigration } from "./tracker";

import migration001 from "./migrations/001_add_grocery_defaults";
import migration002 from "./migrations/002_add_more_grocery_defaults";

export const handler: Handler = middleware(async (event) => {
  console.log("Starting database migrations...");

  try {
    const migrations = [
      migration001,
      migration002,
    ];
    
    console.log(`Loaded ${migrations.length} embedded migrations`);
    
    if (migrations.length === 0) {
      console.log("No migrations found");
      return createResponse({
        statusCode: 200,
        message: {
          success: true,
          message: "No migrations to execute",
          results: [],
        },
      });
    }

    const results = await runMigrations(migrations);

    const failed = results.filter(r => r.status === 'failed');
    const success = results.filter(r => r.status === 'success');
    const skipped = results.filter(r => r.status === 'skipped');

    const lastMigration = await getLastExecutedMigration();

    const response = {
      success: failed.length === 0,
      message: `Migrations completed. Success: ${success.length}, Skipped: ${skipped.length}, Failed: ${failed.length}`,
      results,
      lastMigration,
      summary: {
        total: results.length,
        success: success.length,
        skipped: skipped.length,
        failed: failed.length,
      },
    };

    console.log("Migration run summary:", response.summary);

    return createResponse({
      statusCode: failed.length === 0 ? 200 : 500,
      message: response,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Failed to run migrations:", errorMessage);

    return createResponse({
      statusCode: 500,
      message: {
        success: false,
        message: "Failed to run migrations",
        error: errorMessage,
      },
    });
  }
});