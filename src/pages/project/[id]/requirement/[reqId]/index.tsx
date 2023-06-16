import { Screen } from "@/components/Screen";
import { Sidebar } from "@/components/Sidebar";
import { jsonParse } from "@/util/format";
import { useRouter } from "next/router";
import { prisma } from "server/db/client";

const Requirements = (props: any) => {
  const { requirements } = props;
  const router = useRouter();
  const projectId = router.query.id;
  const reqId = router.query.reqId;
  // todo: Login session
  const userId = 1;

  const renderDetails = (title: string, data: string) => {
    return (
      <div>
        <p className="text-fade text-xs my-1.5">{title}</p>
        <p>{data}</p>
      </div>
    );
  };

  return (
    <Screen>
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 py-3 px-5">
          <p className="text-2xl font-bold italic mb-5">Requirements</p>
          <div className="p-4 my-2 bg-primaryBg shadow">
            <div className="flex flex-row justify-between">
              {renderDetails("Name", "Req 1")}
              {renderDetails("Requirement ID", "req001")}
            </div>
            {renderDetails("Desription", "req desc")}
            {renderDetails("Date created", "23/12/2022")}
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
