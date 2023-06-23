import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { Sidebar } from "@/components/Sidebar";
import { TextInput } from "@/components/TextInput";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { faFloppyDisk, faXmark } from "@fortawesome/free-solid-svg-icons";
import { replace } from "lodash";

const CreateTestCase = (props: any) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const tpId = parseInt(router.query.tpId as string);
  // todo: Login session
  const userId = 1;

  const createTestCase = async (item: any) => {
    const res = await fetch("../../../api/test-case/create", {
      method: "POST",
      body: JSON.stringify({ ...item, tpId }),
    });
    if (res.ok) {
      const createdTestCase = await res.json();
      router.push(replace(router.asPath, "create", createdTestCase?.id));
    } else {
      alert("Failed to create test case");
    }
  };

  const onPressCancel = () => router.back();
  const onSubmit = (data: any) => createTestCase(data);

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
            <p className="text-2xl font-bold italic mb-5">Test Cases</p>
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
            <div className="flex flex-row">
              <div className="flex-1 mr-3">
                {renderDetails("Title", "title")}
              </div>
              {renderDetails("Test Case Code", "testCaseCode")}
            </div>
            {renderDetails("Description", "description")}
            {renderDetails("Precondition", "precondition")}
            {renderDetails("Steps", "steps")}
            {renderDetails("Test Data", "data")}
            {renderDetails("Expected result", "expected")}
            {renderDetails("Test Script", "script")}
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default CreateTestCase;
