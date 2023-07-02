import { RenderProps } from "@/components/Details/props";
import { getDropdownOptionsbyType } from "@/util/data";
import { TestPriority, TestStatus, TestType } from "@prisma/client";

export const testCaseDropFields = [
  {
    id: "type",
    title: "Type",
    options: getDropdownOptionsbyType(TestType),
  },
  {
    id: "priority",
    title: "Priority",
    options: getDropdownOptionsbyType(TestPriority),
  },
  {
    id: "status",
    title: "Status",
    options: getDropdownOptionsbyType(TestStatus),
  },
];

export const testCaseFields1 = [
  {
    render: ({ renderDetails }: RenderProps) => {
      return (
        <div className="flex flex-row">
          {renderDetails({
            id: "title",
            title: "Title",
            placeholder: "Enter Title",
          })}
          <div className="flex flex-1" />
          {renderDetails({
            id: "testCaseCode",
            title: "Code",
            placeholder: "Enter Code",
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
];

export const testCaseFields2 = [
  {
    render: ({ renderDetails }: RenderProps) => {
      return (
        <div className="flex flex-row justify-evenly">
          {renderDetails({
            id: "createdAt",
            title: "Created At",
            editable: false,
          })}
          {renderDetails({
            id: "lastExecutedAt",
            title: "Last Executed",
            placeholder: "Enter Last Executed Date",
            editable: false,
          })}
          <div className="flex flex-1"></div>
        </div>
      );
    },
  },
  {
    id: "precondition",
    title: "Precondition",
    placeholder: "Enter Precondition",
  },
  {
    id: "steps",
    title: "Steps",
    placeholder: "Enter Steps",
  },
  {
    id: "data",
    title: "Data",
    placeholder: "Enter Test Data",
  },
  {
    id: "expected",
    title: "Expected Result",
    placeholder: "Enter Expected Result",
  },
  {
    id: "script",
    title: "Test Script",
    placeholder: "Enter Test Script",
  },
  {
    id: "result",
    title: "Actual Result",
    placeholder: "Enter Actual Result",
  },
];
