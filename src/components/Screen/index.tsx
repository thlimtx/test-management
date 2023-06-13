export const Screen = (props: any) => {
  return (
    <div className="flex min-h-screen bg-screenBg flex-col header-offset">
      {props.children}
    </div>
  );
};
