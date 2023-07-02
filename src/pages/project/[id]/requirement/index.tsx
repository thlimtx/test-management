import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { TextInput } from "@/components/TextInput";
import { jsonParse } from "@/util/format";
import { useRouter } from "next/router";
import { prisma } from "server/db/client";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { getPermission } from "@/permission/data";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { Requirement } from "@prisma/client";

const Requirements = (props: any) => {
  const router = useRouter();
  const projectId = parseInt(`${router.query.id}`);

  // todo: Login session
  const userId = 1;
  const editPermission = getPermission({
    action: "edit",
    role: ["OWNER"],
    route: "requirement",
  });
  const [requirements, setRequirements] = useState<Requirement[]>();

  useEffect(() => {
    getRequirements({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteRequirement = async (item: any) => {
    const res = await fetch("../../api/requirement/delete", {
      method: "POST",
      body: JSON.stringify({ ...item }),
    });
    if (res.ok) {
      router.replace(router.asPath);
    } else {
      alert("Failed to delete requirement");
    }
  };

  const getRequirements = async (item: any) => {
    const res = await fetch("../../api/requirement/filter", {
      method: "POST",
      body: JSON.stringify({ projectId, ...item }),
    });
    if (res.ok) {
      setRequirements(await res.json());
    } else {
      alert("Failed to get requirements");
    }
  };

  const onSearch = debounce((text) => {
    getRequirements({ search: text });
  }, 150);

  const onPressDelete = (id: any) => {
    deleteRequirement({ id });
  };

  const onPressAddRequirement = () => {
    router.push(`/project/${projectId}/requirement/create`);
  };

  const columns: ColumnsType<any> = [
    {
      title: "Code",
      key: "reqCode",
      render: (value) => (
        <a href={`/project/${projectId}/requirement/${value.id}`}>
          {value.reqCode}
        </a>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    editPermission
      ? {
          title: "Action",
          key: "action",
          render: (_, record) => {
            return (
              <FontAwesomeIcon
                className="button self-center"
                style={{ color: "red" }}
                onClick={() => onPressDelete(record.id)}
                icon={faXmark}
              />
            );
          },
          width: 50,
        }
      : {},
  ];

  return (
    <Screen sidebar>
      <div className="flex-1 py-3 px-5">
        <p className="text-2xl font-bold italic mb-5">Requirements</p>
        <div className="p-4 my-2 bg-primaryBg shadow">
          <div className="flex flex-row justify-between items-center">
            {editPermission ? (
              <Button
                type="invert"
                text="Add"
                className="border-textPrimary"
                textClassName="text-textPrimary"
                onPress={onPressAddRequirement}
              />
            ) : (
              <div />
            )}
            <div>
              <TextInput
                placeholder="Search"
                onChange={(e) => onSearch(e.currentTarget.value)}
              />
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={requirements}
            rowKey={(data) => `${data.id}`}
          />
        </div>
      </div>
    </Screen>
  );
};

export default Requirements;
