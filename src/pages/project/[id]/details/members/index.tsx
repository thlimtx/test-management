import { Details } from "@/components/Details";
import { Screen } from "@/components/Screen";
import { jsonParse } from "@/util/format";
import { useRouter } from "next/router";
import { useState } from "react";
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
import { capitalize, find, includes, isNull } from "lodash";
import { Role, User } from "@prisma/client";
import { getDropdownOptionsbyType } from "@/util/data";
import { getPermission } from "@/permission/data";

const Members = (props: any) => {
  // TODO: manage roles
  const { members } = props;

  const router = useRouter();
  const projectId = parseInt(router.query.id as string);

  // todo: Login session
  const userId = 1;
  const editPermission = getPermission({
    action: "edit",
    role: ["OWNER"],
    route: "members",
  });
  const roleOptions = getDropdownOptionsbyType(Role, [Role.OWNER]);
  const [foundUser, setFoundUser] = useState<User | null>();
  const [userSearch, setUserSearch] = useState<string>();
  const [selectedRole, setSelectedRole] = useState<string>("TESTER");

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
  const onSelectRole: MenuProps["onClick"] = ({ key }) => setSelectedRole(key);
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
                        menu={{ items: roleOptions, onClick: onSelectRole }}
                        trigger={["click"]}
                      >
                        <a onClick={(e) => e.preventDefault()}>
                          <div
                            id="type"
                            className={`flex flex-row items-center border border-opacity-100 rounded-sm w-full px-3 py-1.5 my-2 text-sm button`}
                          >
                            <input
                              className="flex flex-1 button"
                              placeholder="Select Type"
                              value={capitalize(selectedRole)}
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
                        onChange={(text) => onSearch(`${text}`)}
                      />
                    </div>
                  </div>
                  <Table
                    columns={[
                      ...memberColumns,
                      {
                        title: "Action",
                        key: "action",
                        render: (_, record) => {
                          return (
                            userId ===
                              find(members, (o) => includes(o.role, "OWNER"))
                                .userId &&
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
                    ]}
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
  // todo: Login session
  const { id } = context.query;
  const members = await prisma.member.findMany({
    where: { projectId: { equals: parseInt(id) } },
    include: {
      user: true,
    },
  });
  return {
    props: {
      members: jsonParse(members),
    },
  };
};

export default Members;
