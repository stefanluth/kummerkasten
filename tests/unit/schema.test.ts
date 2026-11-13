import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migrationDirectory = readdirSync('prisma/migrations').find((directory) =>
  directory.includes('post_feed_indexes_and_action_uniqueness'),
);
const migration = migrationDirectory
  ? readFileSync(join('prisma/migrations', migrationDirectory, 'migration.sql'), 'utf8')
  : '';

describe('post feed and action indexes', () => {
  it('declares matching vote and report uniqueness in the Prisma schema and migration', () => {
    expect(schema).toMatch(/model Vote \{[\s\S]*?@@unique\(\[postId, fingerprint\]\)/);
    expect(schema).toMatch(/model Report \{[\s\S]*?@@unique\(\[postId, fingerprint\]\)/);
    expect(migration).toContain(
      'CREATE UNIQUE INDEX "Vote_postId_fingerprint_key" ON "Vote"("postId", "fingerprint")',
    );
    expect(migration).toContain(
      'CREATE UNIQUE INDEX "Report_postId_fingerprint_key" ON "Report"("postId", "fingerprint")',
    );
  });

  it('indexes the feed ordering and vote aggregation columns in both schema and migration', () => {
    expect(schema).toContain('@@index([replyTo, createdAt(sort: Desc), id])');
    expect(schema).toContain('@@index([postId, upvote])');
    expect(migration).toContain('CREATE INDEX "Post_replyTo_createdAt_id_idx"');
    expect(migration).toContain('"createdAt" DESC, "id"');
    expect(migration).toContain('CREATE INDEX "Vote_postId_upvote_idx"');
  });

  it('provides a read-only preflight for duplicate post and fingerprint pairs', () => {
    const preflight = readFileSync('prisma/preflight_action_uniqueness.sql', 'utf8');

    expect(preflight).toContain('FROM "Vote"');
    expect(preflight).toContain('COUNT(DISTINCT "upvote")');
    expect(preflight).toContain('FROM "Report"');
    expect(preflight.match(/HAVING COUNT\(\*\) > 1/g)).toHaveLength(2);
  });
});
