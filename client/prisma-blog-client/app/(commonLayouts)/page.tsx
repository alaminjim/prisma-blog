import { Button } from "@/components/ui/button";
import { userService } from "@/service/user.service";

export default async function Home() {
  const session = await userService.getSession();
  const data = session?.data;
  console.log(data);

  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
}
