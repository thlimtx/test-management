import { Form } from "@/components/Form";
import { Screen } from "@/components/Screen";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();
  return (
    <Screen>
      <Form
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
          { text: "Login", onPress: () => console.log("login"), submit: true },
        ]}
        onSubmit={(data) => console.log({ data })}
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
