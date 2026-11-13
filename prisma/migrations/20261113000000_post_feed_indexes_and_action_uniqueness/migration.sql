-- CreateIndex
CREATE INDEX "Post_replyTo_createdAt_id_idx" ON "Post"("replyTo", "createdAt" DESC, "id");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_postId_fingerprint_key" ON "Vote"("postId", "fingerprint");

-- CreateIndex
CREATE INDEX "Vote_postId_upvote_idx" ON "Vote"("postId", "upvote");

-- CreateIndex
CREATE UNIQUE INDEX "Report_postId_fingerprint_key" ON "Report"("postId", "fingerprint");
