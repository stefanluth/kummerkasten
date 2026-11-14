-- Existing installations may contain legacy replyTo values that do not refer to
-- a post. NOT VALID preserves those rows while enforcing the relation for new
-- and updated rows.
ALTER TABLE "Post"
ADD CONSTRAINT "Post_replyTo_fkey"
FOREIGN KEY ("replyTo") REFERENCES "Post"("id")
ON DELETE CASCADE ON UPDATE CASCADE NOT VALID;
