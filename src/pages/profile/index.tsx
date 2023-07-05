import { Screen } from "@/components/Screen";
import { jsonParse } from "@/util/format";
import { useRouter } from "next/router";
import { prisma } from "server/db/client";
import { Details } from "@/components/Details";
import { useForm } from "react-hook-form";
import { profileFields } from "./data";
import { useState } from "react";
import { getServerSession } from "next-auth";
import authOptions from "@/pages/api/auth/[...nextauth]";

const Build = (props: any) => {
  const { user } = props;
  const { id } = user ?? {};

  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const [file, setFile] = useState<any>();
  const [isEditing, setIsEditing] = useState(false);

  const updateProfileDetails = async (item: any) => {
    const res = await fetch("/api/user/update", {
      method: "POST",
      body: JSON.stringify({ ...item }),
    });
    if (res.ok) {
      setIsEditing(false);
      router.replace(router.asPath);
    } else {
      alert("Failed to update profile details");
    }
  };

  const onPressCancel = () => setIsEditing(false);
  const onPressEdit = () => setIsEditing(true);

  const onSubmit = (data: any) => {
    updateProfileDetails({ id, ...data });
  };

  return (
    <Screen sidebar>
      <Details
        isEditing={isEditing}
        editable
        register={register}
        title="Profile"
        onPressCancel={onPressCancel}
        onPressEdit={onPressEdit}
        onPressSave={handleSubmit(onSubmit)}
        data={user}
        fields={[...profileFields]}
      />
    </Screen>
  );
};

export const getServerSideProps = async (context: any) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const user = await prisma.user.findFirst({
    where: { email: jsonParse(session).user.email },
    include: { member: true },
  });
  return {
    props: {
      user: jsonParse(user),
    },
  };
};

export default Build;
