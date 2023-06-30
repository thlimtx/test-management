import { Role } from "@prisma/client";
import { find, includes, intersection, isEmpty } from "lodash";

export const permissions = [
  { route: "requirement", action: "edit", role: [Role.OWNER] },
  { route: "build", action: "edit", role: [Role.TESTER] },
  { route: "build", action: "run", role: [Role.TESTER] },
  { route: "test-plan", action: "edit", role: [Role.TESTER] },
  { route: "test-case", action: "edit", role: [Role.TESTER] },
  { route: "test-case", action: "run", role: [Role.TESTER] },
  { route: "deploy", action: "edit", role: [Role.QA] },
  { route: "deploy", action: "run", role: [Role.QA] },
  { route: "details", action: "edit", role: [Role.OWNER] },
  { route: "members", action: "edit", role: [Role.OWNER] },
];

export const getPermission = (data: {
  /** the current page, based on route name */
  route: string;
  /** the action that is to be taken */
  action: string;
  /** the role of the user */
  role: Role[];
}) => {
  const hasPermission = !!find(permissions, (perm) => {
    const isMatch =
      includes(data?.route, perm.route) &&
      data?.action === perm.action &&
      !isEmpty(intersection(perm.role, data?.role));
    return isMatch;
  });
  return hasPermission;
};
