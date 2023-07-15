import { Form } from "@/components/Form";
import { Screen } from "@/components/Screen";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState } from "react";

const Login = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: any) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    res?.ok ? router.push("/home") : setErrorMessage(res?.error as string);
  };
  return (
    <Screen>
      <Form
        register={register}
        title="Login"
        fields={[
          {
            id: "email",
            title: "Email",
            placeholder: "Email",
            type: "email",
            register: { required: true },
          },
          {
            id: "password",
            title: "Password",
            placeholder: "Password",
            type: "password",
            register: { required: true },
          },
        ]}
        buttons={[
          { text: "Signup", onPress: () => router.push("/auth/signup") },
          { text: "Login", onPress: handleSubmit(onSubmit) },
        ]}
        error={errorMessage}
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
