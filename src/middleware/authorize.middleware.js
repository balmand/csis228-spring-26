function normalizeToArray(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") return value.split(",").map((v) => v.trim()).filter(Boolean);
    return [];
}

function requireRoles(requiredRoles = []) {
    const required = normalizeToArray(requiredRoles).map((r) => String(r).toLowerCase());

    return (req, res, next) => {
        const roles = normalizeToArray(req.user?.roles).map((r) => String(r).toLowerCase());
        const ok = required.every((r) => roles.includes(r));
        if (!ok) return res.status(403).json({ error: "Forbidden" });
        next();
    };
}

function requireAnyRole(requiredRoles = []) {
    const required = normalizeToArray(requiredRoles).map((r) => String(r).toLowerCase());

    return (req, res, next) => {
        const roles = normalizeToArray(req.user?.roles).map((r) => String(r).toLowerCase());
        const ok = required.some((r) => roles.includes(r));
        if (!ok) return res.status(403).json({ error: "Forbidden" });
        next();
    };
}

function requirePermissions(requiredPermissions = []) {
    const required = normalizeToArray(requiredPermissions);

    return (req, res, next) => {
        const permissions = new Set(normalizeToArray(req.user?.permissions));
        const ok = required.every((p) => permissions.has(p) || permissions.has("admin:*"));
        if (!ok) return res.status(403).json({ error: "Forbidden" });
        next();
    };
}

function requireAnyPermission(requiredPermissions = []) {
    const required = normalizeToArray(requiredPermissions);

    return (req, res, next) => {
        const permissions = new Set(normalizeToArray(req.user?.permissions));
        const ok =
            permissions.has("admin:*") || required.some((p) => permissions.has(p));
        if (!ok) return res.status(403).json({ error: "Forbidden" });
        next();
    };
}

module.exports = {
    requireRoles,
    requireAnyRole,
    requirePermissions,
    requireAnyPermission,
};

