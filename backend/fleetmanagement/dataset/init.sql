CREATE TABLE entities (
    id TEXT,
    entity TEXT,
    version NUMERIC,
    data JSON
);
CREATE unique INDEX entities_idx ON entities (id, entity)