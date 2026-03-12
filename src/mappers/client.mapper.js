/**
 * Client mapper – dedicated conversions between ClientEntity and Client DTOs.
 * Single place for all entity ↔ DTO mapping logic.
 */

const ClientEntity = require("../entities/client.entity");

/**
 * Entity → response DTO (single client).
 * @param {ClientEntity | null} entity
 * @returns {{ id: number, name: string, email: string } | null}
 */
function entityToResponseDto(entity) {
    if (!entity) return null;
    return {
        id: entity.client_id,
        name: entity.client_name,
        email: entity.client_email,
    };
}

/**
 * Entities → list of response DTOs.
 * @param {ClientEntity[]} entities
 * @returns {{ id: number, name: string, email: string }[]}
 */
function entitiesToListDto(entities) {
    return (entities || []).map(entityToResponseDto);
}

/**
 * Entity (with department join) → response DTO with nested department.
 * @param {ClientEntity | null} entity
 * @returns {{ id: number, name: string, email: string | null, department: { id: number, name: string, location: string } | null } | null}
 */
function entityToResponseWithDepartmentDto(entity) {
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
 * Entities (with department) → list of DTOs with nested department.
 * @param {ClientEntity[]} entities
 */
function entitiesToListWithDepartmentDto(entities) {
    return (entities || []).map(entityToResponseWithDepartmentDto);
}

/**
 * Request body (create) → plain data for repository.
 * @param {{ name?: string, email?: string }} body
 * @returns {{ name: string, email: string }}
 */
function createRequestToData(body) {
    return { name: body.name, email: body.email };
}

/**
 * Request body (update) → plain data for repository.
 * @param {{ name?: string, email?: string }} body
 * @returns {{ name: string, email: string }}
 */
function updateRequestToData(body) {
    return { name: body.name, email: body.email };
}

module.exports = {
    entityToResponseDto,
    entitiesToListDto,
    entityToResponseWithDepartmentDto,
    entitiesToListWithDepartmentDto,
    createRequestToData,
    updateRequestToData,
};
