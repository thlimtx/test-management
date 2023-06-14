import { Form } from "@/components/Form";
import { Screen } from "@/components/Screen";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => console.log({ data });
  return (
    <Screen>
      <Form
        register={register}
        title="Login"
        fields={[
          { id: "email", title: "Email", placeholder: "Email", type: "email" },
          {
            id: "password",
            title: "Password",
            placeholder: "Password",
            type: "password",
            register: { required: true },
          },
        ]}
        buttons={[
          { text: "Signup", onPress: () => router.push("/signup") },
          { text: "Login", onPress: handleSubmit(onSubmit) },
        ]}
        // footer={
        //   <div className="text-right text-sm">
        //     Forgot password?{" "}
        //     <a className="hyperlink" href="/forgot-password">
        //       Click here.
        //     </a>
        //   </div>
        // }
      />
    </Screen>
  );
};

export default Login;
