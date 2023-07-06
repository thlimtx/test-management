import { Details } from "@/components/Details";
import { Screen } from "@/components/Screen";
import { jsonParse } from "@/util/format";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { prisma } from "server/db/client";
import { memberColumns } from "./data";
import { Button } from "@/components/Button";
import {
  faChevronDown,
  faPlus,
  faSearch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { TextInput } from "@/components/TextInput";
import { Dropdown, MenuProps, Table } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  capitalize,
  debounce,
  find,
  includes,
  isNull,
  join,
  map,
  uniq,
  without,
} from "lodash";
import { Member, Role, User } from "@prisma/client";
import { getDropdownOptionsbyType } from "@/util/data";
import { getPermission } from "@/permission/data";
import { getServerSession } from "next-auth";
import authOptions from "@/pages/api/auth/[...nextauth]";
import { ColumnsType } from "antd/es/table";

const Members = (props: any) => {
  const { user } = props;

  const router = useRouter();
  const projectId = parseInt(router.query.id as string);

  const userId = user?.id;
  const editPermission = getPermission({
    action: "edit",
    route: "members",
    projectId,
    user,
  });
  const roleOptions = getDropdownOptionsbyType(Role, [Role.OWNER]);
  const [foundUser, setFoundUser] = useState<User | null>();
  const [userSearch, setUserSearch] = useState<string>();
  const [selectedRole, setSelectedRole] = useState<string[]>([]);
  const [members, setMembers] = useState<(Member & { user: User })[]>([]);

  useEffect(() => {
    getMembers({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const getMembers = async (item: any) => {
    const res = await fetch("../../../api/member/filter", {
      method: "POST",
      body: JSON.stringify({ ...item, projectId }),
    });
    if (res.ok) {
      setMembers(await res.json());
    } else {
      alert("Failed to get project members");
    }
  };

  const addMember = async (item: any) => {
    const res = await fetch("../../../api/member/create", {
      method: "POST",
      body: JSON.stringify({ ...item }),
    });
    if (res.ok) {
      router.replace(router.asPath);
    } else {
      alert("Failed to add member");
    }
  };

  const updateMember = async (item: any) => {
    const res = await fetch("../../../api/member/update", {
      method: "POST",
      body: JSON.stringify({ ...item }),
    });
    if (res.ok) {
      router.replace(router.asPath);
    } else {
      alert("Failed to update member details");
    }
  };

  const deleteMember = async (item: any) => {
    const res = await fetch("../../../api/member/delete", {
      method: "POST",
      body: JSON.stringify({ ...item }),
    });
    if (res.ok) {
      router.replace(router.asPath);
    } else {
      alert("Failed to remove member");
    }
  };

  const findUserByEmail = async (item: any) => {
    const res = await fetch("../../../api/user/find", {
      method: "POST",
      body: JSON.stringify({ email: item }),
    });
    if (res.ok) {
      const data = await res.json();
      setFoundUser(data);
    } else {
      setFoundUser(null);
    }
  };

  const onPressBack = () => router.back();

  const onSearch = (data: any) => {
    setUserSearch(data);
  };
  const onSearchMembers = debounce((text) => {
    getMembers({ search: text });
  }, 150);

  const onSelectRole: MenuProps["onClick"] = ({ key }) => {
    const roles = includes(selectedRole, key)
      ? without(selectedRole, key)
      : uniq([...selectedRole, key]);
    setSelectedRole(roles);
  };
  const onSelectTableRole = (data: Member, key: string) => {
    const roles = includes(data.role, key)
      ? without(data.role, key)
      : uniq([...data.role, key]);
    const { projectId, userId } = data;
    updateMember({ projectId, userId, role: roles });
  };
  const onPressRemove = (userId: any) => {
    deleteMember({ projectId, userId });
  };
  const onPressFind = () => {
    findUserByEmail(userSearch);
  };
  const onPressAddMember = (data: any) => {
    addMember({
      projectId,
      userId: parseInt(`${foundUser?.id}`),
      role: selectedRole,
    });
  };

  const memberCol: ColumnsType<any> = [
    ...memberColumns,
    {
      title: "Role",
      key: "role",
      render: (data: any) => {
        const { role } = data || {};
        return (
          <Dropdown
            menu={{
              items: roleOptions,
              onClick: ({ key }) => onSelectTableRole(data, key),
              selectedKeys: role,
            }}
            trigger={["click"]}
          >
            <a onClick={(e) => e.preventDefault()}>
              <div
                id="type"
                className={`flex flex-row items-center w-full button justify-between`}
              >
                <p>
                  {join(
                    map(role, (o) => capitalize(o)),
                    ", "
                  )}
                </p>
                <FontAwesomeIcon icon={faChevronDown} />
              </div>
            </a>
          </Dropdown>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          userId === find(members, (o) => includes(o.role, "OWNER"))?.userId &&
          !includes(record.role, "OWNER") && (
            <FontAwesomeIcon
              className="button self-center"
              style={{ color: "red" }}
              onClick={() => onPressRemove(record.userId)}
              icon={faXmark}
            />
          )
        );
      },
      width: 50,
    },
  ];
  return (
    <Screen sidebar permission={editPermission}>
      <Details
        editable={false}
        title="Project Members"
        onPressBack={onPressBack}
        fields={[
          {
            render: ({}) => {
              return (
                <div className="">
                  <p className="text-lg font-bold my-3"></p>
                  <div className="flex flex-row justify-between items-center">
                    <TextInput
                      placeholder="Enter user email"
                      onChange={(text) =>
                        onSearch(`${text.currentTarget.value}`)
                      }
                    />
                    <Button
                      type="invert"
                      text="Find"
                      className="border-textPrimary ml-3"
                      textClassName="text-textPrimary"
                      icon={faSearch}
                      onPress={onPressFind}
                    />
                  </div>
                  {foundUser ? (
                    <div className="flex flex-row items-center">
                      <div className="flex flex-col flex-1">
                        <p className="text-xs text-fade">Name</p>
                        <p>{foundUser?.name}</p>
                      </div>
                      <div className="flex flex-col flex-1 mx-2">
                        <p className="text-xs text-fade">Email</p>
                        <p>{foundUser?.email}</p>
                      </div>
                      <Dropdown
                        menu={{
                          items: roleOptions,
                          onClick: onSelectRole,
                          selectedKeys: selectedRole,
                        }}
                        trigger={["click"]}
                      >
                        <a onClick={(e) => e.preventDefault()}>
                          <div
                            id="type"
                            className={`flex flex-row items-center border border-opacity-100 rounded-sm w-full px-3 py-1.5 my-2 text-sm button`}
                          >
                            <input
                              className="flex flex-1 button bg-primaryBg"
                              placeholder="Select Type"
                              value={capitalize(join(selectedRole, ", "))}
                              disabled
                            />
                            <FontAwesomeIcon icon={faChevronDown} />
                          </div>
                        </a>
                      </Dropdown>
                      <Button
                        type="invert"
                        text="Add"
                        className="border-textPrimary ml-3"
                        textClassName="text-textPrimary"
                        icon={faPlus}
                        onPress={onPressAddMember}
                      />
                    </div>
                  ) : (
                    <div
                      className="text-center items-center p-5"
                      style={{ backgroundColor: "#EFEFEF" }}
                    >
                      <p style={{ color: "gray" }}>
                        {isNull(foundUser)
                          ? "No user with email found"
                          : "Search user by their email and add to project as members"}
                      </p>
                    </div>
                  )}
                </div>
              );
            },
          },
          {
            render: ({}) => {
              return (
                <div className="">
                  <p className="text-lg font-bold my-3">All Members</p>
                  <div className="flex flex-row justify-between items-center">
                    <div></div>
                    <div>
                      <TextInput
                        placeholder="Search"
                        onChange={(e) =>
                          onSearchMembers(`${e.currentTarget.value}`)
                        }
                      />
                    </div>
                  </div>
                  <Table
                    columns={memberCol}
                    dataSource={members}
                    rowKey={(data) => `${data.userId}`}
                  />
                </div>
              );
            },
          },
        ]}
      />
    </Screen>
  );
};

export const getServerSideProps = async (context: any) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { props: {} };
  }
  const user = await prisma.user.findFirst({
    where: { email: jsonParse(session).user.email },
    include: { member: true },
  });

  return {
    props: {
      user: jsonParse(user),
    },
  };
};

export default Members;
