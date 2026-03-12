/**
 * Department mapper – dedicated conversions between DepartmentEntity and Department DTOs.
 * Single place for all entity ↔ DTO mapping logic.
 */

const DepartmentEntity = require("../entities/department.entity");

/**
 * Entity → response DTO (single department).
 * @param {DepartmentEntity | null} entity
 * @returns {{ id: number, name: string, location: string } | null}
 */
function entityToResponseDto(entity) {
    if (!entity) return null;
    return {
        id: entity.dep_id,
        name: entity.dep_name,
        location: entity.dep_location,
    };
}

/**
 * Entities → list of response DTOs.
 * @param {DepartmentEntity[]} entities
 * @returns {{ id: number, name: string, location: string }[]}
 */
function entitiesToListDto(entities) {
    return (entities || []).map(entityToResponseDto);
}

/**
 * Request body (create) → plain data for repository.
 * @param {{ name?: string, location?: string }} body
 * @returns {{ name: string, location: string }}
 */
function createRequestToData(body) {
    return { name: body.name, location: body.location };
}

/**
 * Request body (update) → plain data for repository.
 * @param {{ name?: string, location?: string }} body
 * @returns {{ name: string, location: string }}
 */
function updateRequestToData(body) {
    return { name: body.name, location: body.location };
}

module.exports = {
    entityToResponseDto,
    entitiesToListDto,
    createRequestToData,
    updateRequestToData,
};
