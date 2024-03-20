CREATE TABLE entities (
    id TEXT,
    entity TEXT,
    version NUMERIC,
    data JSONB
);
CREATE unique INDEX entities_idx ON entities (id, entity)