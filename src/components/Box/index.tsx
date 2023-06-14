import { BoxProps } from "./props";

export const Box = (props: BoxProps) => {
  const { title, type, children } = props;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-3 flex-1">
      <div
        className="flex flex-1 flex-col shadow bg-secondary px-20 py-10 justify-around"
        style={{
          maxWidth: 500,
          maxHeight: 600,
          width: "100%",
        }}
      >
        {title && (
          <p className="text-center text-3xl italic font-bold pb-4">{title}</p>
        )}
        {children}
      </div>
    </div>
  );
};
