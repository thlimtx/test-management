import { Screen } from "@/components/Screen";
import { jsonParse } from "@/util/format";
import { useRouter } from "next/router";
import { prisma } from "server/db/client";
import { Details } from "@/components/Details";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { getServerSession } from "next-auth";
import authOptions from "@/pages/api/auth/[...nextauth]";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Image } from "antd";
import { useSession } from "next-auth/react";

const profileFields = [
  {
    id: "name",
    title: "Name",
    placeholder: "Enter Name",
  },
  {
    id: "email",
    title: "Email",
    placeholder: "Enter email",
  },
];

const Build = (props: any) => {
  const { user } = props;
  const { id } = user ?? {};

  const router = useRouter();
  const session = useSession();
  const { register, handleSubmit } = useForm();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<any>();
  const [isEditing, setIsEditing] = useState(false);

  const updateProfileDetails = async (item: any) => {
    const res = await fetch("/api/user/update", {
      method: "POST",
      body: JSON.stringify({ ...item }),
    });
    if (res.ok) {
      setIsEditing(false);
      setFile(null);
      router.replace(router.asPath);
    } else {
      alert("Failed to update profile details");
    }
  };

  const onPressCancel = () => {
    setIsEditing(false);
    setFile(null);
  };
  const onPressEdit = () => {
    setIsEditing(true);
    setFile(user.image);
  };
  const onChangeFile = (e: any) => {
    const uploadedFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setFile(e?.target?.result);
    };
    reader.readAsDataURL(uploadedFile);
  };

  const onClickPic = () => {
    inputRef?.current?.click();
  };
  const onSubmit = (data: any) => {
    updateProfileDetails({ id, ...data, image: file });
  };
  const onBack = () => {
    router.back();
  };

  return (
    <Screen>
      <Details
        isEditing={isEditing}
        editable
        register={register}
        title="Profile"
        onPressBack={onBack}
        onPressCancel={onPressCancel}
        onPressEdit={onPressEdit}
        onPressSave={handleSubmit(onSubmit)}
        data={user}
        fields={[
          {
            render: ({ isEditing }) => {
              return (
                <div className="flex">
                  <div
                    className={`flex flex-row ${isEditing ? "button" : ""}`}
                    onClick={isEditing ? onClickPic : () => {}}
                  >
                    <input
                      className="hidden"
                      ref={inputRef}
                      id="file"
                      name="file"
                      type="file"
                      onChange={onChangeFile}
                    />
                    {file || user?.image ? (
                      <Image
                        preview={!isEditing}
                        src={file ?? user?.image}
                        alt="profile pic"
                        width={96}
                        height={96}
                        className="mb-2 rounded-full object-cover"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faCircleUser}
                        size="6x"
                        color="gray"
                      />
                    )}
                    {isEditing && <FontAwesomeIcon icon={faPenToSquare} />}
                  </div>
                </div>
              );
            },
          },
          ...profileFields,
        ]}
      />
    </Screen>
  );
};

export const getServerSideProps = async (context: any) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { props: {} };
  }
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
