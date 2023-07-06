import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { TextInput } from "@/components/TextInput";
import { jsonParse } from "@/util/format";
import { useRouter } from "next/router";
import { prisma } from "server/db/client";
import { Checkbox, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { debounce, find } from "lodash";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getPermission } from "@/permission/data";
import { useEffect, useState } from "react";
import { Requirement } from "@prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/pages/api/auth/[...nextauth]";

const SelectRequirements = (props: any) => {
  const { user } = props;
  const router = useRouter();
  const { id, tpId } = router.query;
  const projectId = parseInt(`${id}`);
  const editPermission = getPermission({
    action: "edit",
    route: "test-plan",
    projectId,
    user,
  });
  const [requirements, setRequirements] = useState<Requirement[]>();

  useEffect(() => {
    getRequirements({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const updateReference = async (item: any) => {
    const res = await fetch("../../../../api/reference/update", {
      method: "POST",
      body: JSON.stringify({ ...item, testPlanId: parseInt(`${tpId}`) }),
    });
    if (res.ok) {
      router.replace(router.asPath);
    } else {
      alert("Failed to add reference");
    }
  };

  const getRequirements = async (item: any) => {
    const res = await fetch("../../../../api/requirement/filter", {
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

  const onPressBack = () => router.back();

  const columns: ColumnsType<any> = [
    {
      title: "Code",
      key: "code",
      render: (value) => (
        <a href={`/project/${projectId}/requirement/${value.id}`}>
          {value.code}
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
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const { reference } = record;
        const isChecked = find(reference, (item) => {
          return `${item.testPlanId}` === tpId;
        });
        return (
          <Checkbox
            checked={!!isChecked}
            onChange={(e) => {
              updateReference({
                isChecked: !e.target.checked,
                reqId: record.id,
              });
            }}
          />
        );
      },
      width: 50,
    },
  ];

  return (
    <Screen sidebar permission={editPermission}>
      <div className="flex-1 py-3 px-5">
        <div className="flex flex-row justify-between items-center mb-3">
          <p className="text-2xl font-bold italic">Select Requirements</p>

          <Button
            text="Back"
            className="mr-3 border-textPrimary"
            icon={faArrowLeft}
            type="invert"
            textClassName="text-textPrimary"
            onPress={onPressBack}
          />
        </div>
        <div className="p-4 my-2 bg-primaryBg shadow">
          <div className="flex flex-row justify-between items-center">
            <div />
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

export const getServerSideProps = async (context: any) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { props: {} };
  }
  const user = await prisma.user.findFirst({
    where: { email: jsonParse(session).user.email },
    include: { member: true },
  });
  const { id } = context.query;
  const requirements = await prisma.requirement.findMany({
    where: {
      projectId: { equals: parseInt(id) },
    },
    include: {
      reference: true,
    },
  });
  return {
    props: {
      requirements: jsonParse(requirements),
      user: jsonParse(user),
    },
  };
};

export default SelectRequirements;
