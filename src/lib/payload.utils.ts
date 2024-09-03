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

    const data = await meRes.json();

    if (!data.user) {
      console.log("No user data returned from API");
      return { user: null };
    }

    return { user: data.user as User };
  } catch (error) {
    console.error("Error in getServerSideUser:", error);
    return { user: null };
  }
};
