# Graph Builder Service Contract

## Endpoints
- POST /graph/add - Add entities and relationships
- GET /graph/entity/{name} - Get connections for entity
- GET /graph/visualize/{shloka_id} - Get vis.js format data
- GET /graph/stats - Get graph statistics
- POST /graph/query - Custom Cypher query (admin)

## Request Shape (for /graph/add)
```json
{
  "entities": [
    {
      "name": "string",
      "type": "string",
      "properties": "object"
    }
  ],
  "relationships": [
    {
      "source": "string",
      "target": "string",
      "type": "string",
      "properties": "object"
    }
  ],
  "shloka_id": "uuid (optional, for provenance)"
}
```

## Response Shape
### For /graph/entity/{name}
```json
{
  "name": "string",
  "type": "string",
  "description": "string",
  "properties": "object",
  "connections": [
    {
      "node": "string",
      "relationship": "string",
      "type": "string"
    }
  ]
}
```

### For /graph/visualize/{shloka_id}
```json
{
  "nodes": [
    {
      "id": "string",
      "label": "string",
      "type": "string",
      "properties": "object"
    }
  ],
  "edges": [
    {
      "from": "string",
      "to": "string",
      "label": "string"
    }
  ]
}
```

### For /graph/stats
```json
{
  "total_nodes": "integer",
  "total_relationships": "integer",
  "total_shlokas": "integer",
  "node_types": {"string": "integer"},
  "relationship_types": {"string": "integer"}
}
```

## Error Codes
- 400: Invalid request data
- 404: Entity not found
- 500: Neo4j database error
- 503: Graph service unavailable
