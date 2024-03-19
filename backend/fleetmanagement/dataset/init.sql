CREATE TABLE entities (
    id TEXT,
    entity TEXT,
    data JSON
);
CREATE unique INDEX entities_idx ON entities (id, entity)