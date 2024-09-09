import { User } from "../payload-types";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";

export const getServerSideUser = async (
  cookies: NextRequest["cookies"] | ReadonlyRequestCookies
) => {
  const token = cookies.get("payload-token")?.value;

  if (!token) {
    console.log("No token found in cookies");
    return { user: null };
  }

  try {
    const meRes = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );

    if (!meRes.ok) {
      console.error(`Error fetching user: ${meRes.status} ${meRes.statusText}`);
      return { user: null };
    }

    const user = (await meRes.json()) as User;

    return { user };
  } catch (error) {
    console.error("Error in getServerSideUser:", error);
    return { user: null };
  }
};

// import { User } from "../payload-types";
// import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
// import { NextRequest } from "next/server";

// export const getServerSideUser = async (
//   cookies: NextRequest["cookies"] | ReadonlyRequestCookies
// ) => {
//   const token = cookies.get("payload-token")?.value;

//   const meRes = await fetch(
//     `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
//     {
//       headers: {
//         Authorization: `JWT ${token}`,
//       },
//     }
//   );

//   const { user } = (await meRes.json()) as {
//     user: User | null;
//   };

//   return { user };
// };
