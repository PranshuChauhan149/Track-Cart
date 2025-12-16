import { auth } from "@/auth";
import EditRoleAndMoble from "@/components/EditRoleAndMoble";
import Nav from "@/components/Nav";
import connectDb from "@/lib/DB";
import User from "@/models/user.model";
import { redirect } from "next/navigation";
import React from "react";

const Home = async () => {
  await connectDb();
  const session = await auth();
  console.log(session?.user);

  const user = await User.findById(session?.user?.id);
  if (!user) {
    redirect("/login");
  }
  const inComplete =
    !user.mobile || !user.role || (!user.mobile && user.role == "user");
  if (inComplete) {
    return <EditRoleAndMoble />;
  }

  return (
    <>
      <Nav user={user} />
    </>
  );
};

export default Home;
