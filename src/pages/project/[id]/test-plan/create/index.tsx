import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { Sidebar } from "@/components/Sidebar";
import { TextInput } from "@/components/TextInput";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { faFloppyDisk, faXmark } from "@fortawesome/free-solid-svg-icons";
import { replace } from "lodash";

const CreateTestPlan = (props: any) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const projectId = parseInt(router.query.id as string);
  const tpId = router.query.tpId;
  // todo: Login session
  const userId = 1;

  const createTestPlan = async (item: any) => {
    const res = await fetch("../../../api/test-plan/create", {
      method: "POST",
      body: JSON.stringify({ ...item, projectId }),
    });
    if (res.ok) {
      const createdTestPlan = await res.json();
      router.push(replace(router.asPath, "create", createdTestPlan?.id));
    } else {
      alert("Failed to create test plan");
    }
  };

  const onPressCancel = () => router.back();
  const onSubmit = (data: any) => createTestPlan(data);

  const renderDetails = (title: string, id: string) => {
    return (
      <div>
        <p className="text-fade text-xs">{title}</p>
        <TextInput
          id={id}
          register={register}
          registerOptions={{ required: true }}
          placeholder={`Enter ${title}`}
        />
      </div>
    );
  };

  return (
    <Screen>
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 py-3 px-5">
          <div className="flex flex-row justify-between items-center">
            <p className="text-2xl font-bold italic mb-5">Test Plans</p>
            <div className="flex flex-row">
              <Button
                text="Cancel"
                className="mr-3 border-textPrimary"
                icon={faXmark}
                type="invert"
                textClassName="text-textPrimary"
                onPress={onPressCancel}
              />
              <Button
                text="Save"
                className="border-textPrimary"
                icon={faFloppyDisk}
                type="invert"
                textClassName="text-textPrimary"
                onPress={handleSubmit(onSubmit)}
              />
            </div>
          </div>
          <div className="p-4 my-2 bg-primaryBg shadow">
            {renderDetails("Test Plan Code", "testPlanCode")}
            {renderDetails("Name", "title")}
            {renderDetails("Description", "description")}
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default CreateTestPlan;
