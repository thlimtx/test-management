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
];
