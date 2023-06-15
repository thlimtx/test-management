export const Screen = (props: any) => {
  return (
    <div className="flex flex-1 min-h-screen bg-screenBg flex-col header-offset">
      {props.children}
    </div>
  );
};
