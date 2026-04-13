import Foundation
import Testing
@testable import Kairos

/// Verifies every `Endpoint` case produces the path documented in
/// `docs/ios-rewrite/api-reference.md`. If you change a path here, change it
/// there too — and vice-versa.
@Suite("Given the Endpoint enum")
struct EndpointTests {
    // MARK: Shops
    @Test func shopsPath() {
        #expect(Endpoint.shops.path == "shops")
    }
    @Test func shopByIdPath() {
        #expect(Endpoint.shop(id: "abc").path == "shops/abc")
    }
    @Test func shopsUploadUrlPath() {
        #expect(Endpoint.shopsUploadUrl(fileExtension: "jpg").path == "shops/upload-url")
    }
    @Test func shopsUploadUrlQueryItem() {
        #expect(Endpoint.shopsUploadUrl(fileExtension: "jpg").queryItems == [URLQueryItem(name: "extension", value: "jpg")])
    }

    // MARK: Grocery items
    @Test func groceryItemsPath() {
        #expect(Endpoint.groceryItems(shopId: nil).path == "grocery_list/items")
    }
    @Test func groceryItemsWithShopFilter() {
        #expect(Endpoint.groceryItems(shopId: "shop-1").queryItems == [URLQueryItem(name: "shopId", value: "shop-1")])
    }
    @Test func groceryItemByIdPath() {
        #expect(Endpoint.groceryItem(id: "g1").path == "grocery_list/items/g1")
    }

    // MARK: Grocery item defaults (path keyed by name)
    @Test func groceryItemDefaultsPath() {
        #expect(Endpoint.groceryItemDefaults.path == "grocery_list/items_defaults")
    }
    @Test func groceryItemDefaultByNameEncodesPathSegment() {
        // Names with spaces / reserved chars must be percent-encoded.
        #expect(Endpoint.groceryItemDefault(name: "olive oil").path == "grocery_list/items_defaults/olive%20oil")
    }

    // MARK: To-do items
    @Test func todoItemsPath() {
        #expect(Endpoint.todoItems.path == "todo_list/items")
    }
    @Test func todoItemByIdPath() {
        #expect(Endpoint.todoItem(id: "t1").path == "todo_list/items/t1")
    }

    // MARK: Recipes
    @Test func recipesPath() {
        #expect(Endpoint.recipes.path == "recipes")
    }
    @Test func recipeByIdPath() {
        #expect(Endpoint.recipe(id: "r1").path == "recipes/r1")
    }

    // MARK: Meal plans (note: hyphen not underscore)
    @Test func mealPlansPath() {
        #expect(Endpoint.mealPlans.path == "meal-plans")
    }

    // MARK: Adventures
    @Test func adventuresPath() {
        #expect(Endpoint.adventures.path == "adventures")
    }

    // MARK: Birthdays
    @Test func birthdaysPath() {
        #expect(Endpoint.birthdays.path == "birthdays/items")
    }
    @Test func birthdayByIdPath() {
        #expect(Endpoint.birthday(id: "b1").path == "birthdays/items/b1")
    }

    // MARK: Noise tracking — delete uses {timestamp}
    @Test func noiseTrackingItemsPath() {
        #expect(Endpoint.noiseTrackingItems.path == "noise_tracking/items")
    }
    @Test func noiseTrackingItemUsesTimestampPathParam() {
        #expect(Endpoint.noiseTrackingItem(timestamp: 1710500000000).path == "noise_tracking/items/1710500000000")
    }

    // MARK: Office attendance (hyphen)
    @Test func officeAttendancePath() {
        #expect(Endpoint.officeAttendance.path == "office-attendance")
    }

    // MARK: Projects
    @Test func projectsPath() {
        #expect(Endpoint.projects.path == "projects")
    }
    @Test func joinProjectPath() {
        #expect(Endpoint.joinProject.path == "projects/join")
    }
    @Test func projectInvitePath() {
        #expect(Endpoint.projectInvite(code: "ABC123").path == "projects/invite/ABC123")
    }
    @Test func projectMembersPath() {
        #expect(Endpoint.projectMembers.path == "projects/members")
    }
    @Test func projectMemberByIdPath() {
        #expect(Endpoint.projectMember(userId: "u1").path == "projects/members/u1")
    }

    // MARK: User preferences
    @Test func userPreferencesPath() {
        #expect(Endpoint.userPreferences.path == "user/preferences")
    }

    // MARK: Push subscriptions
    @Test func pushSubscriptionsPath() {
        #expect(Endpoint.pushSubscriptions.path == "push-subscriptions")
    }
    @Test func pushSubscriptionByEndpointAttachesQueryItem() {
        let endpoint = Endpoint.pushSubscriptionByEndpoint(endpoint: "https://example.com/sub")
        #expect(endpoint.path == "push-subscriptions")
        #expect(endpoint.queryItems == [URLQueryItem(name: "endpoint", value: "https://example.com/sub")])
    }
}
