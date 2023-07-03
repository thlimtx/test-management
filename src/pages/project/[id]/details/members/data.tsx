import { capitalize, join, map } from "lodash";

export const memberColumns = [
  {
    title: "Name",
    key: "name",
    render: (data: any) => data.user.name,
  },
  {
    title: "Email",
    key: "email",
    render: (data: any) => data.user.email,
  },
  {
    title: "Role",
    key: "role",
    render: (data: any) => {
      return join(
        map(data.role, (o) => capitalize(o)),
        ", "
      );
    },
  },
];
