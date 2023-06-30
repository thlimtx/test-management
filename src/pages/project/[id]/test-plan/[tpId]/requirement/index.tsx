import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { TextInput } from "@/components/TextInput";
import { jsonParse } from "@/util/format";
import { useRouter } from "next/router";
import { prisma } from "server/db/client";
import { Checkbox, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { find } from "lodash";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getPermission } from "@/permission/data";

const SelectRequirements = (props: any) => {
  const { requirements } = props;
  const router = useRouter();
  const { id: projectId, tpId } = router.query;

  // todo: Login session
  const userId = 1;
  const editPermission = getPermission({
    action: "edit",
    role: ["OWNER"],
    route: "test-plan",
  });

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

  // todo: search
  const onPressBack = () => router.back();
  const onSearch = (search: string) => {};

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
                onChange={(text) => onSearch(`${text}`)}
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
  // todo: Login session
  const { id } = context.query;
  const requirements = await prisma.requirement.findMany({
    where: {
      projectId: { equals: parseInt(id) },
    },
    include: {
      reference: {
        include: {
          testPlan: true,
        },
      },
    },
  });
  return {
    props: {
      requirements: jsonParse(requirements),
    },
  };
};

export default SelectRequirements;
