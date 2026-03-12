function getPostLimit(friendCount) {
  if (friendCount === 0) return "blocked";
  if (friendCount > 10) return "unlimited";
  return friendCount;
}

function canPost(friendCount, postsToday) {
  const limit = getPostLimit(friendCount);

  if (limit === "blocked") {
    return {
      allowed: false,
      reason: "You need at least 1 friend to post. Add friends to start sharing!",
      limit,
    };
  }

  if (limit === "unlimited") return { allowed: true, limit };

  if (postsToday >= limit) {
    return {
      allowed: false,
      reason: `You can only post ${limit} time${limit > 1 ? "s" : ""} per day with ${friendCount} friend${friendCount > 1 ? "s" : ""}. Add more friends to post more!`,
      limit,
    };
  }

  return { allowed: true, limit };
}

module.exports = { getPostLimit, canPost };
