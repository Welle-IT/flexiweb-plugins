import { Access, FieldAccess, TypedUser } from 'payload';

export const isAdmin: Access<TypedUser> = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.isAdmin);
};

export const isAdminFieldLevel: FieldAccess<{ id: string }, TypedUser> = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.isAdmin);
};
