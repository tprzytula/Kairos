import SwiftUI

/// Bottom sheet shown when the user taps their avatar/settings button. Mirrors
/// the web "user menu" drawer: shows the current project, offers a project
/// switcher, and ends with sign-out. Project management and settings surface
/// here in later phases (8a, 8b).
struct UserMenuView: View {
    @Environment(AuthStore.self) private var authStore
    @Environment(ProjectStore.self) private var projectStore
    @Environment(\.dismiss) private var dismiss

    @State private var isShowingProjectSwitcher = false

    var body: some View {
        NavigationStack {
            List {
                Section("Current project") {
                    CurrentProjectRow(project: projectStore.currentProject)
                        .contentShape(Rectangle())
                        .onTapGesture {
                            HapticFeedback.impact(.light)
                            isShowingProjectSwitcher = true
                        }
                }

                Section {
                    Button(role: .destructive) {
                        HapticFeedback.impact(.medium)
                        Task {
                            await authStore.signOut()
                            dismiss()
                        }
                    } label: {
                        Label("Sign out", systemImage: "rectangle.portrait.and.arrow.right")
                    }
                }
            }
            .navigationTitle("Account")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
            .sheet(isPresented: $isShowingProjectSwitcher) {
                ProjectSwitcherView()
            }
        }
    }
}

private struct CurrentProjectRow: View {
    let project: Project?

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: (project?.isPersonal ?? true) ? "person.crop.circle.fill" : "person.2.circle.fill")
                .font(.title2)
                .foregroundStyle(Color.brandPrimary)
                .frame(width: 28)

            VStack(alignment: .leading, spacing: 2) {
                Text(project?.name ?? "No project")
                    .font(.body.weight(.medium))
                    .foregroundStyle(Color(.label))

                Text(subtitle)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            Image(systemName: "chevron.right")
                .font(.footnote.weight(.semibold))
                .foregroundStyle(.tertiary)
        }
        .padding(.vertical, 4)
        .accessibilityElement(children: .combine)
        .accessibilityHint("Tap to switch project")
    }

    private var subtitle: String {
        guard let project else { return "Select a project" }
        return project.isPersonal ? "Personal" : "Shared"
    }
}
