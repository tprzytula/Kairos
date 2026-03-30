import { sortProjects } from ".";

describe('Given the sortProjects function', () => {
    it('should place personal projects before non-personal projects', () => {
        const projects = [
            createProject({ id: "1", isPersonal: false, createdAt: 1000 }),
            createProject({ id: "2", isPersonal: true, createdAt: 500 }),
        ];

        const sorted = sortProjects(projects);

        expect(sorted[0].id).toBe("2");
        expect(sorted[1].id).toBe("1");
    });

    it('should sort non-personal projects by createdAt descending', () => {
        const projects = [
            createProject({ id: "1", isPersonal: false, createdAt: 1000 }),
            createProject({ id: "2", isPersonal: false, createdAt: 2000 }),
        ];

        const sorted = sortProjects(projects);

        expect(sorted[0].id).toBe("2");
        expect(sorted[1].id).toBe("1");
    });

    it('should sort personal projects by createdAt descending', () => {
        const projects = [
            createProject({ id: "1", isPersonal: true, createdAt: 1000 }),
            createProject({ id: "2", isPersonal: true, createdAt: 2000 }),
        ];

        const sorted = sortProjects(projects);

        expect(sorted[0].id).toBe("2");
        expect(sorted[1].id).toBe("1");
    });

    it('should handle a mix of personal and non-personal projects', () => {
        const projects = [
            createProject({ id: "1", isPersonal: false, createdAt: 3000 }),
            createProject({ id: "2", isPersonal: true, createdAt: 1000 }),
            createProject({ id: "3", isPersonal: false, createdAt: 2000 }),
            createProject({ id: "4", isPersonal: true, createdAt: 4000 }),
        ];

        const sorted = sortProjects(projects);

        expect(sorted[0].id).toBe("4");
        expect(sorted[1].id).toBe("2");
        expect(sorted[2].id).toBe("1");
        expect(sorted[3].id).toBe("3");
    });

    it('should keep order when both projects have the same isPersonal and createdAt', () => {
        const projects = [
            createProject({ id: "1", isPersonal: false, createdAt: 1000 }),
            createProject({ id: "2", isPersonal: false, createdAt: 1000 }),
        ];

        const sorted = sortProjects(projects);

        expect(sorted[0].id).toBe("1");
        expect(sorted[1].id).toBe("2");
    });
});

const createProject = ({ id, isPersonal, createdAt }: { id: string; isPersonal: boolean; createdAt: number }) => ({
    id,
    name: `Project ${id}`,
    ownerId: "owner-1",
    isPersonal,
    createdAt,
    userRole: "owner" as const,
});
