import SwiftUI
import UIKit

/// Brand palette. Kept deliberately small — the rest of the UI uses semantic
/// system colors (`.label`, `.systemBackground`, etc.) so the app inherits
/// dark-mode + Dynamic-Type + accessibility behaviour for free.
extension Color {
    /// Primary accent color. Slightly lighter shade in dark mode for legibility
    /// against a dark background.
    static let brandPrimary = Color(uiColor: UIColor { traits in
        traits.userInterfaceStyle == .dark
            ? UIColor(red: 0.55, green: 0.60, blue: 0.95, alpha: 1) // ≈ #8C99F2 — softer, on dark
            : UIColor(red: 0.40, green: 0.49, blue: 0.92, alpha: 1) // ≈ #667EEA — original brand
    })
}

extension Color {
    /// Convenience initializer accepting a 24-bit RGB value (`0xRRGGBB`).
    init(hex: UInt32, opacity: Double = 1) {
        let red = Double((hex >> 16) & 0xFF) / 255
        let green = Double((hex >> 8) & 0xFF) / 255
        let blue = Double(hex & 0xFF) / 255
        self.init(.sRGB, red: red, green: green, blue: blue, opacity: opacity)
    }
}
