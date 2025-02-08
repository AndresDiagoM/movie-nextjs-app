import { getServerSession } from "next-auth";
import { authOptions } from "src/app/api/auth/[...nextauth]/route";
// import { getSession } from "next-auth/react";


async function getUserSession() {
    // const session = await getSession();
    // console.log("User session", session);
    // if (!session) {
    //     console.log("User is not logged in", session);
    //     return [];
    // }

    const session2 = await getServerSession(authOptions);
    console.log("Server session", session2);

    return session2;
}

export default getUserSession;