/**
 * Client DTOs – API contract (camelCase response/request shapes).
 * All entity ↔ DTO conversion is done in the client mapper.
 */

const ClientMapper = require("../mappers/client.mapper");

module.exports = {
    toResponseDto: ClientMapper.entityToResponseDto,
    toListDto: ClientMapper.entitiesToListDto,
    toResponseWithDepartmentDto: ClientMapper.entityToResponseWithDepartmentDto,
    toListWithDepartmentDto: ClientMapper.entitiesToListWithDepartmentDto,
    fromCreateRequest: ClientMapper.createRequestToData,
    fromUpdateRequest: ClientMapper.updateRequestToData,
};
