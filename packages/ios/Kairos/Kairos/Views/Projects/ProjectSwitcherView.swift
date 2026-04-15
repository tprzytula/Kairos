import SwiftUI

/// Lists the user's projects. Tapping a row switches the active project via
/// `ProjectStore.switchProject(to:)` and dismisses the sheet. Mirrors the
/// project-switch entry point in the web user menu.
struct ProjectSwitcherView: View {
    @Environment(ProjectStore.self) private var projectStore
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            List {
                if projectStore.isLoading && projectStore.projects.isEmpty {
                    HStack {
                        Spacer()
                        ProgressView()
                        Spacer()
                    }
                    .listRowSeparator(.hidden)
                } else if projectStore.projects.isEmpty {
                    emptyState
                } else {
                    ForEach(projectStore.projects) { project in
                        ProjectRow(
                            project: project,
                            isActive: projectStore.currentProject?.id == project.id
                        )
                        .contentShape(Rectangle())
                        .onTapGesture {
                            HapticFeedback.impact(.light)
                            Task {
                                await projectStore.switchProject(to: project.id)
                                dismiss()
                            }
                        }
                    }
                }
            }
            .listStyle(.insetGrouped)
            .navigationTitle("Projects")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }

    @ViewBuilder
    private var emptyState: some View {
        VStack(spacing: 12) {
            Image(systemName: "folder")
                .font(.system(size: 40))
                .foregroundStyle(.tertiary)
            Text("No projects yet")
                .font(.headline)
            Text("Your personal project is created on first sign-in.")
                .font(.footnote)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 32)
        .listRowBackground(Color.clear)
        .listRowSeparator(.hidden)
    }
}

private struct ProjectRow: View {
    let project: Project
    let isActive: Bool

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: project.isPersonal ? "person.crop.circle.fill" : "person.2.circle.fill")
                .font(.title2)
                .foregroundStyle(Color.brandPrimary)
                .frame(width: 28)

            VStack(alignment: .leading, spacing: 2) {
                Text(project.name)
                    .font(.body.weight(.medium))
                    .foregroundStyle(Color(.label))
                Text(project.isPersonal ? "Personal" : "Shared · code \(project.inviteCode)")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            if isActive {
                Image(systemName: "checkmark")
                    .font(.body.weight(.semibold))
                    .foregroundStyle(Color.brandPrimary)
                    .accessibilityLabel("Active project")
            }
        }
        .padding(.vertical, 4)
        .accessibilityElement(children: .combine)
        .accessibilityHint(isActive ? "Currently active" : "Tap to switch to this project")
    }
}
