import {
  Button,
  CardFooter,
  Checkbox,
  CheckboxProps,
  Divider,
  Input,
  Link,
} from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";

import { CenteredCard } from "@/components";
import { PasswordInput } from "@/components/PasswordInput";
import http from "@/http";
import { sleep } from "@/utils";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());

    console.log(data);

    if (!data.terms || !data.privacy) {
      toast.error(
        "Kullanım koşullarını ve gizlilik politikasını kabul etmelisiniz!",
      );
      setIsLoading(false);
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Şifreler eşleşmiyor!");
      setIsLoading(false);
      return;
    }

    try {
      await http.post("/auth/register", data);
      toast.success("Hesap başarıyla oluşturuldu!");
      await sleep(1000);
      location.replace("/login");
    } catch (error) {
      http.handleError(error);
    }

    setIsLoading(false);
  };

  return (
    <CenteredCard title="Kayıt Ol">
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <Input isRequired label="Email" name="email" type="email" />

        <Input isRequired label="Ad / Soyad" name="displayName" />

        <Input isRequired label="Telefon Numarası" name="phone" />

        <PasswordInput label="Şifre" name="password" />

        <PasswordInput label="Şifreni Doğrula" name="confirmPassword" />

        <CheckInput name="terms">
          Kullanım Koşullarını okudum ve kabul ediyorum.
        </CheckInput>

        <CheckInput name="privacy">
          Gizlilik Politikasını okudum ve kabul ediyorum.
        </CheckInput>

        <Button color="primary" fullWidth isLoading={isLoading} type="submit">
          Kayıt Ol
        </Button>
      </form>
      <Divider className="my-5" />
      <CardFooter className="flex-col justify-center">
        <p>Zaten bir hesabın var mı?</p>
        <Link href="/login">Giriş Yap</Link>
      </CardFooter>
    </CenteredCard>
  );
};

export default Register;

const CheckInput = (props: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      <Checkbox
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
        {...props}
      />

      <input name={props.name} type="hidden" value={String(isChecked)} />
    </>
  );
};
