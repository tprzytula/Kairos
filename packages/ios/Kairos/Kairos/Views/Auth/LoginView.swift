import SwiftUI

/// Sign-in screen. Edge-to-edge minimal layout following modern iOS conventions:
/// brand mark + product name + tagline at top, sign-in actions at bottom, legal
/// footer below. No card chrome, no marketing copy — those belong in onboarding.
///
/// Accessibility: every text element uses semantic fonts so Dynamic Type works,
/// every color uses semantic system colors so dark mode adapts, and the brand
/// mark carries an explicit VoiceOver label rather than reading "hourglass".
struct LoginView: View {
    @Environment(AuthStore.self) private var authStore
    @Environment(\.colorScheme) private var colorScheme

    var body: some View {
        VStack(spacing: 0) {
            Spacer(minLength: 24)

            BrandMark()
                .padding(.horizontal, 24)

            Spacer(minLength: 24)

            VStack(spacing: 12) {
                AppleSignInButton(scheme: colorScheme) {
                    HapticFeedback.impact(.medium)
                    Task { await authStore.signInWithApple() }
                }
                .frame(height: 50)

                GoogleSignInButton {
                    HapticFeedback.impact(.medium)
                    Task { await authStore.signIn() }
                }

                ErrorMessage()
                    .padding(.top, 4)
            }
            .padding(.horizontal, 24)

            LegalFooter()
                .padding(.horizontal, 32)
                .padding(.top, 24)
                .padding(.bottom, 8)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(.systemBackground))
    }
}

// MARK: - Brand mark + tagline

private struct BrandMark: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "hourglass")
                .font(.system(size: 56, weight: .semibold))
                .foregroundStyle(Color.brandPrimary)
                .accessibilityLabel("Kairos logo")

            VStack(spacing: 8) {
                Text("Kairos")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundStyle(Color(.label))
                    .accessibilityAddTraits(.isHeader)

                Text("Plan with intent.")
                    .font(.body)
                    .foregroundStyle(Color(.secondaryLabel))
            }
        }
    }
}

// MARK: - Apple sign-in

private struct AppleSignInButton: View {
    let scheme: ColorScheme
    let action: () -> Void

    var body: some View {
        // We use a custom Button rather than `SignInWithAppleButton` so the tap
        // can be intercepted before the Apple sheet appears — the backend is
        // not yet wired up (see AuthStore.signInWithApple). Once Cognito has
        // Apple as an IdP, swap this for the real `SignInWithAppleButton`.
        Button(action: action) {
            HStack(spacing: 8) {
                Image(systemName: "applelogo")
                    .font(.system(size: 18, weight: .medium))
                Text("Sign in with Apple")
                    .font(.body.weight(.semibold))
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .foregroundStyle(scheme == .dark ? Color.black : Color.white)
            .background(scheme == .dark ? Color.white : Color.black)
            .clipShape(Capsule())
        }
        .buttonStyle(DimmedPressStyle())
    }
}

// MARK: - Google sign-in

private struct GoogleSignInButton: View {
    @Environment(AuthStore.self) private var authStore
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                Image("GoogleLogo")
                    .resizable()
                    .renderingMode(.original)
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 18, height: 18)

                Text(authStore.isLoading ? "Signing in…" : "Continue with Google")
                    .font(.body.weight(.semibold))
                    .foregroundStyle(Color(.label))

                if authStore.isLoading {
                    ProgressView()
                        .controlSize(.small)
                }
            }
            .frame(maxWidth: .infinity, minHeight: 50)
            .background(Color(.secondarySystemBackground))
            .overlay(
                Capsule()
                    .strokeBorder(Color(.separator), lineWidth: 0.5)
            )
            .clipShape(Capsule())
        }
        .buttonStyle(DimmedPressStyle())
        .disabled(authStore.isLoading)
        .accessibilityLabel("Continue with Google")
    }
}

// MARK: - Error message

private struct ErrorMessage: View {
    @Environment(AuthStore.self) private var authStore

    var body: some View {
        if authStore.isError, let message = authStore.lastErrorMessage {
            Text(message)
                .font(.footnote)
                .foregroundStyle(.red)
                .multilineTextAlignment(.center)
                .accessibilityAddTraits(.updatesFrequently)
        }
    }
}

// MARK: - Legal footer

private struct LegalFooter: View {
    var body: some View {
        Text("By continuing you agree to our Terms and Privacy Policy.")
            .font(.caption)
            .foregroundStyle(Color(.tertiaryLabel))
            .multilineTextAlignment(.center)
            .fixedSize(horizontal: false, vertical: true)
    }
}

// MARK: - Press style

/// Native iOS press feedback — opacity dim instead of scale-down, which feels
/// off-platform.
private struct DimmedPressStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .opacity(configuration.isPressed ? 0.7 : 1)
            .animation(.easeOut(duration: 0.12), value: configuration.isPressed)
    }
}

