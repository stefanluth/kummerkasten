-- Replace the restrictive vote foreign key so deleting a post also deletes its votes.
ALTER TABLE "Vote"
DROP CONSTRAINT "Vote_postId_fkey",
ADD CONSTRAINT "Vote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
