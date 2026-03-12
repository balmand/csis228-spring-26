/**
 * Department DTOs – API contract (camelCase response/request shapes).
 * All entity ↔ DTO conversion is done in the department mapper.
 */

const DepartmentMapper = require("../mappers/department.mapper");

module.exports = {
    toResponseDto: DepartmentMapper.entityToResponseDto,
    toListDto: DepartmentMapper.entitiesToListDto,
    fromCreateRequest: DepartmentMapper.createRequestToData,
    fromUpdateRequest: DepartmentMapper.updateRequestToData,
};
