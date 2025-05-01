export const canAccessActivity = (user, activity) => {
  return user.id === activity.user_id || user.role === 'admin';
};

export const canManageUser = (user, targetUser) => {
  return user.id === targetUser.id || user.role === 'admin';
};
