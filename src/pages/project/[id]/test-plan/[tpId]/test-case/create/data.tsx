import { TestPriority, TestStatus, TestType } from "@prisma/client";
import { MenuProps } from "antd";
import { capitalize } from "lodash";
export const testCaseTypeOptions: MenuProps["items"] = [
  {
    key: TestType.MANUAL,
    label: capitalize(TestType.MANUAL),
  },
  {
    key: TestType.AUTO,
    label: capitalize(TestType.AUTO),
  },
];
export const testCasePriorityOptions: MenuProps["items"] = [
  {
    key: TestPriority.HIGH,
    label: capitalize(TestPriority.HIGH),
  },
  {
    key: TestPriority.LOW,
    label: capitalize(TestPriority.LOW),
  },
  {
    key: TestPriority.MEDIUM,
    label: capitalize(TestPriority.MEDIUM),
  },
];
export const testCaseStatusOptions: MenuProps["items"] = [
  {
    key: TestStatus.FAILED,
    label: capitalize(TestStatus.FAILED),
  },
  {
    key: TestStatus.PASSED,
    label: capitalize(TestStatus.PASSED),
  },
  {
    key: TestStatus.PENDING,
    label: capitalize(TestStatus.PENDING),
  },
];
