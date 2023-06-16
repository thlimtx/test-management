import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { Sidebar } from "@/components/Sidebar";
import { TextInput } from "@/components/TextInput";
import { jsonParse } from "@/util/format";
import { useRouter } from "next/router";
import { prisma } from "server/db/client";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";

const Requirements = (props: any) => {
  const { requirements } = props;
  const router = useRouter();
  const projectId = router.query.id;
  // todo: Login session
  const userId = 1;

  const columns: ColumnsType<any> = [
    {
      title: "Id",
      key: "reqId",
      render: (value) => (
        <a href={`/project/${projectId}/requirement/${value.id}`}>
          {value.reqId}
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
  ];

  // todo: search
  const onSearch = (search: string) => {};

  const onPressAddRequirement = () => {
    router.push(`/project/${projectId}/requirement/create`);
  };

  return (
    <Screen>
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 py-3 px-5">
          <p className="text-2xl font-bold italic mb-5">Requirements</p>
          <div className="p-4 my-2 bg-primaryBg shadow">
            <div className="flex flex-row justify-between items-center">
              {/* <div> */}
              <Button
                type="invert"
                text="Add"
                className="border-textPrimary"
                textClassName="text-textPrimary"
                onPress={onPressAddRequirement}
              />
              {/* </div> */}
              <TextInput
                placeholder="Search"
                onChange={(text) => onSearch(`${text}`)}
              />
            </div>
            <Table
              columns={columns}
              dataSource={requirements}
              rowKey={(data) => `${data.id}`}
            />
          </div>
        </div>
      </div>
    </Screen>
  );
};

export const getServerSideProps = async (context: any) => {
  // todo: Login session
  const { id } = context.query;
  const requirements = await prisma.requirement.findMany({
    where: { projectId: { equals: parseInt(id) } },
  });
  return {
    props: {
      requirements: jsonParse(requirements),
    },
  };
};

export default Requirements;
