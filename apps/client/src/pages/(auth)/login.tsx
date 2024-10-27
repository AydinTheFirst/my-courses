import { Button, CardFooter, Divider, Input, Link } from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";

import { CenteredCard } from "@/components";
import { PasswordInput } from "@/components/PasswordInput";
import http from "@/http";
import { sleep } from "@/utils";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    try {
      const { data: res } = await http.post("/auth/login", data);
      localStorage.setItem("token", res.token);
      toast.success("Başarıyla giriş yaptınız!");
      await sleep(1000);
      location.replace("/");
    } catch (error) {
      http.handleError(error);
    }

    setIsLoading(false);
  };

  return (
    <CenteredCard title="Giriş Yap">
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <Input isRequired label="Kullanıcı Adı" name="username" />
        <PasswordInput />
        <Button color="primary" fullWidth isLoading={isLoading} type="submit">
          Giriş Yap
        </Button>
      </form>
      <Divider className="my-5" />
      <CardFooter className="flex-col justify-center">
        <p>Bir hesabın yok mu?</p>
        <Link href="/register">Kayıt Ol</Link>
      </CardFooter>
    </CenteredCard>
  );
};

export default Login;
