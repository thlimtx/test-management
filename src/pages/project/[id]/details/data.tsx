import { capitalize, join, map } from "lodash";

export const projectFields = [
  {
    id: "name",
    title: "Name",
    placeholder: "Enter Name",
  },
  {
    id: "description",
    title: "Description",
    placeholder: "Enter Description",
  },
  {
    id: "version",
    title: "Version",
    placeholder: "Enter Version",
  },
  {
    id: "env",
    title: "Environment",
    placeholder: "Enter Environment",
  },
  {
    id: "tools",
    title: "Tools",
    placeholder: "Enter Tools",
  },
];

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
      console.log(data);

      return join(
        map(data.role, (o) => capitalize(o)),
        ", "
      );
    },
  },
];
