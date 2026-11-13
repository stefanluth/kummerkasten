SELECT "postId", "fingerprint", COUNT(*) AS "duplicates", COUNT(DISTINCT "upvote") AS "vote_states"
FROM "Vote"
GROUP BY "postId", "fingerprint"
HAVING COUNT(*) > 1;

SELECT "postId", "fingerprint", COUNT(*) AS "duplicates"
FROM "Report"
GROUP BY "postId", "fingerprint"
HAVING COUNT(*) > 1;
