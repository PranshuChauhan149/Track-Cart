import { auth } from "@/auth";
import EditRoleAndMoble from "@/components/EditRoleAndMoble";
import Nav from "@/components/Nav";
import connectDb from "@/lib/DB";
import User from "@/models/user.model";
import React from "react";

const Home = async () => {
  await connectDb();
  const session = await auth();

  if (!session?.user?.id) {
    return null; // middleware will handle redirect
  }

  const user = await User.findById(session?.user?.id);

  const plainUser = JSON.parse(JSON.stringify(user));

  if (!user) {
    return null; // let middleware handle it
  }

  const inComplete =
    !user.mobile || !user.role || (!user.mobile && user.role === "user");

  if (inComplete) {
    return <EditRoleAndMoble />;
  }

  return <Nav user={plainUser} />;
};

export default Home;
