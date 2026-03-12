/**
 * Department DTOs - map between API (camelCase) and entities/layers.
 */

/**
 * @param {import("../entities/department.entity")} entity
 * @returns {{ id: number, name: string, location: string }}
 */
function toResponseDto(entity) {
    if (!entity) return null;
    return {
        id: entity.dep_id,
        name: entity.dep_name,
        location: entity.dep_location,
    };
}

/**
 * @param {import("../entities/department.entity")[]} entities
 * @returns {{ id: number, name: string, location: string }[]}
 */
function toListDto(entities) {
    return (entities || []).map(toResponseDto);
}

/**
 * @param {{ name?: string, location?: string }} body - validated request body
 * @returns {{ name: string, location: string }}
 */
function fromCreateRequest(body) {
    return { name: body.name, location: body.location };
}

/**
 * @param {{ name?: string, location?: string }} body - validated request body
 * @returns {{ name: string, location: string }}
 */
function fromUpdateRequest(body) {
    return { name: body.name, location: body.location };
}

module.exports = {
    toResponseDto,
    toListDto,
    fromCreateRequest,
    fromUpdateRequest,
};
