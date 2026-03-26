const { Permissions } = require("./permissions");

const ROLE_DEFINITIONS = Object.freeze({
    admin: [Permissions.ADMIN],
    manager: [Permissions.CLIENTS_READ, Permissions.CLIENTS_WRITE, Permissions.DEPARTMENTS_READ],
    viewer: [Permissions.CLIENTS_READ, Permissions.DEPARTMENTS_READ],
});

function normalizeRoles(roles) {
    if (!roles) return [];
    if (Array.isArray(roles)) return roles.map((r) => String(r).trim()).filter(Boolean);
    if (typeof roles === "string") return roles.split(",").map((r) => r.trim()).filter(Boolean);
    return [];
}

function resolvePermissionsForRoles(roles) {
    const normalized = normalizeRoles(roles);
    const permissions = new Set();

    for (const role of normalized) {
        const perms = ROLE_DEFINITIONS[String(role).toLowerCase()] || [];
        for (const p of perms) permissions.add(p);
    }

    // If a user has the admin wildcard, grant everything by convention.
    if (permissions.has(Permissions.ADMIN)) {
        return Array.from(
            new Set([
                Permissions.ADMIN,
                Permissions.CLIENTS_READ,
                Permissions.CLIENTS_WRITE,
                Permissions.DEPARTMENTS_READ,
                Permissions.DEPARTMENTS_WRITE,
            ])
        );
    }

    return Array.from(permissions);
}

module.exports = {
    ROLE_DEFINITIONS,
    normalizeRoles,
    resolvePermissionsForRoles,
};

