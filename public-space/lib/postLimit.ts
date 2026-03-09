/**
 * Posting limits based on friend count:
 * 0 friends  → cannot post
 * 1 friend   → 1 post/day
 * 2 friends  → 2 posts/day
 * >10 friends → unlimited
 * 3-10 friends → friends count posts/day
 */

export function getPostLimit(friendCount: number): number | "unlimited" | "blocked" {
  if (friendCount === 0) return "blocked";
  if (friendCount > 10) return "unlimited";
  return friendCount; // 1 friend = 1/day, 2 friends = 2/day, etc.
}

export function canPost(
  friendCount: number,
  postsToday: number
): { allowed: boolean; reason?: string; limit: number | "unlimited" | "blocked" } {
  const limit = getPostLimit(friendCount);

  if (limit === "blocked") {
    return {
      allowed: false,
      reason: "You need at least 1 friend to post. Add friends to start sharing!",
      limit,
    };
  }

  if (limit === "unlimited") {
    return { allowed: true, limit };
  }

  if (postsToday >= limit) {
    return {
      allowed: false,
      reason: `You can only post ${limit} time${limit > 1 ? "s" : ""} per day with ${friendCount} friend${friendCount > 1 ? "s" : ""}. Add more friends to post more!`,
      limit,
    };
  }

  return { allowed: true, limit };
}
