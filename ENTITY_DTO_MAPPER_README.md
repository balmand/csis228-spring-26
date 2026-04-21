# Entity, DTO, and Mapper Guide

This project uses a small but very useful separation between:

- entities
- DTOs
- mappers

Together, they keep database structure separate from API response structure.

## Why This Matters

The database returns rows using snake_case column names such as:

```js
{
  dep_id: 1,
  dep_name: "IT",
  dep_location: "Beirut"
}
```

But the API should return a cleaner contract to clients:

```js
{
  id: 1,
  name: "IT",
  location: "Beirut"
}
```

If we return raw database rows directly:

- database naming leaks into the API
- schema changes become harder to manage
- controllers and services get cluttered with conversion logic
- response shapes become inconsistent across endpoints

The mapper layer solves that by making conversion explicit and reusable.

## Files Involved

Department flow:

- `src/entities/department.entity.js`
- `src/mappers/department.mapper.js`
- `src/dtos/department.dto.js`
- `src/repositories/department.repository.js`
- `src/services/department.service.js`

Client flow:

- `src/entities/client.entity.js`
- `src/mappers/client.mapper.js`
- `src/dtos/client.dto.js`
- `src/repositories/client.repository.js`
- `src/services/client.service.js`

## Layer Responsibilities

### 1. Entity

Entities represent database-shaped data.

They use the same field names returned by SQL, which in this project are snake_case column names.

Example from `src/entities/department.entity.js`:

```js
class DepartmentEntity {
    constructor({ dep_id, dep_name, dep_location } = {}) {
        this.dep_id = dep_id;
        this.dep_name = dep_name;
        this.dep_location = dep_location;
    }
}
```

Important points:

- entities model database rows, not API responses
- `fromRow()` converts one DB row into an entity
- `fromRows()` converts many rows into entities

### 2. Mapper

Mappers contain the actual conversion logic.

This is the most important layer in the pattern.

Example from `src/mappers/department.mapper.js`:

```js
function entityToResponseDto(entity) {
    if (!entity) return null;
    return {
        id: entity.dep_id,
        name: entity.dep_name,
        location: entity.dep_location,
    };
}
```

The mapper is also responsible for request-body normalization before repository calls:

```js
function createRequestToData(body) {
    return { name: body.name, location: body.location };
}
```

Important points:

- entity to response DTO conversion happens here
- request body to repository data conversion happens here
- list conversions also happen here
- if response shape changes, this is usually the first place to update

### 3. DTO

DTO files are thin public wrappers around mapper functions.

Example from `src/dtos/department.dto.js`:

```js
module.exports = {
    toResponseDto: DepartmentMapper.entityToResponseDto,
    toListDto: DepartmentMapper.entitiesToListDto,
    fromCreateRequest: DepartmentMapper.createRequestToData,
    fromUpdateRequest: DepartmentMapper.updateRequestToData,
};
```

In this project, DTO files do not contain complex logic by themselves.  
They expose the mapper through a simpler interface for the service layer.

## End-to-End Flow

The common request flow looks like this:

1. Controller receives the HTTP request.
2. Service validates business rules.
3. Repository runs SQL and returns raw rows.
4. Entity converts rows into entity objects.
5. DTO/mapper converts entities into API-safe response objects.
6. Controller returns JSON.

In short:

```text
Controller -> Service -> Repository -> Entity -> Mapper/DTO -> JSON response
```

## Example: Department Read Flow

Repository:

```js
const result = await pool.query(`SELECT * FROM departments WHERE dep_id = $1`, [id]);
return DepartmentEntity.fromRow(result.rows[0]);
```

Service:

```js
const entity = await DepartmentRepository.findById(id);
return DepartmentDto.toResponseDto(entity);
```

Returned API response:

```js
{
  id: 1,
  name: "IT",
  location: "Beirut"
}
```

## Example: Department Create Flow

Service input:

```js
{
  name: "IT",
  location: "Beirut"
}
```

Service:

```js
const data = DepartmentDto.fromCreateRequest(body);
const entity = await DepartmentRepository.create(data);
return DepartmentDto.toResponseDto(entity);
```

Repository:

```js
INSERT INTO departments (dep_name, dep_location)
VALUES ($1, $2)
RETURNING *
```

This means:

- incoming API fields stay simple
- repository gets the exact fields it expects
- returned DB row is converted back into API format

## Client Mapper Example With Nested Data

The client mapper has an additional case for joined department data:

```js
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
```

This is important because it shows that mappers are not only for renaming fields.  
They also shape nested responses for richer API endpoints.

## Current Implementation Assessment

The implementation is generally clean and consistent:

- repositories return entities, not raw rows, for normal CRUD operations
- services use DTO functions instead of hand-writing JSON shapes
- mappers are the single place where entity-to-response conversion happens
- DTO files provide a stable interface to the service layer

There is one notable exception:

- `DepartmentService.departmentsClients()` returns raw rows from `DepartmentRepository.findDepartmentClients()`
- `DepartmentService.depPer()` builds and returns a custom object directly in the service

These are not necessarily wrong, but they do bypass the normal entity/DTO/mapper flow.  
If you want full consistency across the codebase, reporting-style endpoints like these could also get dedicated DTO/mapper functions.

## Importance in Real Projects

This pattern becomes more valuable as the project grows.

Benefits:

- protects the API contract from database naming details
- keeps services smaller and easier to read
- avoids duplicate conversion code in multiple places
- makes response changes safer
- helps testing because mapping rules live in one place
- supports richer responses, like nested department data for clients

Without this pattern, conversion logic usually gets scattered across controllers and services.

## How To Use This Pattern For New Features

When adding a new resource or endpoint:

1. Add or update the entity to represent the database row.
2. Add mapping functions in the mapper.
3. Expose those functions through the DTO file.
4. In the service, call DTO functions instead of building JSON manually.
5. Keep controllers focused on HTTP handling only.

Recommended rule:

- database shape belongs in entities
- conversion logic belongs in mappers
- service uses DTOs
- controller returns the service result

## Summary

The entity/DTO/mapper implementation in this project is doing an important architectural job:

- entities represent database rows
- mappers transform those rows into API-friendly shapes
- DTOs expose mapper operations to the service layer

That separation keeps the API cleaner, more maintainable, and easier to evolve.
