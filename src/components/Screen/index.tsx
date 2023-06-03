export const Screen = (props: any) => {
  return (
    <div className="flex min-h-screen bg-primaryBg flex-col header-offset">
      {props.children}
    </div>
  );
};
