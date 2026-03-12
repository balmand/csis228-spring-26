/**
 * Client DTOs - map between API (camelCase) and entities/layers.
 */

/**
 * @param {import("../entities/client.entity")} entity
 * @returns {{ id: number, name: string, email: string }}
 */
function toResponseDto(entity) {
    if (!entity) return null;
    return {
        id: entity.client_id,
        name: entity.client_name,
        email: entity.client_email,
    };
}

/**
 * @param {import("../entities/client.entity")[]} entities
 * @returns {{ id: number, name: string, email: string }[]}
 */
function toListDto(entities) {
    return (entities || []).map(toResponseDto);
}

/**
 * Client with optional department (e.g. from v_clients_departments).
 * @param {import("../entities/client.entity")} entity
 * @returns {{ id: number, name: string, email: string, department: { id: number, name: string, location: string } | null }}
 */
function toResponseWithDepartmentDto(entity) {
    if (!entity) return null;
    return {
        id: entity.client_id,
        name: entity.client_name,
        email: entity.client_email ?? null,
        department: entity.dep_id
            ? { id: entity.dep_id, name: entity.dep_name, location: entity.dep_location }
            : null,
    };
}

/**
 * @param {import("../entities/client.entity")[]} entities
 */
function toListWithDepartmentDto(entities) {
    return (entities || []).map(toResponseWithDepartmentDto);
}

/**
 * @param {{ name?: string, email?: string }} body - validated request body
 * @returns {{ name: string, email: string }}
 */
function fromCreateRequest(body) {
    return { name: body.name, email: body.email };
}

/**
 * @param {{ name?: string, email?: string }} body - validated request body
 * @returns {{ name: string, email: string }}
 */
function fromUpdateRequest(body) {
    return { name: body.name, email: body.email };
}

module.exports = {
    toResponseDto,
    toListDto,
    toResponseWithDepartmentDto,
    toListWithDepartmentDto,
    fromCreateRequest,
    fromUpdateRequest,
};
