import { Form } from "@/components/Form";
import { Screen } from "@/components/Screen";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

const Signup = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const createUser = async (item: any) => {
    const res = await fetch("../api/user/create", {
      method: "POST",
      body: JSON.stringify({ ...item }),
    });
    if (res.ok) {
      router.push("/home");
    } else {
      alert("Sign up failed.");
    }
  };
  const onSubmit = (data: any) => {
    createUser(data);
  };
  return (
    <Screen>
      <Form
        register={register}
        title="Register"
        fields={[
          {
            id: "name",
            placeholder: "Name",
            register: { required: true },
          },
          {
            id: "email",
            placeholder: "Email",
            type: "email",
            register: { required: true },
          },
          {
            id: "password",
            placeholder: "Password",
            type: "password",
            register: { required: true },
          },
          {
            id: "cpass",
            placeholder: "Confirm Password",
            type: "password",
            register: {
              required: true,
              validate: (value) => value === watch("password"),
            },
          },
        ]}
        buttons={[
          { text: "Sign up", onPress: handleSubmit(onSubmit), type: "invert" },
        ]}
      />
    </Screen>
  );
};

export default Signup;
