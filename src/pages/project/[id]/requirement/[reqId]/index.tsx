import { Details } from "@/components/Details";
import { Screen } from "@/components/Screen";
import { Sidebar } from "@/components/Sidebar";
import { formatDate, jsonParse } from "@/util/format";
import { replace } from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { prisma } from "server/db/client";

const Requirements = (props: any) => {
  const { requirement } = props;
  const data = {
    ...requirement,
    createdAt: formatDate(requirement?.createdAt),
  };

  const router = useRouter();

  // todo: Login session
  const userId = 1;
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit } = useForm();

  const updateRequirement = async (item: any) => {
    const res = await fetch("../../../api/requirement/update", {
      method: "POST",
      body: JSON.stringify({ ...item }),
    });
    if (res.ok) {
      setIsEditing(false);
      router.replace(router.asPath);
    } else {
      alert("Failed to update requirement");
    }
  };

  const onPressBack = () =>
    router.push(replace(router.asPath, requirement?.id, ""));
  const onPressCancel = () => setIsEditing(false);
  const onPressEdit = () => setIsEditing(true);

  const onSubmit = (data: any) =>
    updateRequirement({ id: requirement?.id, ...data });

  return (
    <Screen>
      <div className="flex flex-1">
        <Sidebar />
        <Details
          isEditing={isEditing}
          editable
          register={register}
          title="Requirements"
          onPressBack={onPressBack}
          onPressCancel={onPressCancel}
          onPressEdit={onPressEdit}
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
                    <div className="flex flex-1" />
                    {renderDetails({
                      id: "reqCode",
                      title: "Requirement Code",
                      placeholder: "Enter Requirement Code",
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
