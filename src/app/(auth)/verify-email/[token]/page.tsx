import VerifyEmailMessage from "@/components/molecules/pages/auth/VerifyEmailMessage";

type Params = Promise<{ token: string }>;

export default async function Page({ params }: { params: Params }) {
  const { token } = await params;

  return <VerifyEmailMessage token={token} />;
}
