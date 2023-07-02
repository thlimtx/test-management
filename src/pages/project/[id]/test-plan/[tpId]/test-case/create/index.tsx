import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { TextInput } from "@/components/TextInput";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {
  faChevronDown,
  faFloppyDisk,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { capitalize, replace } from "lodash";
import { Dropdown, MenuProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDropdownOptionsbyType } from "@/util/data";
import { TestPriority, TestStatus, TestType } from "@prisma/client";
import { getPermission } from "@/permission/data";

const CreateTestCase = (props: any) => {
  const router = useRouter();
  const { register, handleSubmit, watch, setValue } = useForm();
  const tpId = parseInt(router.query.tpId as string);
  // todo: Login session
  const userId = 1;
  const editPermission = getPermission({
    action: "edit",
    role: ["OWNER"],
    route: "test-case",
  });

  const testCasePriorityOptions = getDropdownOptionsbyType(TestPriority);
  const testCaseStatusOptions = getDropdownOptionsbyType(TestStatus);
  const testCaseTypeOptions = getDropdownOptionsbyType(TestType);

  const createTestCase = async (item: any) => {
    const res = await fetch("../../../../../api/test-case/create", {
      method: "POST",
      body: JSON.stringify({ ...item, testPlanId: tpId }),
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

  const renderDropdown = (
    id: string,
    title: string,
    options: MenuProps["items"]
  ) => {
    const onSelect: MenuProps["onClick"] = ({ key }) => setValue(id, key);
    return (
      <div>
        <p className="text-fade text-xs">{title}</p>
        <Dropdown
          menu={{
            items: options,
            onClick: onSelect,
          }}
          trigger={["click"]}
        >
          <a onClick={(e) => e.preventDefault()}>
            <div
              id={id}
              className={`flex flex-row items-center border border-opacity-100 rounded-sm w-full px-3 py-1.5 my-2 text-sm button`}
            >
              <input
                className="flex flex-1 button bg-primaryBg"
                {...register(id)}
                placeholder={`Select ${title}`}
                value={capitalize(watch(id))}
                disabled
              />
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
          </a>
        </Dropdown>
      </div>
    );
  };

  return (
    <Screen sidebar permission={editPermission}>
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
            <div className="flex-1 mr-3">{renderDetails("Title", "title")}</div>
            {renderDetails("Test Case Code", "testCaseCode")}
          </div>
          {renderDetails("Description", "description")}
          <div className="flex flex-row justify-between">
            {renderDropdown("type", "Type", testCaseTypeOptions)}
            {renderDropdown("priority", "Priority", testCasePriorityOptions)}
            {renderDropdown("status", "Status", testCaseStatusOptions)}
          </div>
          {renderDetails("Precondition", "precondition")}
          {renderDetails("Steps", "steps")}
          {renderDetails("Test Data", "data")}
          {renderDetails("Expected result", "expected")}
          {renderDetails("Test Script", "script")}
        </div>
      </div>
    </Screen>
  );
};

export default CreateTestCase;
