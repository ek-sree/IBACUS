interface UserWithEmail {
  email: string;
}

export const checkDuplicateEmails = (
  newUsers: UserWithEmail[],
  existingUsers: UserWithEmail[] = []
): string[] => {
  const duplicates: string[] = [];
  const emailCount: Record<string, number> = {};

  // Count all emails (existing + new)
  [...existingUsers, ...newUsers].forEach(user => {
    const email = user.email?.toLowerCase();
    if (email) {
      emailCount[email] = (emailCount[email] || 0) + 1;
    }
  });

  // Find duplicates (count > 1)
  Object.entries(emailCount).forEach(([email, count]) => {
    if (count > 1) {
      duplicates.push(email);
    }
  });

  return duplicates;
};