import { Form } from "@/components/Form";
import { Screen } from "@/components/Screen";

const Signup = () => {
  return (
    <Screen>
      <Form
        title="Register"
        fields={[
          {
            id: "fname",
            placeholder: "First Name",
            register: { required: true },
          },
          {
            id: "lname",
            placeholder: "Last Name",
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
            register: { required: true },
          },
        ]}
        buttons={[{ text: "Sign up", submit: true, type: "invert" }]}
        onSubmit={(data) => console.log(data)}
      />
    </Screen>
  );
};

export default Signup;
