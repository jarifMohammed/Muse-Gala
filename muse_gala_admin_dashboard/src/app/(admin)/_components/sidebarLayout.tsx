import { auth } from "@/auth"
import Sidebar from "./sidebar"


export default async function SidebarLayout() {
  const session = await auth()  // always SSR
  // console.log("for me man", session)

  return <Sidebar session={session} />
}
