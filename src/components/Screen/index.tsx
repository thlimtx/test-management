import { Details } from "../Details";
import { Sidebar } from "../Sidebar";
import { ScreenProps } from "./props";

export const Screen = (props: ScreenProps) => {
  const { children, sidebar, permission = true } = props;
  return (
    <div className="flex flex-1 min-h-screen bg-screenBg flex-col header-offset">
      {sidebar ? (
        <div className="flex flex-1">
          <Sidebar />
          {permission ? (
            children
          ) : (
            <Details
              fields={[
                {
                  render: () => {
                    return <p>You do not have Permission to view this page.</p>;
                  },
                },
              ]}
            />
          )}
        </div>
      ) : (
        children
      )}
    </div>
  );
};
