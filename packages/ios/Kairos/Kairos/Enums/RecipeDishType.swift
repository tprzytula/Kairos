import Foundation

/// Mirrors `packages/shared/enums/recipeDishType.ts`.
enum RecipeDishType: String, Codable, CaseIterable, Sendable {
    case pasta = "pasta"
    case soup = "soup"
    case salad = "salad"
    case bakedGoods = "baked_goods"
    case rice = "rice"
    case stew = "stew"
    case stirFry = "stir_fry"
    case sandwich = "sandwich"
}
