import { Details } from "@/components/Details";
import { Screen } from "@/components/Screen";
import { Sidebar } from "@/components/Sidebar";
import { formatDate, jsonParse } from "@/util/format";
import { useForm } from "react-hook-form";
import { prisma } from "server/db/client";

const Requirements = (props: any) => {
  const { requirement } = props;
  const data = {
    ...requirement,
    createdAt: formatDate(requirement?.createdAt),
  };

  // todo: Login session
  const userId = 1;
  const { register, handleSubmit } = useForm();

  // todo: handle edit api
  const onSubmit = (data: any) => console.log({ data });

  return (
    <Screen>
      <div className="flex flex-1">
        <Sidebar />
        <Details
          editable
          register={register}
          title="Requirements"
          onPressSave={handleSubmit(onSubmit)}
          data={data}
          fields={[
            {
              render: ({ renderDetails }) => {
                return (
                  <div className="flex flex-row justify-between">
                    {renderDetails({
                      id: "title",
                      title: "Title",
                      placeholder: "Enter Title",
                    })}
                    {renderDetails({
                      id: "reqId",
                      title: "Requirement ID",
                      placeholder: "Enter Requirement ID",
                    })}
                  </div>
                );
              },
            },
            {
              id: "description",
              title: "Description",
              placeholder: "Enter Description",
            },
            {
              id: "createdAt",
              title: "Created At",
              editable: false,
            },
          ]}
        />
      </div>
    </Screen>
  );
};

export const getServerSideProps = async (context: any) => {
  // todo: Login session
  const { reqId } = context.query;
  const requirement = await prisma.requirement.findFirst({
    where: { id: { equals: parseInt(reqId) } },
  });
  return {
    props: {
      requirement: jsonParse(requirement),
    },
  };
};

export default Requirements;
